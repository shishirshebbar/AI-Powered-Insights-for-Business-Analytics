# AI-Powered Voice Analytics for Business Insights

Analyze company data through voice prompts and generate insightful visualizations.

## Features

- Voice-based natural language queries over uploaded CSV data.
- Dynamic chart generation (Bar, Line, Pie, Area, Radar, Composed, Scatter, Treemap, RadialBar).
- NLP processing to extract insights from speech.
- CSV upload and parsing.
- FastAPI backend with NLP engine.
- User authentication via Clerk.
- Data storage with Neon/PostgreSQL.
- Frontend built with React and Chart.js / Recharts.
- Voice recording using `react-speech-recognition`.

## Tech Stack

| Component        | Tech Used                 |
|------------------|---------------------------|
| Frontend         | React, Chart.js, Recharts |
| Voice Capture    | react-recorder            |
| Auth             | Clerk                     |
| Backend API      | FastAPI                   |
| NLP Engine       | OpenAI                    |
| Database         | Neon (PostgreSQL)         |

