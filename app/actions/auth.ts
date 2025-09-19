"use server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase-admin"

const registerSchema = z
  .object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Veuillez entrer une adresse email valide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export async function register(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  const validatedFields = registerSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    // Créer l'utilisateur avec Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
      },
    })

    if (authError || !authData.user) {
      return {
        success: false,
        errors: {
          email: ["Un compte avec cette adresse email existe déjà ou erreur de création"],
        },
      }
    }

    // Créer le profil utilisateur
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: authData.user.id,
      full_name: name,
      role: "buyer",
    })

    if (profileError) {
      console.error("Erreur création profil:", profileError)
    }

    return { success: true }
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    return {
      success: false,
      errors: {
        _form: ["Une erreur est survenue lors de l'inscription. Veuillez réessayer."],
      },
    }
  }
}
