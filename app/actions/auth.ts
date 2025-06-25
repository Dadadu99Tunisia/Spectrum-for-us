import { auth } from "@/auth"

// Actions temporairement désactivées
export const login = async (values: any) => {
  return { success: false, message: "Temporairement désactivé" }
}

// Actions temporairement désactivées
export const register = async (values: any) => {
  return { success: false, message: "Temporairement désactivé" }
}

export const logout = async () => {
  await auth.signOut()
}
