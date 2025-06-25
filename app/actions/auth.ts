import { auth } from "@/auth"
import bcrypt from "bcryptjs"

import { db } from "@/lib/db"
import { LoginSchema } from "@/schemas"
import { signIn } from "@/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { AuthError } from "next-auth"

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { email, password } = validatedFields.data

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" }
        default:
          return { error: "Something went wrong!" }
      }
    }

    throw error
  }
}

import type * as z from "zod"
import { RegisterSchema } from "@/schemas"

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { email, password, name } = validatedFields.data

  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  })

  if (existingUser) {
    return { error: "Email already in use!" }
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  // TODO: Send verification token
  return { success: "User created!" }
}

export const logout = async () => {
  await auth.signOut()
}
