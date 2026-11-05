/**
 * Al Ghurair loader: the diamond mark in a black disc on a white halo, with a dark arc rotating around it.
 * `fullscreen` covers the page with a soft blurred overlay (used for page loads and the service-booking search).
 */
export default function BrandLoader({ label, fullscreen = true }: { label?: string; fullscreen?: boolean }) {
  const mark = (
    <div className="relative h-28 w-28">
      <svg viewBox="0 0 112 112" aria-hidden="true" className="absolute inset-0 h-full w-full animate-spin [animation-duration:1.1s]">
        <circle cx="56" cy="56" r="53" fill="none" stroke="rgba(10,10,10,0.06)" strokeWidth="3" />
        <circle cx="56" cy="56" r="53" fill="none" stroke="#2a2326" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="70 263" />
      </svg>
      <div className="absolute inset-[10px] rounded-full bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.12)]" />
      <div className="absolute inset-[16px] flex items-center justify-center rounded-full bg-[#141414]">
        <svg viewBox="0 0 40 40" aria-hidden="true" className="h-10 w-10">
          <path d="M20 4 36 20 20 36 4 20Z" fill="none" stroke="#fff" strokeWidth="3.2" />
          <rect x="16.5" y="16.5" width="7" height="7" fill="#e6007e" />
        </svg>
      </div>
    </div>
  );

  return (
    <div
      role="status"
      aria-live="polite"
      className={
        fullscreen
          ? "fixed inset-0 z-[90] flex flex-col items-center justify-center gap-5 bg-[#ece9e8]/85 backdrop-blur-sm"
          : "flex flex-col items-center justify-center gap-5 py-24"
      }
    >
      {mark}
      {label ? (
        <p className="text-xs font-semibold uppercase tracking-widest2 text-lepas-ink">{label}</p>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  );
}
