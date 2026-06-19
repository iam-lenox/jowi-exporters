import { createFileRoute, Link } from "@tanstack/react-router";
import productsImg from "@/assets/products.jpg";
import basilImg from "@/assets/products/basil.jpg";
import thymeImg from "@/assets/products/thyme.jpg";
import rosemaryImg from "@/assets/products/rosemary.jpg";
import mintImg from "@/assets/products/mint.jpg";
import chivesImg from "@/assets/products/chives.jpg";
import oreganoImg from "@/assets/products/oregano.jpg";
import avocadoImg from "@/assets/products/avocado.jpg";
import passionFruitImg from "@/assets/products/passion-fruit.jpg";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Fresh Kenyan Herbs & Fruits | Jowi Exporters" },
      {
        name: "description",
        content:
          "Explore our export catalogue: basil, thyme, rosemary, mint, chives, oregano, Hass avocado and purple passion fruit grown in Kenya and shipped fresh worldwide.",
      },
      { property: "og:image", content: "/src/assets/products.jpg" },
    ],
  }),
  component: ProductsPage,
});

const herbs = [
  { name: "Basil", note: "Sweet Genovese, large-leaf", season: "Year round", image: basilImg },
  { name: "Thyme", note: "Common & lemon thyme", season: "Year round", image: thymeImg },
  { name: "Rosemary", note: "Long stem, fragrant", season: "Year round", image: rosemaryImg },
  { name: "Mint", note: "Spearmint & peppermint", season: "Year round", image: mintImg },
  { name: "Chives", note: "Tied bunches, 100g packs", season: "Year round", image: chivesImg },
  { name: "Oregano", note: "Greek oregano sprigs", season: "Year round", image: oreganoImg },
];

const fruits = [
  { name: "Hass Avocado", note: "Counts 16–32, oil ≥23%", season: "Mar – Oct", image: avocadoImg },
  { name: "Passion Fruit", note: "Purple, Brix 14–16", season: "Year round", image: passionFruitImg },
];

function ProductCard({ item, accent }: { item: { name: string; note: string; season: string; image: string }; accent: "primary" | "secondary" }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-xl animate-fade-in">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={`Fresh ${item.name} from Kenya`}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-xl font-semibold">{item.name}</h3>
          <Badge variant="secondary" className={accent === "primary" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}>
            {item.season}
          </Badge>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{item.note}</p>
      </div>
    </div>
  );
}

function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-accent/40">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Our catalogue</p>
              <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Fresh herbs & fruits, grown in Kenya
              </h1>
              <p className="mt-4 max-w-xl text-muted-foreground">
                Hand-harvested, cold-stored within hours and packed to your retailer spec — from
                100g chef-grade clamshells to 4kg loose cartons for wholesale.
              </p>
            </div>
            <img
              src={productsImg}
              alt="Selection of fresh Kenyan herbs and fruits"
              width={1600}
              height={1200}
              className="rounded-3xl shadow-lg"
            />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold">Aromatic herbs</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {herbs.map((h) => (
              <ProductCard key={h.name} item={h} accent="primary" />
            ))}
          </div>

          <h2 className="mt-16 font-display text-2xl font-semibold">Fresh fruit</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {fruits.map((f) => (
              <ProductCard key={f.name} item={f} accent="secondary" />
            ))}
          </div>

          <div className="mt-16 rounded-3xl bg-primary p-10 text-primary-foreground">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Request pricing & samples</h2>
            <p className="mt-2 text-primary-foreground/80 max-w-2xl">
              Let us know your destination port, volumes and packaging preferences and we'll send a
              full quotation with samples on the next available flight.
            </p>
            <Button asChild size="lg" className="mt-6 bg-white text-primary hover:bg-white/90">
              <Link to="/contact">Get a quote</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
