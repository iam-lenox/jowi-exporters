import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Plane, ShieldCheck, Thermometer, Truck } from "lucide-react";
import heroImg from "@/assets/hero-farm.jpg";
import productsImg from "@/assets/products.jpg";
import logisticsImg from "@/assets/logistics.jpg";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jowi Exporters — Fresh Kenyan Herbs & Fruits, Worldwide" },
      {
        name: "description",
        content:
          "Premium Kenyan basil, thyme, rosemary, mint, chives, oregano, avocado and passion fruit exported worldwide with cold-chain freshness and live tracking.",
      },
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
        <Stats />
        <WhyUs />
        <ProductsTeaser />
        <Operations />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={heroImg}
        alt="Kenyan farmland with rows of fresh produce and Mount Kilimanjaro in the distance"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/60 to-secondary/70" />
      <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8 lg:py-44">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur">
            <Leaf className="h-3.5 w-3.5" />
            From Kenya to the World
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Fresh herbs and fruits, delivered with care.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
            Jowi Exporters Limited grows, packs and air-freights premium Kenyan basil, rosemary,
            thyme, mint, chives, oregano, avocado and passion fruit to retailers and chefs across
            Europe, the Gulf and beyond.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/contact">Request a quote <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/auth">Track your shipment</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { value: "15+", label: "Export markets" },
    { value: "48h", label: "Farm to airport" },
    { value: "200t", label: "Shipped monthly" },
    { value: "99.4%", label: "On-time delivery" },
  ];
  return (
    <section className="border-y border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        {items.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-3xl font-semibold text-primary sm:text-4xl">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyUs() {
  const features = [
    {
      icon: Thermometer,
      title: "Unbroken cold chain",
      body: "Pre-cooling within 4 hours of harvest, refrigerated trucking and temperature-controlled air freight keep produce field-fresh.",
    },
    {
      icon: ShieldCheck,
      title: "GlobalG.A.P certified",
      body: "Audited farms, traceable lots and full HACCP-compliant pack-houses for EU, UK and GCC retailer requirements.",
    },
    {
      icon: Plane,
      title: "Daily air freight",
      body: "Direct allocations on Nairobi flights to Amsterdam, London, Dubai, Doha and Frankfurt — every single day.",
    },
    {
      icon: Truck,
      title: "Live tracking",
      body: "Clients log in with an AWB number to watch their shipment from the farm gate to the destination airport.",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Why Jowi</p>
        <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
          A reliable partner for fresh produce exports
        </h2>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductsTeaser() {
  return (
    <section className="bg-accent/40">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <img
          src={productsImg}
          alt="Fresh basil, rosemary, thyme, mint, chives, oregano, avocado and passion fruit"
          width={1600}
          height={1200}
          loading="lazy"
          className="rounded-3xl shadow-lg"
        />
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Our produce</p>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Aromatic herbs & sun-ripened fruit
          </h2>
          <p className="mt-4 text-muted-foreground">
            Grown in the rich soils of Kenya's central highlands and Rift Valley, our crops are
            harvested at peak freshness and packed the same day for export.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {["Basil", "Thyme", "Rosemary", "Mint", "Chives", "Oregano", "Avocado", "Passion fruit"].map((p) => (
              <li key={p} className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-3 py-2">
                <Leaf className="h-4 w-4 text-primary" /> {p}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-7">
            <Link to="/products">Browse all products <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Operations() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">Operations</p>
        <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
          Built for global logistics
        </h2>
        <p className="mt-4 text-muted-foreground">
          From our hub at Jomo Kenyatta International Airport, we coordinate freight, customs and
          cold-chain handling end to end. Every consignment gets an Air Waybill (AWB) the moment
          it leaves the pack-house — your team tracks it in real time from our client portal.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
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
        className="rounded-3xl shadow-lg"
      />
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Ready to ship with Jowi?
          </h2>
          <p className="mt-1 text-primary-foreground/80">
            Talk to our export team about volumes, pricing and a tailored cold-chain plan.
          </p>
        </div>
        <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
          <Link to="/contact">Contact us <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  );
}
