"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M15 8.5h-2a1 1 0 00-1 1V12h3l-.4 3H12v7h-3v-7H7v-3h2v-2.2C9 7.9 10.6 6 13.2 6H15v2.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4 4l7.5 9.5L4.5 20h2l6-6.6L17 20h3l-7.8-9.9L19.5 4h-2l-5.6 6.1L9 4H4z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="7.8" cy="8" r="1.2" fill="currentColor" />
      <path d="M7.8 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M11.5 17v-3.5c0-1.4 1-2.5 2.4-2.5s2.1 1 2.1 2.5V17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11.5 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12 3a9 9 0 00-7.75 13.5L3 21l4.65-1.22A9 9 0 1012 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M9.5 14.5l5-5M8.5 10.5l-2 2a3 3 0 004.24 4.24l2-2M15.5 13.5l2-2a3 3 0 00-4.24-4.24l-2 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
      Icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "X",
      Icon: XIcon,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "LinkedIn",
      Icon: LinkedInIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "WhatsApp",
      Icon: WhatsAppIcon,
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
          className="flex h-9 w-9 items-center justify-center border border-lepas-fog text-lepas-steel transition-colors hover:border-lepas-black hover:text-lepas-black"
        >
          <Icon />
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label={locale === "ar" ? "نسخ الرابط" : "Copy link"}
        className="flex h-9 w-9 items-center justify-center border border-lepas-fog text-lepas-steel transition-colors hover:border-lepas-black hover:text-lepas-black"
      >
        <LinkIcon />
      </button>
      {copied && (
        <span className="text-xs text-lepas-steel">{locale === "ar" ? "تم النسخ" : "Copied"}</span>
      )}
    </div>
  );
}
