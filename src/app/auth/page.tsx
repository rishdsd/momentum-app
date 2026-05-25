"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function sendMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setIsSubmitting(false);
    setMessage(error ? error.message : "Check your email for the sign-in link.");
  }

  async function signUpWithPassword() {
    setIsSubmitting(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setIsSubmitting(false);
    setMessage(
      error
        ? error.message
        : "Account created. If email confirmation is enabled in Supabase, confirm your email before signing in.",
    );
  }

  async function signInWithPassword() {
    setIsSubmitting(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsSubmitting(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    window.location.href = "/";
  }

  return (
    <main className="auth-screen">
      <form className="auth-card" onSubmit={sendMagicLink}>
        <span className="eyebrow">Momentum</span>
        <h1>Sign in</h1>
        <p>Use a magic link, or use email/password if Supabase email delivery is being slow.</p>
        <label>
          Email
          <input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </label>
        <label>
          Password
          <input
            autoComplete="current-password"
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            type="password"
            value={password}
          />
        </label>
        <div className="auth-actions">
          <button className="primary-button" disabled={isSubmitting || !email} type="submit">
            {isSubmitting ? "Sending..." : "Send magic link"}
          </button>
          <button
            className="ghost-button"
            disabled={isSubmitting || !email || password.length < 6}
            onClick={signInWithPassword}
            type="button"
          >
            Sign in
          </button>
          <button
            className="ghost-button"
            disabled={isSubmitting || !email || password.length < 6}
            onClick={signUpWithPassword}
            type="button"
          >
            Create account
          </button>
        </div>
        {message ? <p className="muted-copy">{message}</p> : null}
        <p className="muted-copy">
          If no emails arrive, check Supabase Auth email settings and spam. For local testing, you can disable email
          confirmations in Supabase and use password sign-in.
        </p>
      </form>
    </main>
  );
}
