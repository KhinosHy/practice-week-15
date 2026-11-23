"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../lib/prisma";

// CREATE
export async function createNote(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  if (!title) return;
  await prisma.note.create({ data: { title, content } });
  revalidatePath("/");
}

// UPDATE
export async function updateNote(formData: FormData) {
  const id = Number(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  if (!title) return;
  await prisma.note.update({ where: { id }, data: { title, content } });
  revalidatePath("/");
  redirect("/");
}

// DELETE
export async function deleteNote(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.note.delete({ where: { id } });
  revalidatePath("/");
}