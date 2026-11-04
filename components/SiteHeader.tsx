import Link from "next/link";

export default function SiteHeader() {
  return <header className="site-header"><nav className="container flex items-center justify-between py-4" aria-label="Main navigation"><Link href="/" className="brand-mark" aria-label="TechSiege home">TECHSIEGE <span>2026</span></Link><Link href="/#events" className="header-link">Event select</Link></nav></header>;
}
