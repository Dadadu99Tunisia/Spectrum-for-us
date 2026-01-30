// Singleton pour gérer la synthèse vocale
class SpeechService {
  private static instance: SpeechService
  private synth: SpeechSynthesis | null = null
  private voices: SpeechSynthesisVoice[] = []
  private isEnabled = false
  private currentLanguage = "fr-FR"
  private isSpeaking = false
  private queue: string[] = []

  private constructor() {
    if (typeof window !== "undefined") {
      this.synth = window.speechSynthesis
      this.loadVoices()

      // Charger les préférences depuis localStorage
      const savedEnabled = localStorage.getItem("speechEnabled")
      if (savedEnabled) {
        this.isEnabled = savedEnabled === "true"
      }
    }
  }

  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService()
    }
    return SpeechService.instance
  }

  private loadVoices(): void {
    if (!this.synth) return

    // Fonction pour charger les voix
    const loadVoicesFn = () => {
      this.voices = this.synth?.getVoices() || []
    }

    // Charger les voix immédiatement et aussi lors de l'événement voiceschanged
    loadVoicesFn()
    this.synth.addEventListener("voiceschanged", loadVoicesFn)
  }

  public setLanguage(lang: string): void {
    // Convertir le code de langue en format compatible avec l'API Speech
    switch (lang) {
      case "fr":
        this.currentLanguage = "fr-FR"
        break
      case "en":
        this.currentLanguage = "en-US"
        break
      case "es":
        this.currentLanguage = "es-ES"
        break
      case "de":
        this.currentLanguage = "de-DE"
        break
      case "it":
        this.currentLanguage = "it-IT"
        break
      default:
        this.currentLanguage = "fr-FR"
    }
  }

  public speak(text: string): void {
    if (!this.isEnabled || !this.synth || !text) return

    // Ajouter à la file d'attente
    this.queue.push(text)

    // Si rien n'est en cours de lecture, commencer la lecture
    if (!this.isSpeaking) {
      this.processQueue()
    }
  }

  private processQueue(): void {
    if (!this.synth || this.queue.length === 0) {
      this.isSpeaking = false
      return
    }

    this.isSpeaking = true
    const text = this.queue.shift() || ""

    // Trouver la voix appropriée pour la langue actuelle
    let voice = this.voices.find((v) => v.lang.startsWith(this.currentLanguage))

    // Si aucune voix n'est trouvée pour la langue, utiliser la première disponible
    if (!voice && this.voices.length > 0) {
      voice = this.voices[0]
    }

    const utterance = new SpeechSynthesisUtterance(text)
    if (voice) utterance.voice = voice
    utterance.lang = this.currentLanguage
    utterance.rate = 1.0
    utterance.pitch = 1.0

    utterance.onend = () => {
      // Passer au texte suivant dans la file d'attente
      this.processQueue()
    }

    utterance.onerror = (event) => {
      console.error("Erreur de synthèse vocale:", event)
      this.processQueue()
    }

    this.synth.speak(utterance)
  }

  public stop(): void {
    if (!this.synth) return
    this.synth.cancel()
    this.queue = []
    this.isSpeaking = false
  }

  public toggle(): boolean {
    this.isEnabled = !this.isEnabled

    // Sauvegarder la préférence
    if (typeof window !== "undefined") {
      localStorage.setItem("speechEnabled", this.isEnabled.toString())
    }

    if (!this.isEnabled) {
      this.stop()
    }

    return this.isEnabled
  }

  public isActive(): boolean {
    return this.isEnabled
  }
}

export default SpeechService
