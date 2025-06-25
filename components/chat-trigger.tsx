"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { MessageSquare, Loader2 } from "lucide-react"

// Importer le composant de chat de manière dynamique
const LiveChat = dynamic(() => import("./live-chat"), {
  loading: () => (
    <div className="fixed bottom-4 right-4">
      <Button size="icon" className="rounded-full h-14 w-14 shadow-lg">
        <Loader2 className="h-6 w-6 animate-spin" />
      </Button>
    </div>
  ),
  ssr: false, // Ce composant ne sera rendu que côté client
})

export function ChatTrigger() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          size="icon"
          className="rounded-full h-14 w-14 shadow-lg"
          onClick={() => setIsChatOpen(true)}
          aria-label="Ouvrir le chat"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
      {isChatOpen && <LiveChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}
    </>
  )
}
