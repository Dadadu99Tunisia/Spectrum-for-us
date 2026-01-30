"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function EditProfilePage() {
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // TODO: Save to Supabase
    setTimeout(() => {
      setSaving(false)
      alert("Profil mis à jour !")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-8">Modifier mon profil</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom d'affichage</Label>
            <Input id="name" placeholder="Votre nom" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Parlez-nous de vous..." rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pronouns">Pronoms (optionnel)</Label>
            <Input id="pronouns" placeholder="il/elle/iel/they..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Site web</Label>
            <Input id="website" type="url" placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" placeholder="@username" />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Link href="/dashboard">
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
