import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export async function AuthStatus() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link className="ghost-button" href="/auth">
        Sign in
      </Link>
    );
  }

  return <span className="auth-pill">{user.email}</span>;
}
