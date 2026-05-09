"""
ingest.py — Run once to populate the ChromaDB vector store.
Usage: python ingest.py
"""

import glob
import hashlib
import os
from pathlib import Path

import chromadb
from dotenv import load_dotenv
from openai import OpenAI

# ── Config ────────────────────────────────────────────────────────────────────
KNOWLEDGE_DIR = Path(__file__).parent / "knowledge_base"
CHROMA_PATH = Path(__file__).parent / "chroma_db"
COLLECTION = "paddy_knowledge"
EMBED_MODEL = "text-embedding-3-small"  # 1536-dim, cheap, multilingual
CHUNK_SIZE = 500  # characters
CHUNK_OVERLAP = 80
FALLBACK_DIMENSIONS = 1536

load_dotenv(Path(__file__).parent / ".env")


def normalize_api_key(value: str | None) -> str | None:
    if not value:
        return None
    lowered = value.strip().lower()
    if "your_" in lowered and lowered.endswith("_here"):
        return None
    return value

# ── Clients ───────────────────────────────────────────────────────────────────
openai_api_key = normalize_api_key(os.getenv("OPENAI_API_KEY"))
oai = OpenAI(api_key=openai_api_key) if openai_api_key else None
chroma = chromadb.PersistentClient(path=str(CHROMA_PATH))
collection = chroma.get_or_create_collection(
    name=COLLECTION,
    metadata={"hnsw:space": "cosine"},
)


# ── Helpers ───────────────────────────────────────────────────────────────────
def chunk_text(
    text: str,
    size: int = CHUNK_SIZE,
    overlap: int = CHUNK_OVERLAP,
) -> list[str]:
    """Split text into overlapping character-level chunks."""
    chunks, start = [], 0
    while start < len(text):
        end = start + size
        chunks.append(text[start:end].strip())
        start += size - overlap
    return [chunk for chunk in chunks if len(chunk) > 50]


def fallback_embed(text: str) -> list[float]:
    """
    Deterministic local embedding used only when OPENAI_API_KEY is missing.
    This keeps local verification possible; replace with real embeddings in production.
    """
    vector: list[float] = []
    counter = 0
    while len(vector) < FALLBACK_DIMENSIONS:
        digest = hashlib.sha256(f"{text}:{counter}".encode("utf-8")).digest()
        for byte in digest:
            vector.append((byte / 127.5) - 1.0)
            if len(vector) == FALLBACK_DIMENSIONS:
                break
        counter += 1
    return vector


def embed(text: str) -> list[float]:
    """Embed a single string using OpenAI text-embedding-3-small."""
    if oai is None:
        return fallback_embed(text)

    response = oai.embeddings.create(input=text, model=EMBED_MODEL)
    return response.data[0].embedding


# ── Main ingestion ─────────────────────────────────────────────────────────────
def ingest_all() -> None:
    md_files = sorted(glob.glob(str(KNOWLEDGE_DIR / "*.md")))
    if not md_files:
        raise FileNotFoundError(f"No .md files found in {KNOWLEDGE_DIR}")

    total_chunks = 0
    for filepath in md_files:
        filename = Path(filepath).stem
        text = Path(filepath).read_text(encoding="utf-8")
        chunks = chunk_text(text)
        print(f"  {filename}: {len(chunks)} chunks")

        for index, chunk in enumerate(chunks):
            doc_id = f"{filename}_{index:04d}"
            if collection.get(ids=[doc_id])["ids"]:
                continue
            vector = embed(chunk)
            collection.add(
                ids=[doc_id],
                documents=[chunk],
                embeddings=[vector],
                metadatas=[{"source": filename, "chunk": index}],
            )
            total_chunks += 1

    print(f"\n✅ Ingestion complete — {total_chunks} new chunks stored in {CHROMA_PATH}")
    if oai is None:
        print("ℹ️ Used local fallback embeddings because OPENAI_API_KEY is not set.")


if __name__ == "__main__":
    print(f"📚 Ingesting knowledge base from {KNOWLEDGE_DIR} …\n")
    ingest_all()
