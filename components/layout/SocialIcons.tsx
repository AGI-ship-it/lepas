import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

export const SOCIAL_LINKS = [
  { label: "WhatsApp", href: "https://wa.me/971600553727", Icon: FaWhatsapp },
  { label: "Facebook", href: "https://www.facebook.com/p/LEPAS-International-61578653973934/", Icon: FaFacebookF },
  { label: "Instagram", href: "https://www.instagram.com/lepas.uae/", Icon: FaInstagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/alghurair-mobility/", Icon: FaLinkedinIn },
];

export default function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {SOCIAL_LINKS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-lepas-amber hover:text-lepas-amber"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
