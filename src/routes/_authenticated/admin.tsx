import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Jowi Exporters" }] }),
  component: AdminPage,
});

type ShipmentStatus = "pending" | "in_transit" | "arrived" | "delivered" | "cancelled";

function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin(user?.id);

  useEffect(() => {
    if (!authLoading && !roleLoading && !isAdmin) {
      toast.error("Admin access required");
      router.navigate({ to: "/dashboard", replace: true });
    }
  }, [authLoading, roleLoading, isAdmin, router]);

  if (authLoading || roleLoading || !isAdmin) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Checking access…</div>;
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-semibold">Jowi Admin</span>
            <Badge variant="secondary" className="bg-primary/10 text-primary">Operations</Badge>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard"><ArrowLeft className="mr-1.5 h-4 w-4" /> Client view</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 animate-fade-in">
        <h1 className="font-display text-3xl font-semibold">Operations console</h1>
        <p className="mt-1 text-muted-foreground">Manage shipments, tracking updates, clients and messages.</p>

        <Tabs defaultValue="shipments" className="mt-8">
          <TabsList>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="shipments" className="mt-6"><ShipmentsTab /></TabsContent>
          <TabsContent value="clients" className="mt-6"><ClientsTab /></TabsContent>
          <TabsContent value="messages" className="mt-6"><MessagesTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

/* -------------------- Shipments -------------------- */

function ShipmentsTab() {
  const qc = useQueryClient();
  const { data: shipments = [], isLoading } = useQuery({
    queryKey: ["admin-shipments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const { data: clients = [] } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id,full_name,company,email");
      return data ?? [];
    },
  });

  const [trackOpen, setTrackOpen] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Shipments</CardTitle>
        <NewShipmentDialog clients={clients} onCreated={() => qc.invalidateQueries({ queryKey: ["admin-shipments"] })} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : shipments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No shipments yet. Add one to get started.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-3">AWB</th>
                  <th className="py-2 pr-3">Route</th>
                  <th className="py-2 pr-3">Product</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">ETA</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="py-3 pr-3 font-mono text-xs">{s.awb_number}</td>
                    <td className="py-3 pr-3">{s.origin} → {s.destination}</td>
                    <td className="py-3 pr-3">{s.product_type}</td>
                    <td className="py-3 pr-3"><StatusSelect shipmentId={s.id} value={s.status} /></td>
                    <td className="py-3 pr-3 text-muted-foreground">{s.estimated_arrival ?? "—"}</td>
                    <td className="py-3 text-right">
                      <Button variant="outline" size="sm" onClick={() => setTrackOpen(s.id)}>
                        Add update
                      </Button>
                      <Button variant="ghost" size="sm" className="ml-1 text-destructive"
                        onClick={async () => {
                          if (!confirm("Delete this shipment?")) return;
                          await supabase.from("shipments").delete().eq("id", s.id);
                          qc.invalidateQueries({ queryKey: ["admin-shipments"] });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {trackOpen && (
          <TrackingEventDialog
            shipmentId={trackOpen}
            open={!!trackOpen}
            onClose={() => setTrackOpen(null)}
            onSaved={() => qc.invalidateQueries({ queryKey: ["admin-shipments"] })}
          />
        )}
      </CardContent>
    </Card>
  );
}

function StatusSelect({ shipmentId, value }: { shipmentId: string; value: ShipmentStatus }) {
  const qc = useQueryClient();
  return (
    <Select
      value={value}
      onValueChange={async (v) => {
        const { error } = await supabase.from("shipments").update({ status: v as ShipmentStatus }).eq("id", shipmentId);
        if (error) { toast.error(error.message); return; }
        toast.success("Status updated");
        qc.invalidateQueries({ queryKey: ["admin-shipments"] });
      }}
    >
      <SelectTrigger className="h-8 w-36"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="in_transit">In transit</SelectItem>
        <SelectItem value="arrived">Arrived</SelectItem>
        <SelectItem value="delivered">Delivered</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
}

function NewShipmentDialog({
  clients, onCreated,
}: { clients: any[]; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.from("shipments").insert({
      awb_number: String(fd.get("awb")),
      client_id: (fd.get("client_id") as string) || null,
      origin: String(fd.get("origin")),
      destination: String(fd.get("destination")),
      product_type: String(fd.get("product")),
      weight_kg: Number(fd.get("weight")) || null,
      departure_date: (fd.get("departure") as string) || null,
      estimated_arrival: (fd.get("eta") as string) || null,
      current_location: (fd.get("current_location") as string) || null,
      notes: (fd.get("notes") as string) || null,
      status: "pending",
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Shipment created");
    setOpen(false);
    onCreated();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> New shipment</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>New shipment</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field name="awb" label="AWB number" required />
            <div>
              <Label htmlFor="client_id">Client</Label>
              <select
                id="client_id" name="client_id"
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">— Unassigned —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.full_name || c.company || c.email}</option>
                ))}
              </select>
            </div>
            <Field name="origin" label="Origin" defaultValue="Nairobi (NBO)" required />
            <Field name="destination" label="Destination" required />
            <Field name="product" label="Product type" required />
            <Field name="weight" label="Weight (kg)" type="number" />
            <Field name="departure" label="Departure date" type="date" />
            <Field name="eta" label="ETA" type="date" />
          </div>
          <Field name="current_location" label="Current location (text)" />
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" rows={2} className="mt-1.5" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? "Saving…" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TrackingEventDialog({
  shipmentId, open, onClose, onSaved,
}: { shipmentId: string; open: boolean; onClose: () => void; onSaved: () => void }) {
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const status = String(fd.get("status")) as ShipmentStatus;
    const location = (fd.get("location") as string) || null;
    const lat = Number(fd.get("lat")) || null;
    const lng = Number(fd.get("lng")) || null;
    const notes = (fd.get("notes") as string) || null;

    const { error: eventError } = await supabase.from("tracking_events").insert({
      shipment_id: shipmentId, status, location, lat, lng, notes,
    });
    if (eventError) { toast.error(eventError.message); setLoading(false); return; }

    await supabase.from("shipments").update({
      status, current_location: location, current_lat: lat, current_lng: lng,
    }).eq("id", shipmentId);

    setLoading(false);
    toast.success("Update added");
    onSaved();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add tracking update</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <select id="status" name="status" required
              className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="pending">Pending</option>
              <option value="in_transit">In transit</option>
              <option value="arrived">Arrived</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <Field name="location" label="Location" placeholder="e.g. Amsterdam Schiphol (AMS)" />
          <div className="grid grid-cols-2 gap-3">
            <Field name="lat" label="Latitude" type="number" step="any" />
            <Field name="lng" label="Longitude" type="number" step="any" />
          </div>
          <div>
            <Label htmlFor="ev-notes">Notes</Label>
            <Textarea id="ev-notes" name="notes" rows={2} className="mt-1.5" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? "Saving…" : "Save update"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label, name, type = "text", defaultValue, required, placeholder, step,
}: {
  label: string; name: string; type?: string; defaultValue?: string;
  required?: boolean; placeholder?: string; step?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}{required && <span className="text-destructive"> *</span>}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue}
        required={required} placeholder={placeholder} step={step} className="mt-1.5" />
    </div>
  );
}

/* -------------------- Clients -------------------- */

function ClientsTab() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  return (
    <Card>
      <CardHeader><CardTitle>Registered clients</CardTitle></CardHeader>
      <CardContent>
        {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> :
         data.length === 0 ? <p className="text-sm text-muted-foreground">No clients yet.</p> :
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Company</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Phone</th>
                <th className="py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p: any) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-3 pr-3">{p.full_name ?? "—"}</td>
                  <td className="py-3 pr-3">{p.company ?? "—"}</td>
                  <td className="py-3 pr-3">{p.email ?? "—"}</td>
                  <td className="py-3 pr-3">{p.phone ?? "—"}</td>
                  <td className="py-3 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </CardContent>
    </Card>
  );
}

/* -------------------- Messages -------------------- */

function MessagesTab() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  return (
    <Card>
      <CardHeader><CardTitle>Contact-form messages</CardTitle></CardHeader>
      <CardContent>
        {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> :
         data.length === 0 ? <p className="text-sm text-muted-foreground">No messages yet.</p> :
        <ul className="space-y-4">
          {data.map((m: any) => (
            <li key={m.id} className="rounded-xl border border-border/60 bg-background p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{m.name} {m.company && <span className="text-muted-foreground">· {m.company}</span>}</p>
                  <p className="text-xs text-muted-foreground">{m.email} {m.phone && `· ${m.phone}`}</p>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm">{m.message}</p>
            </li>
          ))}
        </ul>}
      </CardContent>
    </Card>
  );
}
