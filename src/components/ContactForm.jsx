import { useRef, useState } from "react"
import { Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const WHATSAPP_NUMBER = "628887771117"
const EMAIL_DESTINATION = "adityapratamaputra.id@gmail.com"

export default function ContactForm() {
  const formRef = useRef(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const buildBody = () =>
    `Hai Aditya, salam kenal,\n\nNama: ${name.trim()}\nEmail: ${email.trim()}\nPesan: ${message.trim()}`

  const isValid = () => {
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity()
      return false
    }
    return true
  }

  const openWhatsApp = (e) => {
    e.preventDefault()
    if (!isValid()) return
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildBody())}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const openEmail = (e) => {
    e.preventDefault()
    if (!isValid()) return
    const subject = encodeURIComponent(`Pesan dari ${name.trim()} — Portfolio Aditya`)
    const body = encodeURIComponent(buildBody())
    window.location.href = `mailto:${EMAIL_DESTINATION}?subject=${subject}&body=${body}`
  }

  return (
    <form ref={formRef} className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="name">Nama</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama lengkap kamu"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Pesan</Label>
        <Textarea
          id="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesanmu di sini..."
          required
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" onClick={openEmail} className="flex-1 sm:flex-none">
          <Mail />
          Kirim via Email
        </Button>
        <Button
          type="submit"
          variant="outline"
          onClick={openWhatsApp}
          className="flex-1 sm:flex-none"
        >
          <MessageCircle />
          Kirim via WhatsApp
        </Button>
      </div>
    </form>
  )
}