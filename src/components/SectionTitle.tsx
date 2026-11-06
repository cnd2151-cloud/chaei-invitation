export default function SectionTitle({ en, ko, id }: { en: string; ko: string; id?: string }) {
  return (
    <header className="sec-title" data-reveal>
      <p className="sec-title__en">{en}</p>
      <h2 className="sec-title__ko" id={id}>
        {ko}
      </h2>
    </header>
  );
}
