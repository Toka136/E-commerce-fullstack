import Image from "next/image";
import { ArrowDown, Sparkles } from "lucide-react";

// Put your image link here (or a path inside /public, e.g. "/hero.jpg")
const HERO_IMAGE = "/hero.png";

export default function Hero() {
  return (
    <section className="flex flex-col-reverse items-center gap-10 py-12 md:flex-row md:justify-between md:py-20">
      <div className="max-w-xl">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#0B66D0]">
          <Sparkles className="h-4 w-4" /> A little more discovery
        </p>

        <h1 className="mt-4 font-serif text-4xl leading-tight text-[#0F172A] md:text-5xl lg:text-6xl">
          Good books find their people.
        </h1>

        <p className="mt-5 max-w-md text-base leading-relaxed text-[#64748B] md:text-lg">
          Thoughtful stories, handpicked by Toka Karam. Follow the one that
          speaks to you.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-md bg-[#0B66D0] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0953A8]"
          >
            Browse the collection <ArrowDown className="h-4 w-4" />
          </a>
          <span className="flex items-center gap-2 text-sm text-[#64748B]">
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            A small shop for big worlds
          </span>
        </div>
      </div>

{/* Entrance: slides in from the right */}
<div className="animate-hero-in shrink-0">
  {/* Float: starts after the entrance finishes */}
  <div className="animate-hero-float">
    <div className="relative aspect-4/5 w-64 overflow-hidden rounded-2xl bg-slate-200 shadow-xl sm:w-80 md:w-96 lg:w-md xl:w-112">
      <Image
        src={HERO_IMAGE}
        alt="Featured book cover"
        fill
        sizes="(min-width: 1280px) 448px, (min-width: 1024px) 384px, (min-width: 768px) 384px, 320px"
        className="object-cover"
        priority
      />
    </div>
  </div>
</div>
    </section>
  );
}