# KingBayo Money Empire 👑

**AI-Powered Sports Analytics & Accumulator Generator**

KingBayo Money Empire uses Google's Gemini 2.5 Flash AI to ruthlessly analyze real-time sports data and generate high-probability betting strategies.

## Features

- **24h Accumulator**: Generates 6 distinct ticket strategies ranging from safe "Iron Bank" plays to high-yield risks.
- **Bet Builder**: Smart correlation engine for constructing same-game multis (Goals, Corners, Cards).
- **Live Scanner**: Identifies in-play momentum shifts and opportunities.
- **Ruthless Analysis**: "Pillars of Success" system ensures decisions are based on data, not emotion.

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Google Gemini API (`@google/genai`)
- Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Gemini API Key

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/kingbayo-money-empire.git
    cd kingbayo-money-empire
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the root directory and add your API Key:
    ```env
    VITE_API_KEY=your_google_gemini_api_key_here
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```

## Deployment on Vercel

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  In the Vercel **Project Settings** > **Environment Variables**, add:
    - **Key**: `VITE_API_KEY`
    - **Value**: `[Your Actual Gemini API Key]`
4.  Deploy!

## Disclaimer

This tool is for informational and entertainment purposes only. It does not guarantee winnings. Please gamble responsibly.
