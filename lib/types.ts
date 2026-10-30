export interface ModelSpecGroup {
  label: string;
  items: { label: string; value: string }[];
}

export interface ModelColour {
  name: string;
  hex: string;
  image?: string;
}

export interface ModelVariant {
  id: string;
  name: string;
  priceDelta: number;
  powerHp: string;
  rangeKm: string;
}

export interface StatItem {
  label: string;
  value: string;
  /** Icon key under /svg/model-spec; defaults to the fixed engine → combined-range order. */
  icon?: string;
}

export interface DesignGallerySlide {
  imageLabel: string;
  heading: string;
  body: string;
}

export interface CabinTab {
  label: string;
  heading: string;
  body: string;
  imageLabel: string;
  image?: string;
  /** Optional second view, shown beside `image` in the interior carousel. */
  image2?: string;
}

export interface DimensionRow {
  label: string;
  value: string;
}

export interface HotspotFeature {
  x: number;
  y: number;
  imageLabel: string;
  title: string;
  body: string;
}

export interface SliderItem {
  title: string;
  body: string;
  imageLabel?: string;
  image?: string;
  /** Icon key under /svg/performance (e.g. "engine" → engine-active.svg). */
  icon?: string;
}

/** One powertrain option (e.g. ICE / PHEV); unset fields fall back to the detail page's own. */
export interface ModelPowertrain {
  id: string;
  label: string;
  brochure?: string;
  heroImage?: string;
  stats?: StatItem[];
  performanceItems?: SliderItem[];
  highlights?: HotspotFeature[];
}

export interface ModelDetailPage {
  heroHeadline: string;
  heroSubcopy: string;
  statsEyebrow: string;
  stats: StatItem[];
  exteriorImageLabel: string;
  designEyebrow: string;
  designTitle: string;
  designGallery: DesignGallerySlide[];
  highlightsEyebrow: string;
  highlightsTitle: string;
  highlights: HotspotFeature[];
  terrainEyebrow?: string;
  terrainItems?: SliderItem[];
  exteriorEyebrow?: string;
  exteriorItems?: SliderItem[];
  interiorEyebrow?: string;
  interiorItems?: SliderItem[];
  cabinEyebrow: string;
  cabinTitle: string;
  cabinIntro: string;
  cabinTabs: CabinTab[];
  utilityTitle: string;
  utilityIntro: string;
  utilitySpecs: StatItem[];
  accessoriesTitle: string;
  accessories: string[];
  factoryOptionalEquipmentTitle?: string;
  factoryOptionalEquipment?: string[];
  chargingLabel: string;
  chargingBody: string;
  chargingImageLabel: string;
  dimensionsTitle: string;
  dimensions: DimensionRow[];
  dimensionsImageLabel: string;
  /** With 2+ powertrains, the model's first spec groups are one per powertrain, in this order. */
  powertrains?: ModelPowertrain[];
}

export interface VehicleModel {
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  startingPrice: number;
  currency: string;
  heroImageLabel: string;
  heroImage?: string;
  gallery: string[];
  overview: string;
  specs: ModelSpecGroup[];
  features: string[];
  technology: string[];
  safety: string[];
  exterior: string[];
  interior: string[];
  colours: ModelColour[];
  interiorColours: ModelColour[];
  variants: ModelVariant[];
  detailPage: ModelDetailPage;
}

export interface OfferTermsItem {
  text: string;
  subItems?: string[];
}

export interface OfferTermsSection {
  heading: string;
  body?: string;
  items?: OfferTermsItem[];
}

export interface Offer {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  imageLabel: string;
  image?: string;
  /** Same photography as `image` with the baked-in copy painted out. */
  bannerImage?: string;
  highlights?: { value: string; label: string }[];
  validUntil: string;
  terms: string[];
  termsSections?: OfferTermsSection[];
}

export interface PreOwnedVehicle {
  id: string;
  model: string;
  year: number;
  km: number;
  price: number;
  colour: string;
  engineSize: string;
  transmission: string;
  fuelType: string;
  bodyStyle: string;
  imageLabel: string;
  description: string;
}

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  date: string;
  imageLabel: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  date: string;
  author: string;
  imageLabel: string;
  youtubeId?: string;
  image?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  imageLabel: string;
}
