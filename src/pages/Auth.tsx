import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");     // 👉 send logged users to home
    }
  }, [user, navigate]);

  if (loading) return <div>Loading…</div>;


  const provider = new GoogleAuthProvider();

  const loginWithGoogle = async () => {
    if (signingIn) return;       // 🔒 prevent multiple popups
    setSigningIn(true);
    setError("");

    try {
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Google sign-in failed");
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded">
      <h1 className="text-xl font-bold mb-4">Sign in</h1>

      {error && (
        <p className="text-red-400 mb-3 text-sm">
          {error}
        </p>
      )}

      <button
        onClick={loginWithGoogle}
        disabled={signingIn}
        className="w-full border rounded p-2 hover:bg-gray-900 disabled:opacity-50"
      >
        {signingIn ? "Signing in…" : "Continue with Google"}
      </button>
    </div>
  );
}
