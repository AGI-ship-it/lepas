import modelsEn from "@/data/models.json";
import modelsAr from "@/data/ar/models.json";
import offersEn from "@/data/offers.json";
import offersAr from "@/data/ar/offers.json";
import newsEn from "@/data/news.json";
import newsAr from "@/data/ar/news.json";
import blogEn from "@/data/blog.json";
import blogAr from "@/data/ar/blog.json";
import preownedEn from "@/data/preowned.json";
import preownedAr from "@/data/ar/preowned.json";
import servicesEn from "@/data/services.json";
import servicesAr from "@/data/ar/services.json";
import testimonialsEn from "@/data/testimonials.json";
import testimonialsAr from "@/data/ar/testimonials.json";

import {
  VehicleModel,
  Offer,
  NewsArticle,
  BlogPost,
  PreOwnedVehicle,
  ServiceItem,
  Testimonial,
} from "@/lib/types";
import { Locale } from "@/lib/i18n";

export function getModels(locale: Locale): VehicleModel[] {
  return (locale === "ar" ? modelsAr : modelsEn) as VehicleModel[];
}

export function getOffers(locale: Locale): Offer[] {
  return (locale === "ar" ? offersAr : offersEn) as Offer[];
}

export function getNews(locale: Locale): NewsArticle[] {
  return (locale === "ar" ? newsAr : newsEn) as NewsArticle[];
}

export function getBlog(locale: Locale): BlogPost[] {
  return (locale === "ar" ? blogAr : blogEn) as BlogPost[];
}

export function getPreOwned(locale: Locale): PreOwnedVehicle[] {
  return (locale === "ar" ? preownedAr : preownedEn) as PreOwnedVehicle[];
}

export function getServices(locale: Locale): ServiceItem[] {
  return (locale === "ar" ? servicesAr : servicesEn) as ServiceItem[];
}

export function getTestimonials(locale: Locale): Testimonial[] {
  return (locale === "ar" ? testimonialsAr : testimonialsEn) as Testimonial[];
}
