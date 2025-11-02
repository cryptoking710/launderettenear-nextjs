import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* About Section */}
          <div>
            <h3 className="font-semibold font-heading text-foreground mb-3">LaunderetteNear.me</h3>
            <p className="text-sm text-muted-foreground">
              The UK's most comprehensive launderette directory. Find quality laundry services across England, Scotland, Wales, and Northern Ireland.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold font-heading text-foreground mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-home">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/cities" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-cities">
                  Browse Cities
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-about">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-blog">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold font-heading text-foreground mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-terms">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold font-heading text-foreground mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a 
                  href="mailto:info@launderettenear.me" 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-email"
                >
                  info@launderettenear.me
                </a>
              </li>
              <li>
                Business listings:<br />
                <a 
                  href="mailto:listings@launderettenear.me" 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-email-listings"
                >
                  listings@launderettenear.me
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>
              © {currentYear} LaunderetteNear.me. All rights reserved.
            </p>
            <p className="text-xs">
              Comprehensive UK launderette directory • 1,057+ listings • 79 cities
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
