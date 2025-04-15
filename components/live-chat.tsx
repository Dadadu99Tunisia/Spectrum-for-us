"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, X, MessageSquare } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Si pas encore monté, ne rien afficher pour éviter les erreurs d'hydratation
  if (!mounted) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const userMessage = { role: "user" as const, content: message }
    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.text()
      setMessages((prev) => [...prev, { role: "assistant", content: data }])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Désolé, une erreur s'est produite. Veuillez réessayer plus tard." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={cn(
              "fixed bottom-20 right-4 z-50 w-80 rounded-lg shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
              isMobile && "w-[calc(100%-2rem)] mx-4",
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <h3 className="font-medium">Chat en direct</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 h-80 overflow-y-auto flex flex-col gap-3">
              <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%] self-start">
                <p className="text-sm">
                  Bonjour ! Comment puis-je vous aider aujourd'hui ? N'hésitez pas à me poser des questions sur
                  Spectrum.
                </p>
              </div>

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg max-w-[80%]",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground self-end rounded-tr-none"
                      : "bg-muted self-start rounded-tl-none",
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              ))}

              {isLoading && (
                <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%] self-start">
                  <div className="flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-800 flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-50 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        >
          <MessageSquare className="h-5 w-5" />
        </motion.button>
      )}
    </>
  )
}
