"use client"

import { useState, lazy, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"

const LiveChat = lazy(() => import("./live-chat"))

export default function ChatTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 shadow-lg bg-purple-600 hover:bg-purple-700"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-end p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-96 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Assistant Spectrum</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                }
              >
                <LiveChat />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
