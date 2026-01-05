const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

// ------- TYPES -------

export interface GitHubRepoStats {
  name: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  language: string;
  lastUpdated: string;
  createdAt: string;
}

// ------- URL PARSER -------

export const extractRepoInfo = (
  url: string
): { owner: string; repo: string } | null => {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);

  if (!match) return null;

  return {
    owner: match[1],
    repo: match[2].replace(".git", ""),
  };
};

// ------- FETCH STATS -------

export const fetchGitHubStats = async (
  githubUrl: string
): Promise<GitHubRepoStats | null> => {
  const repoInfo = extractRepoInfo(githubUrl);

  if (!repoInfo) {
    console.error("Invalid GitHub URL");
    return null;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`,
      {
        headers: GITHUB_TOKEN
          ? {
              Authorization: `Bearer ${GITHUB_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
            }
          : {
              Accept: "application/vnd.github.v3+json",
            },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      name: data.name,
      description: data.description || "No description available",
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.watchers_count,
      openIssues: data.open_issues_count,
      language: data.language || "Unknown",
      lastUpdated: data.updated_at,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    return null;
  }
};

// ------- VITALITY SCORE -------

export const calculateVitalityScore = (stats: GitHubRepoStats): number => {
  const now = new Date();
  const lastUpdate = new Date(stats.lastUpdated);

  const daysSinceUpdate = Math.floor(
    (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
  );

  let score = 50;

  // Stars contribution (max 20)
  score += Math.min(stats.stars / 10, 20);

  // Forks contribution (max 10)
  score += Math.min(stats.forks / 5, 10);

  // Recency contribution (max 20)
  if (daysSinceUpdate < 7) score += 20;
  else if (daysSinceUpdate < 30) score += 15;
  else if (daysSinceUpdate < 90) score += 10;
  else if (daysSinceUpdate < 180) score += 5;
  else score -= 10;

  return Math.min(Math.max(Math.round(score), 0), 100);
};
