import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import logoAsset from "@/assets/jowi-logo.jpeg.asset.json";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <img src={logoAsset.url} alt="Jowi Exporters Ltd" className="h-14 w-auto" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Kenyan-grown herbs, avocados and passion fruit, exported fresh to discerning kitchens
            and retailers around the world.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About us</Link></li>
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/products" className="hover:text-foreground">Products</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Clients</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/auth" className="hover:text-foreground">Client login</Link></li>
            <li><Link to="/auth" className="hover:text-foreground">Register account</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Track shipment</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Get in touch</h4>
          <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              <span>Jomo Kenyatta Intl. Airport Logistics Hub,<br />Nairobi, Kenya</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>+254 700 000 000</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>hello@jowiexporters.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Jowi Exporters Limited. All rights reserved.</p>
          <p>From Kenya to the World.</p>
        </div>
      </div>
    </footer>
  );
}
