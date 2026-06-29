import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Leaf, Plane, ShieldCheck, Snowflake, Globe2 } from "lucide-react";
import { useState } from "react";
import heroBotanical from "@/assets/hero-botanical.jpg";
import productsImg from "@/assets/products.jpg";
import logisticsImg from "@/assets/logistics.jpg";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jowi Exporters — Fresh Kenyan Herbs & Fruits, Worldwide" },
      {
        name: "description",
        content:
          "Premium Kenyan basil, thyme, rosemary, mint, chives, oregano, avocado and passion fruit exported worldwide with cold-chain freshness and live AWB tracking.",
      },
      { property: "og:image", content: heroBotanical },
      { name: "twitter:image", content: heroBotanical },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <FeatureGrid />
        <ProductsTeaser />
        <Operations />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [awb, setAwb] = useState("");

  function onTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      navigate({ to: "/auth", search: { redirect: "/dashboard" } as never });
    } else {
      navigate({ to: "/dashboard", search: { awb } as never });
    }
  }

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-[color:var(--ocean-mist)]/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[color:var(--ocean-teal)]/15 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-16 lg:px-8 lg:py-28">
        {/* Narrative column */}
        <div className="space-y-10 lg:col-span-6">
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <span className="h-px w-10 bg-[color:var(--ocean-deep)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[color:var(--ocean-mid)]">
              Kenyan Highlands · Premium Grade
            </span>
          </div>

          <h1 className="font-display text-6xl font-extrabold leading-[0.88] tracking-tight text-[color:var(--ocean-deep)] sm:text-7xl lg:text-[9rem]">
            Jowi
            <br />
            <span className="font-light italic text-[color:var(--ocean-teal)]">Exporters</span>
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-[color:var(--ocean-deep)]/75 sm:text-xl">
            Bridging the fertile soils of Kenya to the global market. We specialize in the
            meticulous export of fresh herbs — basil, thyme, rosemary — alongside the finest
            avocado and passion fruit.
          </p>

          {/* Utility module */}
          <div className="relative max-w-md overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-2xl shadow-[color:var(--ocean-deep)]/10 transition-shadow hover:shadow-[color:var(--ocean-deep)]/20">
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-bl-full bg-[color:var(--ocean-mist)]/25" />

            <div className="relative space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--ocean-deep)]">
                  Client Services
                </h2>
                <Link
                  to="/auth"
                  className="text-xs font-semibold text-[color:var(--ocean-teal)] underline underline-offset-4 transition-colors hover:text-[color:var(--ocean-deep)]"
                >
                  Member Login
                </Link>
              </div>

              <form className="space-y-3" onSubmit={onTrack}>
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--ocean-deep)]/50">
                  Global AWB Tracking
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={awb}
                    onChange={(e) => setAwb(e.target.value)}
                    placeholder="Enter tracking ID"
                    className="flex-1 rounded-xl border border-border bg-[color:var(--ocean-mist)]/10 px-5 py-4 font-mono text-sm text-[color:var(--ocean-deep)] outline-none transition focus:border-[color:var(--ocean-teal)] focus:ring-2 focus:ring-[color:var(--ocean-teal)]/20"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-[color:var(--ocean-deep)] px-8 py-4 text-sm font-bold text-white transition-all hover:bg-[color:var(--ocean-mid)] active:scale-95"
                  >
                    Track
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg">
              <Link to="/contact">
                Request a quote <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/services">Our services</Link>
            </Button>
          </div>
        </div>

        {/* Imagery column */}
        <div className="relative min-h-[500px] lg:col-span-6 lg:min-h-[760px]">
          <div className="absolute inset-0 overflow-hidden rounded-[60px] bg-[color:var(--ocean-deep)] shadow-2xl rotate-2 lg:rotate-3 lg:rounded-[100px]">
            <img
              src={heroBotanical}
              alt="Fresh Kenyan basil and Hass avocados on dark slate"
              width={1100}
              height={1600}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--ocean-deep)]/80 via-transparent to-transparent" />
          </div>

          {/* Floating editorial card */}
          <div className="absolute -bottom-6 -left-4 max-w-[280px] -rotate-3 rounded-2xl border border-border bg-card p-8 shadow-2xl transition-transform duration-500 hover:rotate-0 sm:p-10 lg:-left-12">
            <div className="space-y-4">
              <div className="h-1 w-12 bg-[color:var(--ocean-teal)]" />
              <h3 className="font-display text-2xl font-bold text-[color:var(--ocean-deep)]">
                Lush &amp; Fragrant
              </h3>
              <p className="text-sm leading-snug text-[color:var(--ocean-deep)]/65">
                Our herbs are harvested at dawn to preserve the volatile oils and peak aroma
                for transit.
              </p>
            </div>
          </div>

          {/* Accreditation badge */}
          <div className="absolute right-0 top-12 flex h-32 w-32 rotate-12 items-center justify-center rounded-full bg-[color:var(--ocean-teal)] p-4 text-center text-white shadow-xl lg:-right-8">
            <span className="text-[10px] font-bold uppercase leading-tight tracking-tight">
              Certified
              <br />
              Global
              <br />
              Standard
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const lanes = [
    "Nairobi → Amsterdam",
    "Nairobi → London",
    "Nairobi → Dubai",
    "Nairobi → Doha",
    "Nairobi → Frankfurt",
    "Nairobi → Paris",
    "Nairobi → Jeddah",
  ];
  return (
    <section className="border-y border-border bg-[color:var(--ocean-deep)] text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-10 gap-y-3 px-4 py-5 text-xs uppercase tracking-[0.25em] sm:px-6 lg:px-8">
        {lanes.map((l) => (
          <span key={l} className="flex items-center gap-2 text-white/80">
            <Plane className="h-3.5 w-3.5 text-[color:var(--ocean-mist)]" /> {l}
          </span>
        ))}
      </div>
    </section>
  );
}

function FeatureGrid() {
  const features = [
    {
      n: "01",
      icon: Snowflake,
      title: "Unbroken cold chain",
      body: "Pre-cooled within 4 hours of harvest, reefer trucking and temperature-controlled air freight.",
    },
    {
      n: "02",
      icon: ShieldCheck,
      title: "GlobalG.A.P certified",
      body: "Audited farms, traceable lots and HACCP-compliant pack-houses for EU, UK and GCC retailers.",
    },
    {
      n: "03",
      icon: Plane,
      title: "Daily air freight",
      body: "Direct allocations on Nairobi flights to Amsterdam, London, Dubai, Doha and Frankfurt.",
    },
    {
      n: "04",
      icon: Globe2,
      title: "Live AWB tracking",
      body: "Clients log in with their Air Waybill to follow the shipment from farm gate to destination.",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[color:var(--ocean-teal)]">
            Why Jowi
          </p>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-[color:var(--ocean-deep)] sm:text-5xl">
            A reliable partner for fresh produce exports.
          </h2>
        </div>
        <p className="text-base leading-relaxed text-[color:var(--ocean-deep)]/70 lg:col-span-7">
          From the Rift Valley to receiving docks in Europe and the Gulf, every consignment is
          handled with the same standard of care — measured, audited and tracked.
        </p>
      </div>

      <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="group relative bg-card p-8 transition-colors duration-300 hover:bg-[color:var(--ocean-deep)] hover:text-white"
          >
            <div className="flex items-start justify-between">
              <span className="font-display text-xs font-bold tracking-widest text-[color:var(--ocean-teal)] group-hover:text-[color:var(--ocean-mist)]">
                {f.n}
              </span>
              <f.icon className="h-5 w-5 text-[color:var(--ocean-teal)] transition-transform duration-500 group-hover:rotate-12 group-hover:text-[color:var(--ocean-mist)]" />
            </div>
            <h3 className="mt-10 font-display text-xl font-bold tracking-tight">{f.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--ocean-deep)]/70 group-hover:text-white/75">
              {f.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductsTeaser() {
  const products = ["Basil", "Thyme", "Rosemary", "Mint", "Chives", "Oregano", "Avocado", "Passion fruit"];
  return (
    <section className="bg-[color:var(--ocean-mist)]/15">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="relative lg:col-span-6">
          <img
            src={productsImg}
            alt="Fresh basil, rosemary, thyme, mint, chives, oregano, avocado and passion fruit"
            width={1600}
            height={1200}
            loading="lazy"
            className="rounded-[40px] shadow-xl"
          />
          <div className="absolute -bottom-6 -right-6 rounded-2xl bg-[color:var(--ocean-deep)] px-8 py-6 text-white shadow-xl">
            <div className="font-display text-4xl font-extrabold leading-none">8</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[color:var(--ocean-mist)]">
              Signature crops
            </div>
          </div>
        </div>
        <div className="lg:col-span-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[color:var(--ocean-teal)]">
            Our produce
          </p>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-[color:var(--ocean-deep)] sm:text-5xl">
            Aromatic herbs &amp; sun-ripened fruit.
          </h2>
          <p className="mt-5 text-[color:var(--ocean-deep)]/70">
            Grown in the rich soils of Kenya's central highlands and Rift Valley, our crops are
            harvested at peak freshness and packed the same day for export.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm">
            {products.map((p) => (
              <li
                key={p}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-[color:var(--ocean-teal)] hover:shadow-md"
              >
                <Leaf className="h-4 w-4 text-[color:var(--ocean-teal)]" />
                <span className="font-medium text-[color:var(--ocean-deep)]">{p}</span>
              </li>
            ))}
          </ul>
          <Button asChild className="mt-8">
            <Link to="/products">
              Browse all products <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Operations() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:px-8">
      <div className="lg:col-span-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[color:var(--ocean-teal)]">
          Operations
        </p>
        <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-[color:var(--ocean-deep)] sm:text-5xl">
          Built for global logistics.
        </h2>
        <p className="mt-5 text-[color:var(--ocean-deep)]/70">
          From our hub at Jomo Kenyatta International Airport, we coordinate freight, customs and
          cold-chain handling end to end. Every consignment receives an Air Waybill the moment it
          leaves the pack-house — your team tracks it live from our client portal.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/services">Our services</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/auth">Open client portal</Link>
          </Button>
        </div>
      </div>
      <img
        src={logisticsImg}
        alt="Cargo aircraft being loaded with refrigerated containers of fresh Kenyan produce"
        width={1600}
        height={1000}
        loading="lazy"
        className="rounded-[40px] shadow-xl lg:col-span-6"
      />
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[color:var(--ocean-deep)] text-white">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--ocean-teal)]/30 blur-3xl" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[color:var(--ocean-mist)]">
            From Kenya to the world
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to ship with Jowi?
          </h2>
          <p className="mt-2 max-w-xl text-white/75">
            Talk to our export team about volumes, pricing and a tailored cold-chain plan.
          </p>
        </div>
        <Button asChild size="lg" className="bg-white text-[color:var(--ocean-deep)] hover:bg-white/90">
          <Link to="/contact">
            Contact us <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
