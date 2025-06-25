import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

export async function signUp(formData: FormData) {
  "use server"

  const email = String(formData.get("email"))
  const password = String(formData.get("password"))
  const firstName = String(formData.get("firstName"))
  const lastName = String(formData.get("lastName"))
  const phone = String(formData.get("phone"))

  const supabase = createClient(cookies())

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        user_id: uuidv4(),
      },
    },
  })

  if (error) {
    return redirect("/signup?message=Could not authenticate user")
  }

  return redirect("/verify?message=Check email to verify account!")
}

export async function signIn(formData: FormData) {
  "use server"

  const email = String(formData.get("email"))
  const password = String(formData.get("password"))
  const supabase = createClient(cookies())

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect("/login?message=Could not authenticate user")
  }

  return redirect("/")
}

export async function signOut() {
  const supabase = createClient(cookies())
  await supabase.auth.signOut()
  return redirect("/login")
}
