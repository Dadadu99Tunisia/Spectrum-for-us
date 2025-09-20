"use server"

import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabaseAdmin" // ⚠️ vérifie le nom du fichier: supabaseAdmin.ts

const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

type RegisterResult = {
  success: boolean
  errors?: Record<string, string[]>
}

export async function register(formData: FormData): Promise<RegisterResult> {
  // Normalise les valeurs FormData (undefined -> "")
  const name = String(formData.get("name") ?? "")
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")

  const validated = registerSchema.safeParse({ name, email, password, confirmPassword })
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    }
  }

  try {
    // 1) Créer l'utilisateur Auth (service role requis)
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // évite l’e-mail de confirmation
        user_metadata: { full_name: name },
      })

    if (authError || !authData?.user) {
      // Erreurs fréquentes: email déjà utilisé, contrainte password, etc.
      const msg = authError?.message?.toLowerCase?.() ?? ""
      const isDuplicate =
        msg.includes("duplicate key") ||
        msg.includes("already registered") ||
        msg.includes("email") && msg.includes("exists")

      return {
        success: false,
        errors: isDuplicate
          ? { email: ["Un compte avec cette adresse email existe déjà."] }
          : { _form: ["Impossible de créer le compte. Vérifiez les informations et réessayez."] },
      }
    }

    // 2) Créer le profil lié (id = auth.users.id)
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: authData.user.id,
        full_name: name,
        role: "buyer",
      })

    if (profileError) {
      // On log mais on ne bloque pas l’inscription (le compte Auth existe déjà)
      console.error("Erreur création profil:", profileError)
    }

    return { success: true }
  } catch (err: any) {
    console.error("Erreur lors de l'inscription:", err)
    return {
      success: false,
      errors: { _form: ["Une erreur est survenue lors de l'inscription. Veuillez réessayer."] },
    }
  }
}
