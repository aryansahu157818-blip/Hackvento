import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

interface HauntFormProps {
  projectId: string;
  projectTitle: string;
  creatorEmail: string;
  onSuccess?: () => void;
}

// -------- EMAILJS SENDER ----------
async function sendHauntEmail(values: {
  fromName: string;
  fromEmail: string;
  message: string;
  projectTitle: string;
  toEmail: string;
}) {
  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID!,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
      values,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
    );
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
// ----------------------------------

export default function HauntForm({
  projectId,
  projectTitle,
  creatorEmail,
  onSuccess,
}: HauntFormProps) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"none" | "pending" | "approved" | "rejected">("none");

  const [formData, setFormData] = useState({
    fromName: user?.displayName || user?.email?.split("@")[0] || "",
    fromEmail: user?.email || "",
    message: "",
  });

  // keep form synced with auth
  useEffect(() => {
    if (user) {
      setFormData({
        fromName: user.displayName || user.email?.split("@")[0] || "",
        fromEmail: user.email || "",
        message: "",
      });
    }
  }, [user]);

  // 🔎 watch interest status in real-time
  useEffect(() => {
    if (!user || !projectId) return;

    const q = query(
      collection(db, "projects", projectId, "interests"),
      where("juniorUid", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      if (snap.empty) {
        setStatus("none");
      } else {
        const data = snap.docs[0].data() as any;
        setStatus(data.status || "pending");
      }
    });

    return () => unsub();
  }, [user, projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in first.");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Please write a short message.");
      return;
    }

    setLoading(true);

    try {
      // prevent duplicates
      const q = query(
        collection(db, "projects", projectId, "interests"),
        where("juniorUid", "==", user.uid)
      );

      const existing = await getDocs(q);

      if (!existing.empty) {
        toast.info("You already sent interest.");
        setLoading(false);
        return;
      }

      // create interest
      await addDoc(collection(db, "projects", projectId, "interests"), {
        projectId,
        juniorUid: user.uid,
        juniorName: formData.fromName,
        juniorEmail: formData.fromEmail,
        message: formData.message,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      // email notification
      await sendHauntEmail({
        ...formData,
        projectTitle,
        toEmail: creatorEmail,
      });

      toast.success("Interest sent!");
      setFormData((f) => ({ ...f, message: "" }));
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Button states
  const renderButton = () => {
    if (!user) return (
      <button className="cyber-button w-full" disabled>
        Sign in to send interest
      </button>
    );

    if (status === "pending")
      return (
        <button className="cyber-button w-full opacity-70" disabled>
          Interest Sent — Waiting ⏳
        </button>
      );

    if (status === "approved")
      return (
        <button className="cyber-button w-full bg-green-600 opacity-80" disabled>
          Approved 🎉
        </button>
      );

    if (status === "rejected")
      return (
        <button className="cyber-button w-full bg-red-600 opacity-80" disabled>
          Rejected ❌
        </button>
      );

    return (
      <button type="submit" className="cyber-button w-full" disabled={loading}>
        {loading ? "Sending..." : "Send Interest"}
      </button>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <h3 className="text-lg font-semibold">Haunt this project 👻</h3>

      {/* Name */}
      <div>
        <label className="block text-sm mb-1">Your Name</label>
        <input
          value={formData.fromName}
          disabled
          className="cyber-input w-full opacity-70 cursor-not-allowed"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm mb-1">Your Email</label>
        <input
          value={formData.fromEmail}
          disabled
          className="cyber-input w-full opacity-70 cursor-not-allowed"
        />
      </div>

      {/* Message */}
      {status === "none" && (
        <div>
          <label className="block text-sm mb-1">
            Why do you want to revive this project?
          </label>
          <textarea
            rows={4}
            className="cyber-input w-full"
            value={formData.message}
            onChange={(e) =>
              setFormData((f) => ({ ...f, message: e.target.value }))
            }
          />
        </div>
      )}

      {renderButton()}
    </form>
  );
}
