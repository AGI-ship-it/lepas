"use client";

import { useEffect, useState } from "react";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp, FaLink } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useLocale } from "@/components/i18n/LocaleProvider";

// Same icon set and round outline as the footer social icons (SocialIcons.tsx), in light-background colours.
const ICON_BUTTON =
  "flex h-11 w-11 items-center justify-center rounded-full border border-lepas-black/15 text-lepas-steel transition-colors hover:border-lepas-amber hover:text-lepas-amber";

export default function ShareButtons({ title }: { title: string }) {
  const { locale } = useLocale();
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Facebook",
      Icon: FaFacebookF,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "X",
      Icon: FaXTwitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "LinkedIn",
      Icon: FaLinkedinIn,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "WhatsApp",
      Icon: FaWhatsapp,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex items-center gap-3">
      <p className="text-xs font-semibold uppercase tracking-widest2 text-lepas-ash">
        {locale === "ar" ? "شارك" : "Share"}
      </p>
      {links.map(({ label, Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${locale === "ar" ? "شارك عبر" : "Share on"} ${label}`}
          className={ICON_BUTTON}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label={locale === "ar" ? "نسخ الرابط" : "Copy link"}
        className={ICON_BUTTON}
      >
        <FaLink className="h-4 w-4" aria-hidden="true" />
      </button>
      {copied && (
        <span className="text-xs text-lepas-steel">{locale === "ar" ? "تم النسخ" : "Copied"}</span>
      )}
    </div>
  );
}
