import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, LogOut, MapPin, Package, Plane, Search, Settings2 } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Jowi client portal" }] }),
  component: Dashboard,
});

type Shipment = {
  id: string;
  awb_number: string;
  origin: string;
  destination: string;
  product_type: string;
  weight_kg: number | null;
  status: "pending" | "in_transit" | "arrived" | "delivered" | "cancelled";
  departure_date: string | null;
  estimated_arrival: string | null;
  current_location: string | null;
  current_lat: number | null;
  current_lng: number | null;
  notes: string | null;
};

type TrackingEvent = {
  id: string;
  status: Shipment["status"];
  location: string | null;
  notes: string | null;
  event_at: string;
};

function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin(user?.id);
  const [profileName, setProfileName] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name,company").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfileName(data?.full_name || data?.company || ""));
  }, [user]);

  const shipmentsQuery = useQuery({
    queryKey: ["my-shipments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Shipment[];
    },
    enabled: !!user,
  });

  const [awb, setAwb] = useState("");
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [lookupError, setLookupError] = useState<string | null>(null);

  async function loadEvents(shipmentId: string) {
    const { data } = await supabase
      .from("tracking_events")
      .select("*")
      .eq("shipment_id", shipmentId)
      .order("event_at", { ascending: false });
    setEvents((data ?? []) as TrackingEvent[]);
  }

  async function trackByAwb(e: React.FormEvent) {
    e.preventDefault();
    setLookupError(null);
    const code = awb.trim();
    if (!code) return;
    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .ilike("awb_number", code)
      .maybeSingle();
    if (error || !data) {
      setLookupError("No shipment found for that AWB.");
      setSelected(null);
      setEvents([]);
      return;
    }
    setSelected(data as Shipment);
    loadEvents(data.id);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.navigate({ to: "/", replace: true });
  }

  const shipments = shipmentsQuery.data ?? [];

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="" width={32} height={32} className="h-8 w-8" />
            <div className="leading-tight">
              <div className="font-display text-base font-semibold">Jowi Exporters</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Client portal</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button asChild variant="outline" size="sm">
                <Link to="/admin"><Settings2 className="mr-1.5 h-4 w-4" /> Admin</Link>
              </Button>
            )}
            <Button asChild variant="ghost" size="sm">
              <Link to="/"><ArrowLeft className="mr-1.5 h-4 w-4" /> Website</Link>
            </Button>
            <Button onClick={signOut} variant="outline" size="sm">
              <LogOut className="mr-1.5 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">
              Welcome{profileName ? `, ${profileName.split(" ")[0]}` : ""}
            </h1>
            <p className="mt-1 text-muted-foreground">Track your active shipments by AWB number.</p>
          </div>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">Track by AWB number</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={trackByAwb} className="flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="e.g. 074-12345678"
                value={awb}
                onChange={(e) => setAwb(e.target.value)}
                className="sm:max-w-xs"
              />
              <Button type="submit">
                <Search className="mr-1.5 h-4 w-4" /> Track shipment
              </Button>
            </form>
            {lookupError && <p className="mt-3 text-sm text-destructive">{lookupError}</p>}
            {selected && <ShipmentDetail shipment={selected} events={events} />}
          </CardContent>
        </Card>

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold">Your shipments</h2>
          {shipmentsQuery.isLoading ? (
            <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
          ) : shipments.length === 0 ? (
            <Card className="mt-4 border-dashed">
              <CardContent className="py-12 text-center">
                <Package className="mx-auto h-10 w-10 text-muted-foreground/60" />
                <p className="mt-3 text-sm text-muted-foreground">
                  You don't have any shipments yet. Your AWBs will appear here once our team books them.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {shipments.map((s) => (
                <ShipmentCard
                  key={s.id}
                  shipment={s}
                  onSelect={() => { setSelected(s); loadEvents(s.id); }}
                  active={selected?.id === s.id}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function statusMeta(s: Shipment["status"]) {
  const map: Record<Shipment["status"], { label: string; tone: string }> = {
    pending: { label: "Pending", tone: "bg-muted text-muted-foreground" },
    in_transit: { label: "In transit", tone: "bg-secondary/15 text-secondary" },
    arrived: { label: "Arrived", tone: "bg-primary/15 text-primary" },
    delivered: { label: "Delivered", tone: "bg-primary text-primary-foreground" },
    cancelled: { label: "Cancelled", tone: "bg-destructive/15 text-destructive" },
  };
  return map[s];
}

function ShipmentCard({
  shipment, onSelect, active,
}: { shipment: Shipment; onSelect: () => void; active: boolean }) {
  const meta = statusMeta(shipment.status);
  return (
    <button
      onClick={onSelect}
      className={`text-left rounded-2xl border bg-card p-5 transition hover:shadow-md ${
        active ? "border-primary ring-2 ring-primary/30" : "border-border/70"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-medium">{shipment.awb_number}</span>
        <Badge className={meta.tone}>{meta.label}</Badge>
      </div>
      <p className="mt-3 font-display text-lg font-semibold">{shipment.product_type}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {shipment.origin} → {shipment.destination}
      </p>
      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        {shipment.weight_kg && <span>{shipment.weight_kg} kg</span>}
        {shipment.estimated_arrival && <span>ETA {shipment.estimated_arrival}</span>}
      </div>
    </button>
  );
}

function ShipmentDetail({
  shipment, events,
}: { shipment: Shipment; events: TrackingEvent[] }) {
  const meta = statusMeta(shipment.status);
  const mapUrl = useMemo(() => {
    if (shipment.current_lat && shipment.current_lng) {
      const { current_lat: lat, current_lng: lng } = shipment;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 2}%2C${lat - 2}%2C${lng + 2}%2C${lat + 2}&layer=mapnik&marker=${lat}%2C${lng}`;
    }
    return null;
  }, [shipment]);

  return (
    <div className="mt-6 rounded-2xl border border-border/70 bg-background p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">AWB</p>
          <p className="font-mono text-base font-semibold">{shipment.awb_number}</p>
        </div>
        <Badge className={meta.tone}>{meta.label}</Badge>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Info label="Origin" value={shipment.origin} />
        <Info label="Destination" value={shipment.destination} />
        <Info label="Product" value={shipment.product_type} />
        {shipment.departure_date && <Info label="Departed" value={shipment.departure_date} />}
        {shipment.estimated_arrival && <Info label="ETA" value={shipment.estimated_arrival} />}
        {shipment.weight_kg && <Info label="Weight" value={`${shipment.weight_kg} kg`} />}
      </div>

      {shipment.current_location && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-accent/40 p-3 text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span><strong>Last location:</strong> {shipment.current_location}</span>
        </div>
      )}

      {mapUrl && (
        <iframe
          title="Shipment location"
          src={mapUrl}
          className="mt-4 h-72 w-full rounded-xl border border-border/60"
        />
      )}

      <h3 className="mt-6 text-sm font-semibold">Tracking history</h3>
      {events.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">No updates yet.</p>
      ) : (
        <ol className="mt-3 space-y-3">
          {events.map((ev) => {
            const m = statusMeta(ev.status);
            return (
              <li key={ev.id} className="flex gap-3">
                <div className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Plane className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 rounded-xl border border-border/60 bg-card p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge className={m.tone}>{m.label}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(ev.event_at).toLocaleString()}
                    </span>
                  </div>
                  {ev.location && <p className="mt-1 text-sm">{ev.location}</p>}
                  {ev.notes && <p className="mt-0.5 text-xs text-muted-foreground">{ev.notes}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}
