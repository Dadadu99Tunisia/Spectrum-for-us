"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MessageCircle, X, Send, Minimize2, Maximize2, Volume2, VolumeX } from "lucide-react"
import { Translate } from "@/components/translate"
import { cn } from "@/lib/utils"
import { useChat } from "ai/react"

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null

  // Utiliser une approche CSS-first pour la responsivité au lieu d'un hook de détection
  // Nous utiliserons les classes Tailwind pour gérer les différentes tailles d'écran

  // Utiliser le hook useChat de l'AI SDK avec la bonne configuration
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
        role: "assistant",
      },
    ],
    onFinish: (message) => {
      // Lire la réponse si la synthèse vocale est activée
      if (speechEnabled && synth) {
        const utterance = new SpeechSynthesisUtterance(message.content)
        utterance.lang = "fr-FR"
        synth.speak(utterance)
      }
    },
  })

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggleChat = () => {
    setIsOpen((prev) => !prev)
    setIsMinimized(false)
  }

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev)
  }

  const toggleSpeech = () => {
    setSpeechEnabled((prev) => !prev)
    if (speechEnabled && synth) {
      synth.cancel() // Arrêter toute lecture en cours
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <Card
          className={cn(
            "transition-all duration-300 transform mb-2",
            isMinimized ? "h-16" : "h-[450px] w-80 md:w-96",
            "md:bottom-auto md:left-auto md:right-auto md:m-0 md:rounded-lg",
            "sm:fixed sm:bottom-0 sm:left-0 sm:right-0 sm:m-0 sm:rounded-b-none sm:h-[400px] sm:w-full",
          )}
        >
          <CardHeader className="p-3 border-b flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <img
                    src="/images/support-agent.jpg"
                    alt="Support Agent"
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=32&width=32"
                    }}
                  />
                </Avatar>
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500"></span>
              </div>
              <div>
                <p className="text-sm font-medium">
                  <Translate text="Support Spectrum" />
                </p>
                <p className="text-xs text-muted-foreground">
                  <Translate text="En ligne" />
                </p>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={toggleSpeech}
                aria-label={speechEnabled ? "Désactiver la lecture vocale" : "Activer la lecture vocale"}
              >
                {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={toggleMinimize}
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleChat} aria-label="Close chat">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="p-3 overflow-y-auto flex-grow h-[330px]">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3",
                          msg.role === "user"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800",
                        )}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[80%]">
                        <div className="flex space-x-1">
                          <span className="animate-bounce">•</span>
                          <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                            •
                          </span>
                          <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
                            •
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="flex justify-center">
                      <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg p-3 max-w-[90%]">
                        <p className="text-sm">Une erreur s'est produite. Veuillez réessayer.</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <CardFooter className="p-3 pt-0 border-t">
                <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Écrivez votre message..."
                    className="flex-grow"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </>
          )}
        </Card>
      )}

      <Button
        onClick={toggleChat}
        className={cn(
          "rounded-full shadow-lg",
          "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
          "h-14 w-14",
          "sm:h-12 sm:w-12 sm:fixed sm:bottom-4 sm:right-4 sm:z-50",
        )}
        aria-label="Chat with support"
      >
        {isOpen ? <X className="h-6 w-6 sm:h-5 sm:w-5" /> : <MessageCircle className="h-6 w-6 sm:h-5 sm:w-5" />}
      </Button>
    </div>
  )
}
