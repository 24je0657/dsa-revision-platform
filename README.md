# 🧠 DSA Revision Platform

> A full-stack DSA revision and coding practice platform for structured problem solving, progressive hints, and code submission.

<p align="center">

![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB?logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/ORM-SQLAlchemy-D71F00)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)

</p>

## ✨ Features

- 📚 **Problem Library** — Problems are stored in PostgreSQL and served through FastAPI.
- 🔀 **Dynamic Routing** — Dedicated problem pages using React Router and problem slugs.
- 💡 **Progressive Hints** — Reveal hints one at a time for guided problem solving.
- 🧑‍💻 **Monaco Code Editor** — Write and edit C++ solutions directly in the browser.
- 🚀 **REST API Integration** — React communicates with FastAPI through typed API endpoints.
- 🗄️ **PostgreSQL Persistence** — Problems and submissions are stored in a relational database.
- 🔗 **Foreign-Key Relationships** — Submissions are linked to their problems.
- ✅ **Submission Validation** — Invalid problem IDs return proper `404` responses.
- 📤 **Working Submission Flow** — Code can be submitted from the frontend and persisted by the backend.
- 🎯 **Mock Verdict System** — Current verdicts are mocked and ready to be replaced with Judge0.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS |
| Routing | React Router |
| Code Editor | Monaco Editor |
| Backend | Python, FastAPI |
| Validation | Pydantic |
| ORM | SQLAlchemy |
| Database | PostgreSQL |
| Planned Execution | Judge0, Docker |

## 🏗️ Architecture

```text
┌──────────────────────────┐
│       React Frontend     │
│  TypeScript + Tailwind   │
│      Monaco Editor       │
└────────────┬─────────────┘
             │
             │ REST API
             ▼
┌──────────────────────────┐
│       FastAPI Backend    │
│   Pydantic + SQLAlchemy  │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│        PostgreSQL        │
│   Problems + Submissions │
└──────────────────────────┘
