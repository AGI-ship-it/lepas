interface PlaceholderImageProps {
  label: string;
  src?: string;
  className?: string;
  aspect?: string;
  tone?: "dark" | "light" | "accent";
  fit?: "cover" | "contain";
  showLabel?: boolean;
}

const tones = {
  dark: "from-lepas-graphite via-lepas-ink to-lepas-black text-white/40",
  light: "from-lepas-fog via-white to-lepas-fog text-lepas-black/30",
  accent: "from-lepas-amber-hover via-lepas-amber to-lepas-cream text-white/60",
};

const A = "/design/assets";

// Page heroes pass these labels; each maps to a fixed lepasuae.com image.
export const CURATED_IMAGES: Record<string, string> = {
  "Lepas showroom": `${A}/contact-hero-cover-l8-colors11.webp`,
  "Lepas offers": `${A}/home/hero-lineup.webp`,
  "Lepas newsroom": `${A}/journey-3cars.webp`,
  "Lepas stories": `${A}/lifestyle/l8-drive.webp`,
  "Lepas brand story": `${A}/about/hero-landscape.webp`,
  "Lepas service and support": `${A}/services/hero.webp`,
  "Lepas service appointment": `${A}/warranty-roadside.webp`,
  "Lepas pre-owned": `${A}/allmodels-mobile.webp`,
  "Lepas legal": `${A}/about/brand-story-bg.webp`,
  "Lepas support": `${A}/hero-car-from-figma.webp`,
  "Lepas finance": `${A}/home/offer-l8.webp`,
  "Lepas test drive": `${A}/contact-hero-cover-l8-colors11.webp`,
  "Modelled after the leopard": `${A}/inspired/aesthetics-car.webp`,
  "Technology that feels intuitive": `${A}/inspired/technology-cockpit.webp`,
  "A space that lets you breathe": `${A}/inspired/space-cabin.webp`,
  "The Lepas smart SUV range lined up side by side": `${A}/journey-3cars.webp`,
  "مستوحاة من الفهد": `${A}/inspired/aesthetics-car.webp`,
  "تقنية بديهية": `${A}/inspired/technology-cockpit.webp`,
  "مساحة تمنحك حرية التنفس": `${A}/inspired/space-cabin.webp`,
  "فئة سيارات ليباس SUV الذكية مصطفة جنبًا إلى جنب": `${A}/journey-3cars.webp`,
};

// Fallback pool for labels without a dedicated image.
const POOL = [
  `${A}/lifestyle/l8-drive.webp`,
  `${A}/lifestyle/l6.webp`,
  `${A}/lifestyle/l4-drive.webp`,
  `${A}/inspired/aesthetics-car.webp`,
  `${A}/inspired/technology-cockpit.webp`,
  `${A}/inspired/space-cabin.webp`,
  `${A}/about/hero-landscape.webp`,
  `${A}/about/lepas-video-poster.webp`,
  `${A}/interior/l8/twotone-a.webp`,
  `${A}/interior/l8/display-a.webp`,
  `${A}/interior/l6/seats-a.webp`,
  `${A}/interior/l4/moonlight-grey.webp`,
  `${A}/exterior/l8/headlights-on.webp`,
  `${A}/exterior/l6/sunroof.webp`,
  `${A}/exterior/l4/spoiler-on.webp`,
  `${A}/L8-v2.webp`,
  `${A}/L6-v2.webp`,
  `${A}/L4-v2.webp`,
  `${A}/journey-3cars.webp`,
  `${A}/life-tech-cockpit.webp`,
];

function hashToIndex(label: string, count: number) {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = (hash * 31 + label.charCodeAt(i)) >>> 0;
  }
  return hash % count;
}

export default function PlaceholderImage({
  label,
  src,
  className = "",
  aspect = "aspect-[4/3]",
  tone = "dark",
  fit = "cover",
  showLabel = false,
}: PlaceholderImageProps) {
  const resolved = src ?? CURATED_IMAGES[label] ?? POOL[hashToIndex(label, POOL.length)];

  return (
    <div
      className={`relative flex ${aspect} w-full items-center justify-center overflow-hidden bg-gradient-to-br ${tones[tone]} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolved}
        alt={label}
        className={`absolute inset-0 h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
        loading="lazy"
      />
      {showLabel && (
        <span className="absolute bottom-2 end-2 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white/80 backdrop-blur-sm">
          {label}
        </span>
      )}
    </div>
  );
}
