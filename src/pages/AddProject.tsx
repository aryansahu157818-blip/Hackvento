import { useState } from "react";
import { fetchGitHubStats, calculateVitalityScore } from "@/lib/github";
import { addProject } from "@/lib/firebase";

export default function AddProject() {
  const [githubUrl, setGithubUrl] = useState("");
  const [title, setTitle] = useState("");
  const [ghostLog, setGhostLog] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [message, setMessage] = useState("");

  const handleFetch = async () => {
    setMessage("");
    setStats(null);
    setLoading(true);

    const data = await fetchGitHubStats(githubUrl);

    if (!data) {
      setMessage("Could not fetch repo — check URL.");
      setLoading(false);
      return;
    }

    const vitality = calculateVitalityScore(data);
    setStats({ ...data, vitality });

    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!stats || !title) {
      setMessage("Fill everything first.");
      return;
    }

    setLoading(true);

    await addProject({
      title,
      githubUrl,
      creatorName: "Anonymous",
      creatorEmail: "unknown",
      ghostLog,
      vitalityScore: stats.vitality,
      status: "active",
      ghostLog,
    });

    setMessage("Project added to vault!");
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-4">
      <h1 className="text-xl font-bold">Add Project</h1>

      {message && <p>{message}</p>}

      <input
        className="w-full border p-2"
        placeholder="GitHub Repo URL"
        value={githubUrl}
        onChange={(e) => setGithubUrl(e.target.value)}
      />

      <button onClick={handleFetch} className="border px-4 py-2">
        {loading ? "Fetching..." : "Fetch Repo Data"}
      </button>

      {stats && (
        <div className="border p-3 space-y-2">
          <p><strong>Name:</strong> {stats.name}</p>
          <p><strong>Stars:</strong> {stats.stars}</p>
          <p><strong>Vitality:</strong> {stats.vitality}</p>
        </div>
      )}

      <input
        className="w-full border p-2"
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border p-2"
        placeholder="Why is this abandoned?"
        value={ghostLog}
        onChange={(e) => setGhostLog(e.target.value)}
      />

      <button onClick={handleSubmit} className="border px-4 py-2">
        Submit to Vault
      </button>
    </div>
  );
}
