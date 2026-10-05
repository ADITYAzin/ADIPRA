import { useState } from "react"
import { Loader2 } from "lucide-react"
import { supabase } from "../lib/supabase"

export function GoogleSignInButton() {
  const [signingIn, setSigningIn] = useState(false)

  const handleSignIn = async () => {
    setSigningIn(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        email: "verified",
        queryParams: {
          prompt: "select_account",
        },
      },
    })
    setSigningIn(false)
    if (error) {
      console.error("Google Sign In error:", error.message)
    }
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={signingIn}
      className="flex w-full items-center justify-center gap-2 rounded-full border border-input bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-60"
      aria-label="Masuk dengan Google"
    >
      {signingIn ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <img
          src="/google-icon-logo-svgrepo-com.svg"
          alt=""
          className="size-4"
        />
      )}
      {signingIn ? "Memproses..." : "Masuk dengan Google"}
    </button>
  )
}