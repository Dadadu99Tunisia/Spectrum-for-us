import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SocialLinks() {
  const socials = [
    { icon: Facebook, href: "https://facebook.com/spectrumforus", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/spectrumforus", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/spectrumforus", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/spectrumforus", label: "LinkedIn" },
    { icon: Youtube, href: "https://youtube.com/@spectrumforus", label: "YouTube" },
  ]

  return (
    <div className="flex gap-2">
      {socials.map((social) => (
        <Button key={social.label} variant="ghost" size="icon" asChild className="hover:bg-primary/10">
          <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
            <social.icon className="h-5 w-5" />
          </a>
        </Button>
      ))}
    </div>
  )
}
