import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, ClipboardCheck, FileCheck2, Plane, Snowflake, Sprout } from "lucide-react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Jowi Exporters Limited" },
      {
        name: "description",
        content:
          "End-to-end fresh produce export services: sourcing, cold-chain packing, air freight, documentation and live shipment tracking from Kenya to the world.",
      },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: Sprout,
    title: "Farm sourcing & contract growing",
    body: "We partner with GlobalG.A.P certified outgrowers and run dedicated contract-growing programs to match your spec, volume and seasonality.",
  },
  {
    icon: Snowflake,
    title: "Cold-chain pack-house",
    body: "Receiving, sorting, IQF where required, value-added packing into clamshells, pillow packs and retail SKUs at 2–4°C.",
  },
  {
    icon: Plane,
    title: "Air freight to global hubs",
    body: "Daily allocations on direct flights from Nairobi (NBO) to Amsterdam, London, Frankfurt, Dubai, Doha, Riyadh and Jeddah.",
  },
  {
    icon: FileCheck2,
    title: "Export documentation",
    body: "Phytosanitary certificates, KEPHIS clearance, EUR.1 / GSP certificates and full HACCP paperwork handled in-house.",
  },
  {
    icon: Boxes,
    title: "Consolidation & 3PL",
    body: "Multi-supplier consolidation, master AWB issuance and onward trucking to your distribution centre in destination.",
  },
  {
    icon: ClipboardCheck,
    title: "Live shipment tracking",
    body: "Every consignment is registered on our portal — your team logs in with an AWB number to see status, location and ETA in real time.",
  },
];

function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary to-secondary/70 text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary-foreground/70">What we do</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
              End-to-end services for fresh produce exports
            </h1>
            <p className="mt-4 max-w-2xl text-primary-foreground/85">
              From the farm gate in Kenya to your distribution centre overseas — Jowi handles every
              link in the cold chain so your produce arrives fresh, on spec and on time.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="rounded-2xl border border-border/70 bg-card p-7 shadow-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-border/70 bg-accent/40 p-10 text-center">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Need a custom export programme?
            </h2>
            <p className="mt-2 text-muted-foreground">
              We tailor cold-chain SLAs, packaging and frequencies to your category.
            </p>
            <Button asChild className="mt-6">
              <Link to="/contact">Talk to our team</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
