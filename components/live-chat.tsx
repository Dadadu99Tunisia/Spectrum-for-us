"use client"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendHorizonal, X } from "lucide-react"

interface LiveChatProps {
  isOpen: boolean
  onClose: () => void
}

export default function LiveChat({ isOpen, onClose }: LiveChatProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()

  if (!isOpen) {
    return null
  }

  return (
    <Card className="fixed bottom-24 right-4 w-full max-w-md h-[500px] flex flex-col shadow-2xl z-50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Assistant Spectrum
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <ScrollArea className="flex-1 p-4">
        <CardContent className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-2 max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={m.role === "user" ? "/images/user-avatar.png" : "/images/assistant-avatar.png"}
                    alt={m.role === "user" ? "User" : "Assistant"}
                  />
                  <AvatarFallback>{m.role === "user" ? "U" : "A"}</AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-2 whitespace-pre-wrap ${
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </ScrollArea>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Posez votre question..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
