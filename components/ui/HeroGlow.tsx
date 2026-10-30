/** Warm top-left glow behind image-less dark banners. Its parent needs `relative overflow-hidden`. */
export default function HeroGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_18%_15%,rgba(196,140,96,0.3),transparent_60%)] rtl:bg-[radial-gradient(ellipse_70%_90%_at_82%_15%,rgba(196,140,96,0.3),transparent_60%)]"
    />
  );
}
