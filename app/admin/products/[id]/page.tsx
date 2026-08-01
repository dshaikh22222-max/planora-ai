import type { Metadata } from "next";
import { getProductById } from "@/lib/admin/repositories/product.repository";
import { notFound } from "next/navigation";
import ProductEditClient from "./ProductEditClient";

export const metadata: Metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return <ProductEditClient product={product} />;
}
