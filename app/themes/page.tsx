import Link from "next/link";

const events = ["Hackathon", "CTF", "Circuit Breaker", "Crack the Code", "E-sports"];

function FestivalPoster() {
  return <section className="theme-poster relative overflow-hidden bg-[#f0d84a] p-6 text-[#171717] sm:p-8">
    <div className="absolute -right-10 -top-10 h-40 w-40 rotate-12 bg-[#ee3d32]" />
    <div className="relative"><div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[.2em]"><span>TechSiege / 26</span><span>AIET · Mangaluru</span></div><h2 className="mt-12 max-w-sm text-6xl font-black uppercase leading-[.78] tracking-[-.08em] sm:text-7xl">Five ways<br />to show up.</h2><div className="mt-8 inline-block -rotate-2 bg-[#171717] px-4 py-2 text-lg font-black uppercase text-white">Choose your arena</div><div className="mt-10 grid grid-cols-2 gap-2 text-xs font-black uppercase">{events.slice(0, 4).map((event, i) => <div key={event} className={`border-2 border-[#171717] p-3 ${i % 2 ? "bg-[#3778e8] text-white" : "bg-[#ee3d32]"}`}>{event}</div>)}</div></div>
  </section>;
}

function SwissEditorial() {
  return <section className="theme-swiss bg-[#f3f0e9] p-6 text-[#111] sm:p-8">
    <div className="flex items-center justify-between border-b-2 border-[#111] pb-3 text-[10px] font-bold uppercase tracking-[.18em]"><span>TechSiege</span><span>Programme 2026</span></div>
    <div className="grid gap-6 py-12 sm:grid-cols-[1.3fr_1fr] sm:items-end"><h2 className="text-6xl font-black leading-[.78] tracking-[-.09em]">Choose<br />your<br /><span className="text-[#e43b32]">arena.</span></h2><p className="border-l-2 border-[#e43b32] pl-4 text-sm leading-6">Five competitions. One campus. Find the one that fits how you think.</p></div>
    <div className="border-t-2 border-[#111]">{events.map((event, i) => <div key={event} className="flex items-center justify-between border-b border-[#111]/25 py-3 text-sm font-bold"><span><b className="mr-4 text-[#e43b32]">0{i + 1}</b>{event}</span><span>↗</span></div>)}</div>
  </section>;
}

function Arcade() {
  return <section className="theme-arcade relative overflow-hidden bg-[#10182d] p-6 text-white sm:p-8"><div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#56e7ff 1px, transparent 1px), linear-gradient(90deg, #56e7ff 1px, transparent 1px)", backgroundSize: "24px 24px" }} /><div className="relative"><div className="flex justify-between font-mono text-[10px] uppercase tracking-[.2em] text-[#56e7ff]"><span>Event Select</span><span>Player 01</span></div><h2 className="mt-14 font-mono text-4xl font-black uppercase leading-none text-[#f5f25d] [text-shadow:3px_3px_0_#ef6b4a]">Pick<br />your<br />challenge</h2><div className="mt-10 space-y-2">{events.slice(0, 4).map((event, i) => <div key={event} className="flex items-center justify-between border-2 border-[#56e7ff]/50 bg-[#182443] px-3 py-3 font-mono text-xs uppercase"><span><b className="mr-3 text-[#ef6b4a]">{String(i + 1).padStart(2, "0")}</b>{event}</span><span className="text-[#56e7ff]">START</span></div>)}</div></div></section>;
}

function StreetCulture() {
  return <section className="theme-street bg-[#c9c6ba] p-6 text-[#171717] sm:p-8"><div className="rotate-[-1deg] border-4 border-[#171717] bg-[#e7e3d7] p-4 shadow-[8px_8px_0_#171717]"><div className="flex items-center justify-between border-b-2 border-[#171717] pb-2 font-mono text-[10px] font-bold uppercase"><span>Campus handout 01</span><span>AIET / 2026</span></div><h2 className="mt-9 text-5xl font-black uppercase leading-[.8] tracking-[-.07em]">Build.<br /><span className="bg-[#b5ed45] px-1">Break.</span><br />Compete.</h2><p className="mt-7 max-w-xs font-mono text-xs font-bold uppercase leading-5">A student festival for people who prefer making noise to watching from the side.</p><div className="mt-8 grid grid-cols-2 gap-2 font-mono text-[11px] font-bold uppercase">{events.slice(0, 4).map((event, i) => <div key={event} className={`border-2 border-[#171717] p-3 ${i === 1 ? "bg-[#ff694c]" : i === 2 ? "bg-[#5bc7d9]" : "bg-white"}`}>{event}</div>)}</div></div></section>;
}

export default function ThemePreviewPage() {
  return <main className="min-h-screen bg-[#070a12] px-4 py-8 text-white sm:px-8 sm:py-12"><div className="mx-auto max-w-7xl"><div className="mb-10 flex flex-col justify-between gap-4 border-b border-white/10 pb-7 sm:flex-row sm:items-end"><div><p className="font-mono text-xs uppercase tracking-[.2em] text-[#42e8c7]">Theme laboratory</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-[-.06em] sm:text-6xl">Choose the visual direction.</h1></div><Link href="/" className="text-sm text-slate-400 hover:text-white">← Back to website</Link></div><div className="grid gap-6 lg:grid-cols-2"><div><FestivalPoster /><p className="mt-3 font-mono text-xs uppercase tracking-[.16em] text-slate-500">01 / Festival Poster</p></div><div><SwissEditorial /><p className="mt-3 font-mono text-xs uppercase tracking-[.16em] text-slate-500">02 / Swiss Editorial</p></div><div><Arcade /><p className="mt-3 font-mono text-xs uppercase tracking-[.16em] text-slate-500">03 / Arcade / Game Night</p></div><div><StreetCulture /><p className="mt-3 font-mono text-xs uppercase tracking-[.16em] text-slate-500">04 / Campus Street Culture</p></div></div></div></main>;
}
