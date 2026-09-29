# Proposal & RFP Intelligence Agent 🧠

> **"The agent remembers what worked, what failed, who the client is, and how similar proposals performed — then uses that memory to create better proposals for the next RFP."**

---

## 📌 Project Overview

The **Proposal & RFP Intelligence Agent** is an end-to-end, production-grade AI proposal assistant built for enterprise sales and proposal engineering teams. 

Unlike generic chatbots that produce generic responses from static prompts, this application centers on **Hindsight persistent memory**. By retaining historical proposal knowledge, win/loss patterns, client preferences, and past reviewer feedback, the agent learns continuously and generates tailored, evidence-backed proposals for every new RFP.

---

## 🎯 Problem vs Solution

### Without Hindsight Memory
```text
RFP PDF ──> LLM ──> Generic Proposal (Lacks historical context, repeats past mistakes)
```

### With Hindsight Memory
```text
RFP PDF
   │
   ▼
PDF Extraction ──> RFP Intelligence Analyzer ──> Structured RFP Data
                                                        │
                                                        ▼
                                             HINDSIGHT MEMORY RECALL
                                                        │
                                    ┌───────────────────┼───────────────────┐
                                    ▼                   ▼                   ▼
                                Past Wins           Past Losses     Client Preferences
                                    │                   │                   │
                                    └───────────────────┼───────────────────┘
                                                        ▼
                                              Proposal Strategy Plan
                                                        │
                                                        ▼
                                              Tailored Proposal
                                                        │
                                                        ▼
                                              Compliance Review
                                                        │
                                                        ▼
                                               Win/Loss Feedback
                                                        │
                                                        ▼
                                              HINDSIGHT MEMORY RETAIN
                                                        │
                                                        ▼
                                        Agent improves for future RFPs!
```

---

## 🏗️ Tech Stack

- **Backend**: Python 3.13, FastAPI, Pydantic v2, SQLAlchemy, SQLite
- **Memory Layer**: Hindsight Persistent Memory (Official REST & Python SDK architecture with local high-fidelity fallback store)
- **LLM**: Groq (`openai/gpt-oss-120b` configurable via `.env`)
- **PDF Extraction**: `pypdf` (page-aware text extraction)
- **Export Formats**: `python-docx` (Microsoft Word) and `reportlab` (PDF)
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- npm 9+

### 2. Environment Setup

Create `backend/.env`:
```env
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_API_KEY=your_hindsight_api_key_here
HINDSIGHT_BANK_ID=proposal-agent

GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b

DATABASE_URL=sqlite:///./proposal_agent.db
```

### 3. Backend Setup & Seeding

```bash
cd backend
python -m pip install -r requirements.txt
python -m app.seed_memory
python -m uvicorn app.main:app --reload --port 8000
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit the application at: `http://localhost:3000`
API Documentation available at: `http://localhost:8000/docs`

---

## 💡 Key Features & Platform Highlights

1. **Structured RFP Intelligence**: Parses raw PDFs into structured schemas (mandatory criteria, evaluation weights, compliance standards, deadlines, and risks).
2. **Hindsight Memory Recall**: Queries Hindsight for relevant winning patterns, loss patterns, and client preferences matching the industry and requirements.
3. **Memory-Aware Strategy Planner**: Formulates an explicit strategy before drafting sections.
4. **Hallucination Guardrails**: Unverified numbers or credentials use explicit `[HUMAN INPUT REQUIRED]` markers rather than hallucinated facts.
5. **Internal vs External Separation**: Internal AI notes (`internal_memory_notes`) are strictly isolated from customer-facing exported DOCX/PDF documents.
6. **Win/Loss Feedback Loop**: Retains proposal outcome feedback directly back into Hindsight memory.
7. **Interactive Demo Mode**: Side-by-side interactive comparison demonstrating **WITHOUT MEMORY** vs **WITH HINDSIGHT MEMORY**.

---

## 🔌 API Endpoints Summary

- `GET  /api/health` - System health check
- `POST /api/memory/retain` - Store memory in Hindsight persistent bank
- `POST /api/memory/recall` - Query Hindsight memories for RFP criteria
- `GET  /api/memory/stats` - Hindsight memory metrics
- `POST /api/rfps/upload` - Upload PDF RFP document
- `GET  /api/rfps/{id}` - Fetch extracted RFP intelligence
- `POST /api/proposals/plan` - Formulate memory-driven proposal strategy
- `POST /api/proposals/generate` - Generate complete multi-section proposal
- `POST /api/proposals/{id}/review` - Run automated compliance audit
- `POST /api/proposals/{id}/feedback` - Record win/loss outcome in Hindsight
- `GET  /api/proposals/{id}/export/docx` - Download customer DOCX
- `GET  /api/proposals/{id}/export/pdf` - Download customer PDF
- `POST /api/demo/run-scenario` - Execute live demo scenario

---

## 🏆 Interactive Demo Flow

1. Click **Interactive Demo** in the navigation bar.
2. Select an industry scenario (e.g. **Healthcare** or **FinTech**).
3. Click **Execute Live Demo**.
4. Observe the 5-step pipeline execution.
5. Review the side-by-side comparison:
   - **WITHOUT MEMORY**: Generic proposal lacking security details upfront.
   - **WITH HINDSIGHT MEMORY**: Tailored proposal incorporating past winning patterns (security upfront, 4-phase implementation roadmap, zero generic AI hype).
