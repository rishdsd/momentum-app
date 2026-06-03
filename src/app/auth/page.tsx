"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

type Mode = "magic" | "signin" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const needsPassword = mode === "signin" || mode === "signup";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setIsSuccess(false);
    const supabase = createClient();

    if (mode === "magic") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setIsSubmitting(false);
      if (error) {
        setMessage(error.message);
      } else {
        setIsSuccess(true);
        setMessage("Check your email for the sign-in link.");
      }
      return;
    }

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setIsSubmitting(false);
      if (error) {
        setMessage(error.message);
      } else {
        setIsSuccess(true);
        setMessage("Account created! Check your email to confirm, then sign in.");
      }
      return;
    }

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setIsSubmitting(false);
      if (error) {
        setMessage(error.message);
        return;
      }
      window.location.href = "/";
    }
  }

  const titles: Record<Mode, string> = {
    magic: "Sign in",
    signin: "Sign in",
    signup: "Create account",
  };

  const subtitles: Record<Mode, string> = {
    magic: "Enter your email and we'll send a magic link.",
    signin: "Sign in with your email and password.",
    signup: "Create a new account with email and password.",
  };

  const submitLabel: Record<Mode, string> = {
    magic: "Send magic link",
    signin: "Sign in",
    signup: "Create account",
  };

  return (
    <main className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Momentum</span>
        <h1>{titles[mode]}</h1>
        <p>{subtitles[mode]}</p>

        {/* Mode switcher tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "magic" ? "auth-tab active" : "auth-tab"}
            onClick={() => { setMode("magic"); setMessage(""); }}
          >
            Magic link
          </button>
          <button
            type="button"
            className={mode === "signin" ? "auth-tab active" : "auth-tab"}
            onClick={() => { setMode("signin"); setMessage(""); }}
          >
            Log in
          </button>
          <button
            type="button"
            className={mode === "signup" ? "auth-tab active" : "auth-tab"}
            onClick={() => { setMode("signup"); setMessage(""); }}
          >
            New account
          </button>
        </div>

        <label>
          Email
          <input
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </label>

        {needsPassword && (
          <label>
            Password
            <input
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              type="password"
              value={password}
            />
          </label>
        )}

        <button
          className="primary-button"
          disabled={isSubmitting || !email || (needsPassword && password.length < 6)}
          type="submit"
          style={{ marginTop: "4px" }}
        >
          {isSubmitting ? "Please wait..." : submitLabel[mode]}
        </button>

        {message ? (
          <p className="muted-copy" style={{ color: isSuccess ? "var(--green)" : "var(--coral)" }}>
            {message}
          </p>
        ) : null}
      </form>
    </main>
  );
}