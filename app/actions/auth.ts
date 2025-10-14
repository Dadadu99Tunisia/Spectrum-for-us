"use server"

import { hash } from "bcrypt"
import { z } from "zod"
import prisma from "@/lib/db"
import { signIn } from "next-auth/react"

// Schéma de validation pour l'inscription
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

// Action d'inscription
export async function register(formData: FormData) {
  // Récupérer et valider les données
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

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return {
      success: false,
      errors: {
        email: ["Un compte avec cette adresse email existe déjà"],
      },
    }
  }

  // Hasher le mot de passe
  const hashedPassword = await hash(password, 10)

  // Créer l'utilisateur
  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Rediriger vers la page de connexion
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

// Action de connexion
export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    return {
      success: false,
      errors: {
        _form: ["Email ou mot de passe incorrect"],
      },
    }
  }
}

