import Link from "next/link";

const directions = [
  ["Festival poster", "A loud, high-contrast campus announcement."],
  ["Swiss editorial", "A precise, typographic programme layout."],
  ["Arcade game night", "The selected direction: a dark grid, calibrated neon, and clear arena choices."],
  ["Campus street culture", "A tactile, handout-inspired competition identity."],
];

export default function ThemePreviewPage() {
  return (
    <main className="detail-shell">
      <div className="container py-16 sm:py-24">
        <Link href="/" className="page-link">Back to website</Link>
        <header className="mt-12 max-w-3xl">
          <p className="event-number">Theme laboratory</p>
          <h1 className="detail-title mt-5">Choose the visual direction.</h1>
          <p className="mt-6 text-lg text-ink2">The site uses arcade game night. These explorations remain as internal reference.</p>
        </header>
        <ol className="detail-list mt-12 max-w-5xl sm:grid-cols-2">
          {directions.map(([name, description], index) => <li key={name}><span className="event-number">0{index + 1}</span><h2 className="mt-6 text-2xl text-ink">{name}</h2><p className="mt-3 text-sm leading-6 text-muted">{description}</p></li>)}
        </ol>
      </div>
    </main>
  );
}
