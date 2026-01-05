const GEMINI_API_KEY = 'AIzaSyD-T_3k8FwLzQWqR1m_B6u8V4Xy_G9zL0';

export interface GhostLogResponse {
  ghostLog: string;
  status: 'active' | 'dormant' | 'haunted';
}

export const generateGhostLog = async (
  projectName: string,
  description: string,
  stats: { stars: number; forks: number; lastUpdated: string }
): Promise<GhostLogResponse> => {
  const prompt = `You are Ghost Whisperer, an AI that analyzes open source projects and generates mysterious, cyberpunk-themed summaries called "Ghost Logs". 

Analyze this project and create a Ghost Log:
- Project: ${projectName}
- Description: ${description}
- Stars: ${stats.stars}
- Forks: ${stats.forks}
- Last Updated: ${stats.lastUpdated}

Generate a Ghost Log (2-3 sentences max) that:
1. Describes the project's purpose in a mysterious, cyberpunk tone
2. Hints at its potential and community activity
3. Uses terms like "digital echoes", "code spirits", "neural pathways", etc.

Also determine the project status:
- "active" if updated within 30 days and has good activity
- "dormant" if hasn't been updated in 30-180 days
- "haunted" if abandoned (>180 days) or has concerning metrics

Respond in JSON format:
{
  "ghostLog": "your ghost log text here",
  "status": "active|dormant|haunted"
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 256,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract JSON from response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        ghostLog: parsed.ghostLog || 'Digital echoes resonate through the void...',
        status: parsed.status || 'dormant'
      };
    }

    return {
      ghostLog: 'Digital echoes resonate through the void. This project awaits a new soul to channel its power.',
      status: 'dormant'
    };
  } catch (error) {
    console.error('Error generating Ghost Log:', error);
    return {
      ghostLog: 'The spirits remain silent on this one. Perhaps its true nature will reveal itself in time.',
      status: 'dormant'
    };
  }
};
