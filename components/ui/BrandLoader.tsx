/**
 * Al Ghurair loader: the Al Ghurair diamond mark in a black disc on a white halo, with a dark arc rotating around it.
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
        {/* Al Ghurair mark, taken from the header logo (public/design/assets/alghurair.svg). */}
        <svg viewBox="95 14.6 36.8 38.2" aria-hidden="true" className="h-11 w-11">
          <path d="M112.602 52.3645C112.559 52.3645 112.517 52.3361 112.503 52.2794C112.411 51.7263 111.836 50.0104 108.412 46.5858C104.838 43.0123 95.5426 33.7168 95.5426 33.7168L114.162 15.0975C114.162 15.0975 114.204 15.0691 114.233 15.0691C114.275 15.0691 114.318 15.0975 114.332 15.1542C114.424 15.7072 114.999 17.4231 118.423 20.8478C121.997 24.4213 131.292 33.7168 131.292 33.7168L112.673 52.3361C112.673 52.3361 112.63 52.3645 112.602 52.3645ZM115.615 8H115.58C115.58 8 115.53 8.01418 115.509 8.03545L89.8278 33.7168C89.8278 33.7168 100.144 44.0333 105.249 49.1383C109.979 53.8676 110.943 58.2636 111.113 59.3272C111.12 59.391 111.177 59.4336 111.234 59.4336C111.262 59.4336 111.297 59.4194 111.319 59.3981L137 33.7168C137 33.7168 126.684 23.4003 121.578 18.2952C116.849 13.5659 115.885 9.16991 115.715 8.10636C115.708 8.04963 115.658 8.00709 115.608 8" fill="#fff" />
          <path d="M118.026 29.108C118.026 29.108 117.112 29.4271 113.418 29.4271C109.723 29.4271 108.809 29.108 108.809 29.108C108.809 29.108 109.128 30.0227 109.128 33.7168C109.128 37.4109 108.809 38.3255 108.809 38.3255C108.809 38.3255 109.723 38.0064 113.418 38.0064C117.112 38.0064 118.026 38.3255 118.026 38.3255C118.026 38.3255 117.707 37.4109 117.707 33.7168C117.707 30.0227 118.026 29.108 118.026 29.108Z" fill="#DE0090" />
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
