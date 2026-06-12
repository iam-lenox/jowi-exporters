import { Link, useRouter } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  async function signOut() {
    await supabase.auth.signOut();
    router.navigate({ to: "/", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="" width={32} height={32} className="h-8 w-8" />
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold tracking-tight">Jowi Exporters</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              From Kenya to the World
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground/75 transition hover:bg-accent hover:text-foreground"
              activeProps={{ className: "bg-accent text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button onClick={signOut} size="sm" variant="outline">
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth">Track shipment</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-accent"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border/60 pt-3">
              {user ? (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/dashboard" onClick={() => setOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button onClick={signOut} size="sm">
                    Sign out
                  </Button>
                </>
              ) : (
                <Button asChild size="sm">
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    Sign in / Register
                  </Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
