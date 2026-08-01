import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { FsiCalculator } from "@/components/home/FsiCalculator";
import { ProductGrid } from "@/components/home/ProductGrid";
import { Trust } from "@/components/home/Trust";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <FsiCalculator />
      <ProductGrid />
      <Trust />
    </>
  );
}
