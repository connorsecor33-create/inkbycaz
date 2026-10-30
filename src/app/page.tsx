import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { RevealObserver } from "@/components/RevealObserver";
import { Artist, FinalCta, Footer, Inquire, Work } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <a
        href="#work"
        className="label sr-only z-50 bg-ivory px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to the work
      </a>
      <Header />
      <main>
        <Hero />
        <Work />
        <Artist />
        <Inquire />
        <FinalCta />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
