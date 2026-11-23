import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "../lib/prisma";
import { createNote, updateNote, deleteNote } from "./actions";
import styles from "./page.module.css";

async function NotesApp({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;

  // READ
  const notes = await prisma.note.findMany({ orderBy: { id: "asc" } });
  const editing = edit ? notes.find((n) => n.id === Number(edit)) : undefined;

  return (
    <>
      <form
        key={editing?.id ?? "new"}
        action={editing ? updateNote : createNote}
        className={styles.form}
      >
        {editing && <input type="hidden" name="id" value={editing.id} />}
        <input
          className={styles.input}
          name="title"
          placeholder="Judul"
          defaultValue={editing?.title ?? ""}
        />
        <textarea
          className={styles.textarea}
          name="content"
          placeholder="Isi catatan"
          defaultValue={editing?.content ?? ""}
        />
        <button type="submit" className={styles.btnPrimary}>
          {editing ? "Update Catatan" : "Tambah Catatan"}
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
              <Link href={`/?edit=${note.id}`}>
                <button type="button" className={styles.btnEdit}>Edit</button>
              </Link>
              <form action={deleteNote}>
                <input type="hidden" name="id" value={note.id} />
                <button type="submit" className={styles.btnDelete}>Hapus</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Aplikasi Catatan (CRUD)</h1>
        <Suspense fallback={<p className={styles.empty}>Memuat...</p>}>
          <NotesApp searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}