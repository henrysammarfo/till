import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LogIn, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { completeStudioSignIn } from "@/integrations/supabase/studio-session";
import { lovable } from "@/integrations/lovable/index";
import { Logo } from "@/components/Logo";

async function mirrorSessionCookies() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return;
  await completeStudioSignIn({
    data: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    },
  });
}

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Team sign in — TILL Studio" },
      {
        name: "description",
        content: "Sign in to the TILL Studio admin to manage bookings, clients and projects.",
      },
      { property: "og:title", content: "Team sign in — TILL Studio" },
      {
        property: "og:description",
        content: "Admin access for bookings, clients and project delivery.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else {
        try {
          await mirrorSessionCookies();
          navigate({ to: "/dashboard" });
        } catch (e) {
          setError(e instanceof Error ? e.message : "Session cookie hydrate failed");
        }
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) setError(error.message);
      else {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          try {
            await mirrorSessionCookies();
            navigate({ to: "/dashboard" });
          } catch (e) {
            setError(e instanceof Error ? e.message : "Session cookie hydrate failed");
          }
        } else setNotice("Check your inbox to confirm the address, then sign in.");
      }
    }
    setBusy(false);
  }

  async function google() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Google sign-in failed. Try email instead.");
      return;
    }
    if (result.redirected) return;
    try {
      await mirrorSessionCookies();
      navigate({ to: "/dashboard" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Session cookie hydrate failed");
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <Logo to="/" />
        <h1 className="h3" style={{ marginTop: 28 }}>
          {mode === "in" ? "Sign in to the studio" : "Create your studio account"}
        </h1>
        <p className="body-sm" style={{ marginTop: 8 }}>
          Admin access to bookings, clients and project delivery.
        </p>

        <button type="button" className="btn-secondary auth-google" onClick={google}>
          Continue with Google
        </button>

        <div className="auth-or">or</div>

        <form onSubmit={submit}>
          {mode === "up" && (
            <div className="field">
              <label className="label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="field">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              minLength={6}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}
          {notice && <p className="body-sm">{notice}</p>}

          <button className="btn-primary" style={{ width: "100%" }} disabled={busy}>
            <LogIn size={16} strokeWidth={1.9} />
            {busy ? "Working…" : mode === "in" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          className="auth-switch"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
        >
          {mode === "in" ? "No account yet? Create one" : "Already have an account? Sign in"}
        </button>

        <p className="auth-foot">
          <ShieldCheck size={14} strokeWidth={1.9} />
          Clients track work in the <Link to="/portal">client portal</Link>.
        </p>
      </div>
    </div>
  );
}
