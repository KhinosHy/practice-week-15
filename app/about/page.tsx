"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Note = { id: number; title: string; content: string };

const STORAGE_KEY = "notes";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  // READ: ambil data dari localStorage saat halaman dibuka
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setNotes(JSON.parse(saved));
    setLoaded(true);
  }, []);

  // Simpan otomatis setiap ada perubahan
  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes, loaded]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId !== null) {
      // UPDATE
      setNotes(
        notes.map((n) => (n.id === editingId ? { ...n, title, content } : n))
      );
      setEditingId(null);
    } else {
      // CREATE
      setNotes([...notes, { id: Date.now(), title, content }]);
    }
    setTitle("");
    setContent("");
  }

  function handleEdit(note: Note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  // DELETE
  function handleDelete(id: number) {
    setNotes(notes.filter((n) => n.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setTitle("");
      setContent("");
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Aplikasi Catatan (CRUD)</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            placeholder="Judul"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className={styles.textarea}
            placeholder="Isi catatan"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit" className={styles.btnPrimary}>
            {editingId !== null ? "Update Catatan" : "Tambah Catatan"}
          </button>
        </form>

        <h2 className={styles.subtitle}>Daftar Catatan</h2>
        {notes.length === 0 && <p className={styles.empty}>Belum ada catatan.</p>}
        <ul className={styles.list}>
          {notes.map((note) => (
            <li key={note.id} className={styles.card}>
              <h3 className={styles.cardTitle}>{note.title}</h3>
              <p className={styles.cardContent}>{note.content}</p>
              <div className={styles.actions}>
                <button className={styles.btnEdit} onClick={() => handleEdit(note)}>
                  Edit
                </button>
                <button className={styles.btnDelete} onClick={() => handleDelete(note.id)}>
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}