import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { ProductGrid } from "@/components/home/ProductGrid";
import { Trust } from "@/components/home/Trust";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <ProductGrid />
      <Trust />
    </>
  );
}
