import Link from "next/link";

export default function SiteHeader() {
  return <header className="relative z-10 border-b-2 border-[#56e7ff]/30 bg-[#10182d]"><nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8" aria-label="Main navigation"><Link href="/" className="font-mono text-lg font-black tracking-[-0.04em] text-white">TECHSIEGE<span className="text-[#f5f25d]">//26</span></Link><div className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-[.18em]"><span className="hidden text-[#56e7ff] sm:inline">Player 01 / Online</span><Link href="/#events" className="text-slate-300 transition hover:text-[#f5f25d]">Event select</Link></div></nav></header>;
}
