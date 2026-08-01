import type { Metadata } from "next";
import { getBlogPostById } from "@/lib/admin/repositories/blog.repository";
import { notFound } from "next/navigation";
import BlogEditorClient from "./BlogEditorClient";

export const metadata: Metadata = { title: "Edit Post" };

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) notFound();

  return <BlogEditorClient post={post} />;
}
