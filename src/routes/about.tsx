import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/hero-farm.jpg";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Jowi Exporters Limited" },
      {
        name: "description",
        content:
          "Jowi Exporters Limited is a Kenyan grower-exporter on a mission to take the country's finest fresh produce to the world, sustainably and reliably.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <img
            src={heroImg}
            alt="Kenyan farm at sunrise"
            width={1920}
            height={1080}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80" />
          <div className="relative mx-auto max-w-4xl px-4 py-24 text-center text-primary-foreground sm:px-6 sm:py-32 lg:px-8">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary-foreground/70">About us</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Rooted in Kenya. Trusted around the world.
            </h1>
            <p className="mt-5 text-primary-foreground/85">
              Founded by a team of agronomists and freight specialists, Jowi Exporters Limited
              exists to give Kenyan growers a fair, professional route to global markets — and to
              give international buyers a partner they can trust with their freshest categories.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-3 lg:px-8">
          <Block
            title="Our mission"
            body="To deliver Kenya's finest herbs and fruits to the world's most demanding kitchens and retailers — with uncompromising quality, traceability and care for the people who grow them."
          />
          <Block
            title="Our farms"
            body="We work with smallholder cooperatives across Kiambu, Nyandarua, Meru and the Rift Valley, providing inputs, training and a guaranteed buyer for every certified harvest."
          />
          <Block
            title="Our promise"
            body="Cold-chain integrity from harvest to handover, transparent pricing, and a real-time tracking portal so your AWB is never a black box."
          />
        </section>

        <section className="bg-accent/40">
          <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              "From Kenya to the World."
            </h2>
            <p className="mt-4 text-muted-foreground">
              It is more than a tagline — it is our commitment to every farmer, every chef and
              every retailer who chooses to work with us.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-7">
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
