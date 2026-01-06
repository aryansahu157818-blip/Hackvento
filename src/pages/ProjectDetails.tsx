import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Github,
  Star,
  GitFork,
  Calendar,
  User,
  Mail,
  ExternalLink,
} from "lucide-react";

import { Layout } from "@/components/Layout";
import { VitalityBar } from "@/components/VitalityBar";
import HauntForm from "@/components/HauntForm";

import { getProjectById, Project } from "@/lib/firebase";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import emailjs from "@emailjs/browser";

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [interests, setInterests] = useState<any[]>([]);

  // 🔎 Load project
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        const data = await getProjectById(id);
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // 👀 Live interests feed
  useEffect(() => {
    if (!project?.id) return;

    const ref = collection(db, "projects", project.id, "interests");

    const unsub = onSnapshot(ref, (snap) => {
      setInterests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [project?.id]);

  // ✉️ Send approval email
  async function sendApprovalEmail(toEmail: string, projectTitle: string) {
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
        {
          toEmail,
          projectTitle,
          subject: "Your request has been approved!",
          message: `Good news! Your request to work on "${projectTitle}" has been approved. The creator may contact you soon.`,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
      );

      return true;
    } catch (err) {
      console.error("Email error:", err);
      return false;
    }
  }

  // ✔ Approve / Reject
  const handleDecision = async (
    interestId: string,
    status: "approved" | "rejected"
  ) => {
    if (!project?.id) return;

    try {
      const ref = doc(db, "projects", project.id, "interests", interestId);

      const interest = interests.find((i) => i.id === interestId);

      await updateDoc(ref, {
        status,
        decidedAt: serverTimestamp(),
        notified: status === "approved",
      });

      if (status === "approved" && interest) {
        const sent = await sendApprovalEmail(
          interest.juniorEmail,
          project.title
        );

        if (!sent) toast.warning("Approved, but email failed.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Could not update decision");
    }
  };

  const getStatusColor = () => {
    if (!project) return "";
    switch (project.status) {
      case "active":
        return "bg-primary/20 text-primary border-primary/30";
      case "dormant":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "haunted":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading project data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This project doesn't exist in the Ghost Vault.
            </p>
            <Link to="/vault" className="cyber-button inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Vault
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              to="/vault"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Ghost Vault
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="cyber-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold neon-text-intense">
                    {project.title}
                  </h1>
                  <span
                    className={`px-3 py-1 text-sm rounded border ${getStatusColor()} uppercase tracking-wider`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Star className="w-5 h-5 text-primary" />
                    <span>{project.stars || 0} stars</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GitFork className="w-5 h-5 text-primary" />
                    <span>{project.forks || 0} forks</span>
                  </div>

                  {project.lastUpdated && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span>
                        Updated{" "}
                        {new Date(project.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <VitalityBar score={project.vitalityScore} />
                </div>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-button inline-flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>

              {/* Ghost Log */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="cyber-card"
              >
                <h2 className="text-xl font-bold mb-4 neon-text">Ghost Log</h2>
                <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
                  "{project.ghostLog}"
                </blockquote>
              </motion.div>

              {/* Creator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="cyber-card"
              >
                <h2 className="text-xl font-bold mb-4 neon-text">
                  Project Creator
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary" />
                    <span>{project.creatorName}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>{project.creatorEmail}</span>
                  </div>
                </div>
              </motion.div>

              {/* Interest System — Only Creator Sees */}
              {user?.email === project.creatorEmail && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="cyber-card"
                >
                  <h2 className="text-xl font-bold mb-3">
                    Interest Requests
                  </h2>

                  {interests.length === 0 && (
                    <p className="text-muted-foreground">
                      No interests yet.
                    </p>
                  )}

                  {interests.map((int) => (
                    <div key={int.id} className="border-b py-3 last:border-b-0">
                      <p className="font-semibold">
                        {int.juniorName} — {int.juniorEmail}
                      </p>

                      <p className="text-sm">{int.message}</p>

                      <p className="text-xs text-muted-foreground mt-1">
                        Status: {int.status}
                      </p>

                      {int.status === "pending" && (
                        <div className="flex gap-3 mt-2">
                          <button
                            onClick={() =>
                              handleDecision(int.id, "approved")
                            }
                            className="px-3 py-1 bg-green-600 rounded text-sm"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              handleDecision(int.id, "rejected")
                            }
                            className="px-3 py-1 bg-red-600 rounded text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Sidebar — Haunt Form */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <HauntForm
                  projectId={project.id!}
                  projectTitle={project.title}
                  creatorEmail={project.creatorEmail}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetails;
