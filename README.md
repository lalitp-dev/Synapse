# 🧠 Synapse – The Context-Aware Second Brain

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React_Native-v0.76-61DAFB.svg)
![Expo](https://img.shields.io/badge/Expo-SDK_52-000020.svg)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg)
![AI](https://img.shields.io/badge/AI-Gemini_Pro-8E75B2.svg)

> **"Don't just take notes. visualize your thoughts."**

Synapse is a next-generation mobile application that acts as a multimodal "Second Brain." Unlike traditional note-taking apps, Synapse uses **RAG (Retrieval Augmented Generation)** and **Vector Embeddings** to understand the *meaning* of your notes, not just the keywords. It visualizes your knowledge as an interactive, physics-based graph, allowing you to see connections between ideas instantly.

---

## 📱 Visual Showcase

| **The Knowledge Graph** | **Magic Camera (Multimodal)** | **Semantic Search** |
|:---:|:---:|:---:|
| ![Graph Screenshot](./assets/screenshots/graph.png) | ![Camera Screenshot](./assets/screenshots/camera.png) | ![Search Screenshot](./assets/screenshots/search.png) |
| *Interactive D3 + Skia visualization of vector embeddings.* | *Gemini Vision analyzing real-world objects & text.* | *RAG-powered search finding concepts, not just words.* |

---

## 🚀 Key Features

* **🕸️ Interactive Knowledge Graph:** A high-performance visualization using **React Native Skia** and **D3.js**. Notes act as physics-based nodes that float, repel, and cluster based on relevance.
* **📸 Multimodal "Magic Input":** Snap a photo of a book page, whiteboard, or diagram. **Google Gemini Pro Vision** analyzes the image, extracts text, and describes the context automatically.
* **🧠 RAG & Semantic Search:** Built on **pgvector**. Search for "business ideas" and find notes about "startups" and "revenue," even if they don't share the same words.
* **🔐 Row Level Security (RLS):** Enterprise-grade security via Supabase. Data is secured at the database level—users can strictly access only their own data.
* **⚡ Modern Stack:** Built with **Expo Router**, **NativeWind (Tailwind)**, and **TypeScript** for a scalable, type-safe codebase.

---

## 🛠️ Tech Stack

### **Frontend (Mobile)**
* **Framework:** React Native (Expo Managed Workflow)
* **Language:** TypeScript (Strict Mode)
* **Navigation:** Expo Router (File-based routing)
* **Styling:** NativeWind (Tailwind CSS) + Lucide Icons
* **Graphics & Animation:** React Native Skia + Reanimated 3 + D3-Force
* **State Management:** Zustand (Client) + TanStack Query (Server)

### **Backend & AI**
* **Database:** Supabase (PostgreSQL 15)
* **Vector Store:** pgvector extension
* **AI Models:**
    * *Vision:* Gemini 3 Flash (Image Analysis)
    * *Embeddings:* Gemini Text-Embedding-004 (Vector Generation)
* **Auth:** Supabase Auth (JWT + RLS)

---

## 🏗️ Architecture

Synapse follows a **Feature-Sliced Architecture** to ensure scalability and maintainability.

```text
src/
├── core/             # Universal utilities (Theme, Providers, Base API)
├── features/         # Domain-specific logic (The "Meat" of the app)
│   ├── auth/         # Login/Register & Session State
│   ├── graph/        # D3 Physics logic & Skia Renderers
│   ├── ai/           # Gemini Service & Embedding Logic
│   └── search/       # Vector Search Services
├── services/         # External Adapters (Supabase Client)
└── db/               # Database Schema definitions
