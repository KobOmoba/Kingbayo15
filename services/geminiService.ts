import { GoogleGenAI } from "@google/genai";
import { AccumulatorResult, RiskLevel, SportType, SourceLink, AppMode } from '../types';

// Support both standard process.env (Node) and import.meta.env (Vite)
// Vercel/Vite requires variables to start with VITE_ to be exposed to the browser.
const apiKey = (import.meta as any).env?.VITE_API_KEY || process.env.API_KEY || process.env.VITE_API_KEY;

if (!apiKey) {
  console.warn("API Key is missing. Ensure VITE_API_KEY is set in your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const generatePredictions = async (
  mode: AppMode,
  sport: SportType,
  risk: RiskLevel,
  count: number, // Only used for LIVE mode now. For Acca, AI decides leg counts.
  selectedMarkets: string[] = [] // New parameter for Bet Builder
): Promise<{ data: AccumulatorResult; sources: SourceLink[] }> => {
  
  if (!apiKey) {
    throw new Error("API Key not configured. Please set VITE_API_KEY in your Vercel project settings.");
  }

  const model = 'gemini-2.5-flash';
  
  // The Guiding Constitution for the AI
  const PILLARS_OF_SUCCESS = `
    YOU ARE A RUTHLESS, COLD-BLOODED SPORTS ANALYST. 
    YOUR ONLY GOAL IS TO IDENTIFY INEFFICIENCIES AND EXPLOIT THEM.
    YOU DO NOT CARE ABOUT TEAM REPUTATION. YOU CARE ONLY ABOUT WINNING.
    
    EXECUTE THE FOLLOWING PROTOCOL WITHOUT MERCY:

    1. **RUTHLESS DISCIPLINE**: No "gut feelings". If the stats don't scream value, discard the game. If the odds are bad, walk away.
    2. **PREDATORY KNOWLEDGE**: Hunt where the bookies are weak. Ignore the popular "trap" games in top leagues if the value isn't there. Exploit lower leagues and niche markets.
    3. **ZERO EMOTION**: You have no favorite team. You have no loyalty. You only respect data. If a giant is stumbling, bet against them without hesitation.
    4. **MATHEMATICAL DOMINANCE**: Implied probability vs Actual probability. If the math doesn't yield a positive expected value (+EV), the bet is trash.
    5. **LONG-TERM WARFARE**: We are not gambling; we are investing. We seek sustainable growth (5-10 odds), not lottery tickets.
    6. **ADAPTIVE LETHALITY**: Factors like weather, motivation (relegation desperate vs mid-table safe), and late injuries are critical.
  `;

  // Use concrete values in template to prevent AI from outputting type descriptions
  const baseMatchStructure = `
    {
      "homeTeam": "Team A",
      "awayTeam": "Team B",
      "league": "League Name",
      "country": "Country",
      "startTime": "14:00 UTC",
      "prediction": "Home Win",
      "market": "1X2",
      "odds": 1.50,
      "confidence": 85,
      "reasoning": "Ruthless analysis applying the pillars (e.g. 'Home team is overvalued due to brand name...')",
      "isLive": false,
      "currentScore": "0-0",
      "matchTime": "0'"
    }
  `;

  let prompt = '';

  if (mode === AppMode.ACCUMULATOR) {
    prompt = `
      You are the "KingBayo Warlord". Identify weak lines and crush them.
      
      ${PILLARS_OF_SUCCESS}
      
      THE MISSION:
      Generate SIX (6) DISTINCT ACCUMULATOR STRATEGIES (Tickets) for upcoming matches (next 24h) across ${sport}.
      
      CONSTRAINTS & STRATEGY:
      1. **TOTAL ODDS**: All tickets MUST have total odds between 5.0 and 10.0.
      2. **TICKET VARIATIONS (RUTHLESS EFFICIENCY)**:
         - **Tickets 1 & 2 (The Iron Bank)**: 5-7 legs. Lower odds (1.25 - 1.45). Focus: Absolute locks. Boring wins.
         - **Tickets 3 & 4 (The Bookie Basher)**: 4-5 legs. Medium odds (1.50 - 1.75). Focus: Mispriced favorites and statistical trends.
         - **Tickets 5 & 6 (The High-Yield Assassin)**: 3 legs. Higher value (1.80 - 2.20). Focus: Direct wins, Over 2.5s where offense is underestimated.
      3. **DIVERSITY**: Do not repeat the same match more than twice. LOOK GLOBALLY.
      4. **RISK PROFILE**: ${risk}.

      OUTPUT FORMAT:
      - RETURN RAW JSON ONLY. 
      - NO MARKDOWN formatting.
      
      JSON Structure:
      {
        "tickets": [
          {
            "name": "The Iron Bank (Set A)",
            "matches": [ ${baseMatchStructure}, ... ],
            "totalOdds": 6.50,
            "analysisSummary": "Explain why this ticket is mathematically superior and conforms to the Ruthless Protocol."
          },
          ... (Tickets 2 through 6)
        ]
      }
    `;
  } else if (mode === AppMode.BET_BUILDER) {
    const marketsString = selectedMarkets.length > 0 ? selectedMarkets.join(', ') : "Goals, Corners, and Cards";
    prompt = `
      You are a Correlation Sniper. You find connected events that bookies fail to price correctly.
      
      ${PILLARS_OF_SUCCESS}
      
      THE MISSION:
      Construct 3 DISTINCT Multi-Match Bet Builders for upcoming ${sport} games using markets: [${marketsString}].
      
      CONSTRAINTS:
      1. **FOCUS**: Prioritize ${marketsString}.
      2. **CORRELATION (Math Pillar)**: If selecting 'Over 2.5 Goals', pair it with teams that have high xG (Expected Goals).
      3. **TOTAL ODDS**: Target 5.0 - 15.0.
      4. **STRUCTURE**:
         - Ticket 1: "The Statistical Lock" (Data screams yes).
         - Ticket 2: "The Value Hunter" (Price is wrong).
         - Ticket 3: "The Variance Play" (High risk, high reward).
      5. **RISK**: ${risk}.
      
      OUTPUT FORMAT:
      - RETURN RAW JSON ONLY.
      
      JSON Structure:
      {
        "tickets": [
          {
            "name": "The Statistical Lock",
            "matches": [ ${baseMatchStructure}, ... ],
            "totalOdds": 5.50,
            "analysisSummary": "Why these specific markets align based on predatory knowledge."
          },
          ... (Tickets 2 and 3)
        ]
      }
    `;
  } else {
    // LIVE MODE
    prompt = `
      You are a Live Market Predator. You scan the globe for momentum shifts.
      
      ${PILLARS_OF_SUCCESS}
      
      Your Goal: Find exactly ${count} currently LIVE (In-Play) ${sport} matches happening RIGHT NOW.
      
      CRITERIA:
      1. **REAL TIME**: Matches must be active NOW.
      2. **KILLER INSTINCT**: Spot games where the pre-match favorite is losing but dominating stats (Shots/Possession).
      3. **VALUE**: Don't just pick the winning team. Pick the *next* event (Next Goal, Over X Goals) based on live flow.
      4. **RISK**: ${risk}.
      
      OUTPUT FORMAT:
      - RETURN RAW JSON ONLY. 
      
      JSON Structure:
      {
        "tickets": [
          {
            "name": "Live Opportunities Scanner",
            "matches": [ ${baseMatchStructure}, ... (exactly ${count} matches) ],
            "totalOdds": 12.50,
            "analysisSummary": "Ruthless live market analysis applying 'Adaptability' and 'Zero Emotion'..."
          }
        ]
      }
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    
    // Extract Sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: SourceLink[] = groundingChunks
      .map((chunk: any) => {
        if (chunk.web) {
          return { title: chunk.web.title, url: chunk.web.uri };
        }
        return null;
      })
      .filter((link: any): link is SourceLink => link !== null);

    // Parse JSON with robust cleanup
    let jsonString = text.trim();
    jsonString = jsonString.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');
    
    const start = jsonString.indexOf('{');
    const end = jsonString.lastIndexOf('}');
    
    if (start === -1 || end === -1) {
      console.error("AI Raw Response:", text);
      throw new Error("The AI could not find valid matches adhering to the strict protocols. Please try again.");
    }

    const cleanJson = jsonString.substring(start, end + 1);
    
    let parsedData;
    try {
      parsedData = JSON.parse(cleanJson);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      throw new Error("Failed to process AI predictions. Try a different sport or risk level.");
    }
    
    // Generate IDs and Sanitize Data
    const resultId = Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const tickets = (parsedData.tickets || []).map((t: any) => ({
      ...t,
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      totalOdds: Number(t.totalOdds) || 0,
      matches: (t.matches || []).map((m: any) => ({
        ...m,
        odds: Number(m.odds) || 1.0,
        confidence: Number(m.confidence) || 50,
        isLive: mode === AppMode.LIVE ? true : !!m.isLive,
      }))
    }));

    return {
      data: {
        id: resultId,
        tickets: tickets,
        mode,
        sport,
        generatedAt: new Date().toISOString(),
        selectedMarkets: mode === AppMode.BET_BUILDER ? selectedMarkets : undefined,
      },
      sources
    };

  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    // Add specific check for missing API Key or Permissions which is common on Vercel deployments
    if (error.message?.includes('403') || error.message?.includes('API key')) {
       throw new Error("API Connection Failed. Please ensure your Vercel Environment Variable 'VITE_API_KEY' is correctly configured.");
    }
    throw error;
  }
};