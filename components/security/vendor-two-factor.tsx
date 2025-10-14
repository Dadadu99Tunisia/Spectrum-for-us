"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { QrCode, ShieldCheck, Smartphone } from "lucide-react"

export default function VendorTwoFactor() {
  const [step, setStep] = useState<"setup" | "verify" | "complete">("setup")
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")

  const handleSetup = () => {
    // In a real app, this would trigger the 2FA setup process
    setStep("verify")
  }

  const handleVerify = () => {
    // In a real app, this would verify the code against the generated secret
    if (verificationCode.length !== 6) {
      setError("Le code doit comporter 6 chiffres")
      return
    }

    // Simulate verification
    if (verificationCode === "123456") {
      setStep("complete")
      setError("")
    } else {
      setError("Code incorrect. Veuillez réessayer.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentification à Deux Facteurs</CardTitle>
        <CardDescription>Sécurisez votre compte vendeur avec une authentification supplémentaire</CardDescription>
      </CardHeader>
      <CardContent>
        {step === "setup" && (
          <div className="space-y-4">
            <Alert className="bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-900">
              <ShieldCheck className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <AlertTitle>Recommandation de sécurité</AlertTitle>
              <AlertDescription>
                L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre compte vendeur,
                protégeant vos données et vos ventes.
              </AlertDescription>
            </Alert>

            <div className="flex items-start gap-4 mt-6">
              <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full">
                <Smartphone className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Application d'authentification</h3>
                <p className="text-sm text-muted-foreground">
                  Vous aurez besoin d'une application d'authentification comme Google Authenticator, Authy ou Microsoft
                  Authenticator.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-6">
            <div className="flex justify-center mb-4">
              <div className="p-2 border rounded-lg bg-white">
                {/* This would be a real QR code in production */}
                <QrCode className="h-40 w-40 text-black" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-center text-muted-foreground">
                Scannez ce code QR avec votre application d'authentification ou saisissez manuellement cette clé :
              </p>
              <p className="text-center font-mono bg-muted p-2 rounded-md">ABCD EFGH IJKL MNOP</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="verification-code" className="text-sm font-medium">
                Code de vérification
              </label>
              <Input
                id="verification-code"
                placeholder="Entrez le code à 6 chiffres"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
        )}

        {step === "complete" && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold">Configuration terminée</h3>
            <p className="text-muted-foreground">
              L'authentification à deux facteurs a été activée avec succès pour votre compte. Votre boutique est
              maintenant mieux protégée.
            </p>

            <Alert className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900 mt-4">
              <AlertTitle>Codes de secours</AlertTitle>
              <AlertDescription>
                Conservez ces codes de secours dans un endroit sûr. Ils vous permettront d'accéder à votre compte si
                vous perdez l'accès à votre application d'authentification.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {["ABCD-EFGH", "IJKL-MNOP", "QRST-UVWX", "YZAB-CDEF", "GHIJ-KLMN", "OPQR-STUV"].map((code, index) => (
                <div key={index} className="bg-muted p-2 rounded text-sm font-mono">
                  {code}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {step === "setup" && (
          <Button onClick={handleSetup} className="w-full">
            Configurer l'authentification à deux facteurs
          </Button>
        )}

        {step === "verify" && (
          <div className="flex flex-col w-full gap-2">
            <Button onClick={handleVerify}>Vérifier et activer</Button>
            <Button variant="outline" onClick={() => setStep("setup")}>
              Retour
            </Button>
          </div>
        )}

        {step === "complete" && (
          <Button onClick={() => {}} className="w-full">
            Terminer
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

