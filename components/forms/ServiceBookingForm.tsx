"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiAlertTriangle, FiCheck, FiCheckCircle, FiChevronDown, FiInfo, FiRefreshCw, FiX } from "react-icons/fi";
import { useLocale } from "@/components/i18n/LocaleProvider";
import SelectField from "@/components/forms/SelectField";
import DatePicker from "@/components/forms/DatePicker";
import BrandLoader from "@/components/ui/BrandLoader";
import {
  BOOKING_CONFIG,
  MOCK_CUSTOMER,
  PHONE_COUNTRIES,
  PURPOSES,
  REG_COUNTRIES,
  SERVICE_BOOKING_COPY,
  SERVICE_INTERVALS,
  TITLES,
  TRANSPORT_OPTIONS,
  fill,
  makeCaptcha,
  maskEmail,
  maskPhone,
  maskPlate,
  pickupSlots,
  type Purpose,
  type TransportOption,
} from "@/lib/serviceBooking";

/* ------------------------------------------------------------------ helpers */

const toIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const formatDate = (iso: string) => (iso ? iso.split("-").reverse().join("-") : "—"); // DD-MM-YYYY
const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
const hasLetters = (s: string) => /[A-Za-z]/.test(s);

type Errors = Partial<Record<string, string>>;

const ROW_TITLE = "text-sm font-bold uppercase tracking-widest2 text-lepas-black";
const ROW = "border-b border-lepas-fog py-6";

/* ------------------------------------------------------------ small pieces */

function Field({
  id,
  label,
  required,
  error,
  children,
  hint,
}: {
  id?: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <div data-field={id}>
      <label htmlFor={id} className="mb-2 block text-xs font-medium uppercase tracking-widest2 text-lepas-ash">
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="text-lepas-amber"> *</span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>
      {children}
      {hint}
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-lepas-error">
          {error}
        </p>
      )}
    </div>
  );
}

/** Single-select pill buttons (Yes/No, transmission, model, transport). Unchosen options fade once one is picked. */
function Options<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
  fadeOthers,
}: {
  label: string;
  value: T | "";
  options: { value: T; label: string; disabled?: boolean }[];
  onChange: (v: T) => void;
  disabled?: boolean;
  fadeOthers?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-3">
      {options.map((o) => {
        const on = o.value === value;
        const off = disabled || o.disabled;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            disabled={off}
            onClick={() => onChange(o.value)}
            className={`min-w-[9rem] flex-1 border px-5 py-2.5 text-sm sm:flex-none font-semibold uppercase tracking-wider transition-colors ${
              on
                ? "border-lepas-amber bg-lepas-amber text-lepas-black"
                : `border-lepas-fog bg-white text-lepas-ink hover:border-lepas-amber ${fadeOthers && value ? "opacity-50" : ""}`
            } disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-lepas-fog`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Accordion({
  index,
  title,
  open,
  onToggle,
  children,
}: {
  index: number;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const panelId = useId();
  return (
    <section className="border-b border-lepas-fog" data-index={index}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center gap-3 py-6 text-start"
        >
          <span className={ROW_TITLE + " flex-1"}>{title}</span>
          <FiChevronDown aria-hidden="true" className={`h-5 w-5 text-lepas-amber transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </h3>
      <div id={panelId} hidden={!open} className="pb-8">
        {children}
      </div>
    </section>
  );
}

function Notice({ tone, children }: { tone: "info" | "warn" | "success"; children: React.ReactNode }) {
  const styles = {
    info: "border-lepas-fog bg-lepas-sand/60 text-lepas-steel",
    warn: "border-lepas-amber/60 bg-lepas-amber/10 text-lepas-ink",
    success: "border-lepas-success/40 bg-lepas-success/10 text-lepas-ink",
  }[tone];
  const Icon = tone === "success" ? FiCheckCircle : tone === "warn" ? FiAlertTriangle : FiInfo;
  return (
    <div role={tone === "info" ? undefined : "status"} className={`flex items-start gap-3 border p-4 text-sm ${styles}`}>
      <Icon aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 ${tone === "success" ? "text-lepas-success" : "text-lepas-amber"}`} />
      <div>{children}</div>
    </div>
  );
}

/** Searchable country-code picker (search by name, dial code or ISO), resets its search on open. */
function PhoneInput({
  id,
  country,
  onCountry,
  value,
  onChange,
  locale,
  searchLabel,
  invalid,
  placeholder,
  className = "",
}: {
  id: string;
  country: string;
  onCountry: (iso: string) => void;
  value: string;
  onChange: (v: string) => void;
  locale: "en" | "ar";
  searchLabel: string;
  invalid?: boolean;
  placeholder: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const current = PHONE_COUNTRIES.find((c) => c.iso === country) ?? PHONE_COUNTRIES[0];
  const list = PHONE_COUNTRIES.filter((c) => {
    const s = q.trim().toLowerCase();
    return !s || c.en.toLowerCase().includes(s) || c.ar.includes(s) || c.dial.includes(s) || c.iso.toLowerCase().includes(s);
  });

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={root} className={`relative flex gap-3 ${className}`}>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={`${current.en} ${current.dial}`}
          onClick={() => {
            setQ("");
            setOpen((o) => !o);
          }}
          className="input-field-light flex w-36 shrink-0 items-center justify-between gap-2 text-start"
          dir="ltr"
        >
          <span>
            {current.iso} ({current.dial})
          </span>
          <FiChevronDown aria-hidden="true" className={`h-4 w-4 text-lepas-amber transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        <input
          id={id}
          className={`input-field-light min-w-0 flex-1 ${invalid ? "!border-lepas-error" : ""}`}
          type="tel"
          inputMode="tel"
          dir="ltr"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      {open && (
        <div className="absolute start-0 top-full z-30 mt-2 w-72 border border-lepas-fog bg-white shadow-2xl">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchLabel}
            aria-label={searchLabel}
            className="w-full border-b border-lepas-fog px-4 py-3 text-sm outline-none"
          />
          <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
            {list.map((c) => (
              <li key={c.iso}>
                <button
                  type="button"
                  role="option"
                  aria-selected={c.iso === country}
                  onClick={() => {
                    onCountry(c.iso);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-start text-sm hover:bg-lepas-amber/10 ${
                    c.iso === country ? "font-semibold text-lepas-black" : "text-lepas-ink"
                  }`}
                >
                  <span aria-hidden="true">{c.flag}</span>
                  <span className="flex-1">{locale === "ar" ? c.ar : c.en}</span>
                  <span dir="ltr" className="text-lepas-ash">{c.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Portal dialog: focus moves in on open, Escape runs onEscape, focus returns to the opener on close. Backdrop clicks do nothing. */
function Dialog({
  open,
  labelId,
  onEscape,
  children,
  wide,
}: {
  open: boolean;
  labelId: string;
  onEscape: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    box.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
      // Keep Tab inside the dialog.
      if (e.key === "Tab" && box.current) {
        const f = box.current.querySelectorAll<HTMLElement>("button, a[href], input, textarea, [tabindex]:not([tabindex='-1'])");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onEscape]);
  if (!mounted || !open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        tabIndex={-1}
        className={`max-h-[90vh] w-full overflow-y-auto bg-white text-lepas-ink shadow-2xl outline-none ${wide ? "max-w-2xl" : "max-w-xl"}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------------------------------------------ form */

/**
 * Lepas service booking, following VEHICLE_SERVICE_BOOKING_REPLICATION_SPEC.md:
 * existing-customer verification (or new-customer details), appointment with purpose-dependent fields,
 * weekday-only dates, optional pickup / drop-off gated by Terms, privacy, CAPTCHA and a confirmation summary.
 * Production fixes over the prototype: visibly required fields are enforced on submit, the English drop-off
 * charge is dynamic, the summary is fully localised, and acknowledging Terms also ticks the checkbox.
 */
export default function ServiceBookingForm() {
  const { locale } = useLocale();
  const t = SERVICE_BOOKING_COPY[locale];
  const L = (o: { en: string; ar: string }) => (locale === "ar" ? o.ar : o.en);

  // Customer type and existing-customer lookup
  const [customerType, setCustomerType] = useState<"existing" | "new" | null>(null);
  const [verified, setVerified] = useState(false);
  const [lookup, setLookup] = useState({ country: "AE", city: "", prefix: "", plate: "", phone: "", phoneCountry: "AE" });
  const [lookupError, setLookupError] = useState("");
  const [saudiRedirect, setSaudiRedirect] = useState(false);
  const [foundVehicle, setFoundVehicle] = useState("");
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Personal and vehicle
  const [personal, setPersonal] = useState({ title: "", firstName: "", lastName: "", phoneCountry: "AE", phone: "", email: "" });
  const [vehicle, setVehicle] = useState({ country: "AE", city: "", prefix: "", plate: "", transmission: "Automatic", model: "" });

  // Appointment
  const [purpose, setPurpose] = useState<Purpose | "">("");
  const [interval, setInterval] = useState("");
  const [specify, setSpecify] = useState("");
  const [locationId, setLocationId] = useState("");
  const [date, setDate] = useState("");
  const [wait, setWait] = useState<"yes" | "no">("no");
  const [message, setMessage] = useState("");

  // Transport
  const [transport, setTransport] = useState<TransportOption>("none");
  const [termsChecked, setTermsChecked] = useState(false);
  const [termsAck, setTermsAck] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [pickup, setPickup] = useState({ address: "", time: "", instructions: "" });
  const [dropoff, setDropoff] = useState({ address: "", instructions: "" });

  // Consent, CAPTCHA, submission
  const [privacy, setPrivacy] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  useEffect(() => setCaptcha(makeCaptcha()), []); // client-only so SSR and hydration agree
  const [errors, setErrors] = useState<Errors>({});
  const [reference, setReference] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  // Accordions
  const [openSection, setOpenSection] = useState({ personal: false, vehicle: false, appointment: false, pickup: true, dropoff: true });
  const toggle = (k: keyof typeof openSection) => setOpenSection((s) => ({ ...s, [k]: !s[k] }));

  /* derived */
  const location = BOOKING_CONFIG.locations.find((l) => l.id === locationId);
  const transportEnabled = Boolean(location && date && location.transportAvailable);
  const transportActive = transport !== "none" && transportEnabled;
  const showTransportDetails = transportActive && termsAck;
  const captchaValid = captchaInput.length === 6 && captchaInput === captcha;
  const canSubmit = captchaValid && privacy && (!transportActive || termsAck);
  const showForm = customerType === "new" || (customerType === "existing" && verified);
  const isExisting = customerType === "existing" && verified;
  const slots = useMemo(() => pickupSlots(date), [date]);
  const charge = location
    ? transport === "pickup"
      ? location.pickupCharge
      : transport === "dropoff"
      ? location.dropoffCharge
      : transport === "both"
      ? location.pickupCharge + location.dropoffCharge
      : 0
    : 0;

  const { minDate, maxDate } = useMemo(() => {
    const today = new Date();
    return { minDate: toIso(today), maxDate: toIso(new Date(today.getFullYear(), today.getMonth() + 3, today.getDate())) };
  }, []);

  const regCities = (iso: string) => REG_COUNTRIES.find((c) => c.iso === iso)?.cities ?? [];
  const clearError = (...keys: string[]) =>
    setErrors((e) => {
      const n = { ...e };
      keys.forEach((k) => delete n[k]);
      return n;
    });

  /* customer type (resets only the lookup state, as in the spec) */
  const resetLookup = () => {
    setVerified(false);
    setFoundVehicle("");
    setLookupError("");
    setSaudiRedirect(false);
    setLookup({ country: "AE", city: "", prefix: "", plate: "", phone: "", phoneCountry: "AE" });
  };
  const chooseExisting = () => {
    setCustomerType("existing");
    resetLookup();
    setOpenSection((s) => ({ ...s, personal: false, vehicle: false, appointment: true }));
  };
  const chooseNew = () => {
    setCustomerType("new");
    resetLookup();
    setOpenSection((s) => ({ ...s, personal: true, vehicle: false, appointment: false }));
  };

  /* existing-customer verification, in the spec's order */
  // Show the loader while "searching", then run the checks (simulates the lookup round trip).
  const verify = () => {
    if (searching) return;
    setLookupError("");
    setSearching(true);
    window.setTimeout(() => {
      setSearching(false);
      runVerify();
    }, 1400);
  };
  const runVerify = () => {
    const { country, city, prefix, plate, phone } = lookup;
    if (!country || !city || !prefix.trim() || !plate.trim()) return setLookupError(t.errFillVehicle);
    if (country === "SA") {
      setCustomerType("new");
      setLookupError("");
      setSaudiRedirect(true);
      setOpenSection((s) => ({ ...s, personal: true }));
      return;
    }
    if (!phone.trim() || hasLetters(phone)) return setLookupError(t.errInvalidPhone);
    if (phone.trim() !== MOCK_CUSTOMER.phone) return setLookupError(t.errNoCustomer);
    const match = MOCK_CUSTOMER.vehicles.find(
      (v) =>
        v.country === country &&
        v.city === city &&
        v.prefix.toUpperCase() === prefix.trim().toUpperCase() &&
        v.plate === plate.trim(),
    );
    if (!match) return setLookupError(t.errNoVehicle);
    setLookupError("");
    setVerified(true);
    setFoundVehicle(`${match.model} ${match.year}`);
    setPersonal({
      title: MOCK_CUSTOMER.title,
      firstName: MOCK_CUSTOMER.firstName,
      lastName: MOCK_CUSTOMER.lastName,
      phoneCountry: "AE",
      phone: MOCK_CUSTOMER.phone,
      email: MOCK_CUSTOMER.email,
    });
    setVehicle((v) => ({ ...v, country: match.country, city: match.city, prefix: match.prefix, plate: match.plate, model: match.model }));
    setOpenSection((s) => ({ ...s, personal: false, vehicle: false, appointment: true }));
  };

  /* appointment dependencies */
  const choosePurpose = (p: Purpose) => {
    setPurpose(p);
    setInterval("");
    setSpecify("");
    clearError("purpose", "interval", "specify");
  };
  const resetTerms = () => {
    setTermsChecked(false);
    setTermsAck(false);
    setTermsOpen(false);
  };
  const chooseLocation = (id: string) => {
    setLocationId(id);
    setDate("");
    setPickup((p) => ({ ...p, time: "" }));
    clearError("location");
    const loc = BOOKING_CONFIG.locations.find((l) => l.id === id);
    if (loc && !loc.transportAvailable) {
      setTransport("none");
      resetTerms();
    }
  };
  const chooseDate = (iso: string) => {
    setDate(iso);
    clearError("date");
    setPickup((p) => (p.time && !pickupSlots(iso).includes(p.time) ? { ...p, time: "" } : p));
  };
  const chooseTransport = (o: TransportOption) => {
    setTransport(o);
    resetTerms();
    clearError("terms");
  };
  const onTermsCheckbox = (checked: boolean) => {
    if (checked) {
      setTermsChecked(true);
      if (!termsAck) setTermsOpen(true);
    } else resetTerms();
  };

  /* submit: the spec's gate, plus enforcement of every visibly required field */
  const validate = (): Errors => {
    const e: Errors = {};
    const req = t.required;
    if (!isExisting) {
      if (!personal.title) e.title = req;
      if (!personal.firstName.trim()) e.firstName = req;
      if (!personal.lastName.trim()) e.lastName = req;
      if (!personal.phone.trim() || hasLetters(personal.phone) || personal.phone.replace(/\D/g, "").length < 7) e.phone = t.errInvalidPhone;
      if (!/^\S+@\S+\.\S+$/.test(personal.email)) e.email = req;
      if (!vehicle.country) e.vCountry = req;
      if (!vehicle.city) e.vCity = req;
      if (!vehicle.prefix) e.vPrefix = req;
      if (!vehicle.plate) e.vPlate = req;
      if (!vehicle.model) e.vModel = req;
    }
    if (!purpose) e.purpose = req;
    if (purpose === "Service" && !interval) e.interval = req;
    if ((purpose === "Collision Damage" || purpose === "Report a Fault") && !specify.trim()) e.specify = req;
    if (!locationId) e.location = req;
    if (!date) e.date = req;
    if (transportActive && termsAck) {
      if ((transport === "pickup" || transport === "both") && !pickup.address.trim()) e.pickupAddress = req;
      if ((transport === "pickup" || transport === "both") && !pickup.time) e.pickupTime = req;
      if ((transport === "dropoff" || transport === "both") && !dropoff.address.trim()) e.dropoffAddress = req;
    }
    return e;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!canSubmit || submitting) return;
    const e = validate();
    setErrors(e);
    const keys = Object.keys(e);
    if (keys.length) {
      const personalKeys = ["title", "firstName", "lastName", "phone", "email"];
      const vehicleKeys = ["vCountry", "vCity", "vPrefix", "vPlate", "vModel"];
      setOpenSection((s) => ({
        ...s,
        personal: s.personal || keys.some((k) => personalKeys.includes(k)),
        vehicle: s.vehicle || keys.some((k) => vehicleKeys.includes(k)),
        appointment: s.appointment || keys.some((k) => ["purpose", "interval", "specify", "location", "date"].includes(k)),
        pickup: s.pickup || keys.some((k) => k.startsWith("pickup")),
        dropoff: s.dropoff || keys.some((k) => k.startsWith("dropoff")),
      }));
      requestAnimationFrame(() =>
        document.querySelector(`[data-field="${keys[0]}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" }),
      );
      return;
    }
    // Loader while the booking is "sent", then the confirmation.
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setReference(`${BOOKING_CONFIG.referencePrefix}${Date.now().toString(36).toUpperCase().slice(-6)}`);
      setSuccessOpen(true);
    }, 1400);
  };

  /* summary values (existing customers stay masked) */
  const phoneCountry = PHONE_COUNTRIES.find((c) => c.iso === personal.phoneCountry) ?? PHONE_COUNTRIES[0];
  const shownPhone = isExisting ? maskPhone(personal.phone) : personal.phone;
  const shownEmail = isExisting ? maskEmail(personal.email) : personal.email;
  const shownPlate = isExisting ? maskPlate(vehicle.plate) : vehicle.plate;
  const regCountryName = (iso: string) => {
    const c = REG_COUNTRIES.find((x) => x.iso === iso);
    return c ? L(c) : iso;
  };
  const cityName = (iso: string, en: string) => {
    const c = regCities(iso).find((x) => x.en === en);
    return c ? L(c) : en;
  };
  const locationName = location ? location.label[locale] : "—";
  const centre = BOOKING_CONFIG.serviceCentreAddress[locale];

  const termsLabelId = useId();
  const successLabelId = useId();

  /* ------------------------------------------------------------ render */
  return (
    <form onSubmit={onSubmit} noValidate className="border-t border-lepas-fog">
      {/* Existing customer? */}
      <div className={`${ROW} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
        <div>
          <p className={ROW_TITLE}>{t.existingQuestion}</p>
          <p className="mt-1 text-xs text-lepas-ash">{t.existingHint}</p>
        </div>
        <div className="shrink-0">
          <Options
            label={t.existingQuestion}
            value={customerType === "existing" ? "yes" : customerType === "new" ? "no" : ""}
            options={[
              { value: "yes", label: t.yes },
              { value: "no", label: t.no },
            ]}
            onChange={(v) => (v === "yes" ? chooseExisting() : chooseNew())}
          />
        </div>
      </div>

      {customerType === "existing" && !verified && (
        <>
          <div className={ROW}>
            <p className="mb-4 text-xs font-medium uppercase tracking-widest2 text-lepas-ash">
              {t.vehicle}
              <span aria-hidden="true" className="text-lepas-amber"> *</span>
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Field label={t.regCountry} required>
                <SelectField
                  value={lookup.country}
                  onChange={(v) => setLookup((l) => ({ ...l, country: v, city: "" }))}
                  placeholder={t.selectCountry}
                  options={REG_COUNTRIES.map((c) => ({ value: c.iso, label: c.iso, description: L(c) }))}
                />
              </Field>
              <Field label={t.regCity} required>
                <SelectField
                  value={lookup.city}
                  onChange={(v) => setLookup((l) => ({ ...l, city: v }))}
                  placeholder={t.selectCity}
                  options={regCities(lookup.country).map((c) => ({ value: c.en, label: L(c) }))}
                />
              </Field>
              <Field id="lookupPrefix" label={t.prefix} required>
                <input
                  id="lookupPrefix"
                  className="input-field-light uppercase"
                  dir="ltr"
                  placeholder={t.prefixPlaceholder}
                  value={lookup.prefix}
                  onChange={(e) => setLookup((l) => ({ ...l, prefix: e.target.value.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() }))}
                />
              </Field>
              <Field id="lookupPlate" label={t.plate} required>
                <input
                  id="lookupPlate"
                  className="input-field-light"
                  dir="ltr"
                  inputMode="numeric"
                  placeholder={t.platePlaceholder}
                  value={lookup.plate}
                  onChange={(e) => setLookup((l) => ({ ...l, plate: e.target.value.replace(/\D/g, "").slice(0, 5) }))}
                />
              </Field>
            </div>
          </div>

          {/* Mobile number: label left; code, number and Verify right */}
          <div className={`${ROW} flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between`}>
            <label htmlFor="lookupPhone" className="text-xs font-medium uppercase tracking-widest2 text-lepas-ash">
              {t.mobile}
              <span aria-hidden="true" className="text-lepas-amber"> *</span>
            </label>
            <div className="flex flex-col gap-3 sm:flex-row lg:w-[32rem]">
              <PhoneInput
                id="lookupPhone"
                className="flex-1"
                country={lookup.phoneCountry}
                onCountry={(iso) => setLookup((l) => ({ ...l, phoneCountry: iso }))}
                value={lookup.phone}
                onChange={(v) => setLookup((l) => ({ ...l, phone: v }))}
                locale={locale}
                searchLabel={t.searchCountry}
                placeholder={t.mobilePlaceholder}
              />
              <button type="button" onClick={verify} disabled={searching} className="btn-primary h-[46px] shrink-0 sm:w-40">
                {t.verify}
              </button>
            </div>
          </div>
          {lookupError && (
            <p role="alert" className="pt-4 text-sm font-medium text-lepas-error">
              {lookupError}
            </p>
          )}
        </>
      )}

      {isExisting && (
        <div className="pt-6">
          <Notice tone="success">{fill(t.vehicleFound, { vehicle: foundVehicle })}</Notice>
        </div>
      )}
      {saudiRedirect && customerType === "new" && (
        <div className="pt-6">
          <Notice tone="warn">{t.saudiRedirect}</Notice>
        </div>
      )}

      {showForm && (
        <>
          {!isExisting && (
            <Accordion index={1} title={t.personal} open={openSection.personal} onToggle={() => toggle("personal")}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2 sm:max-w-xs">
                  <Field id="title" label={t.title} required error={errors.title}>
                    <SelectField
                      value={personal.title}
                      onChange={(v) => {
                        setPersonal((p) => ({ ...p, title: v }));
                        clearError("title");
                      }}
                      placeholder="—"
                      options={TITLES.map((v) => ({ value: v, label: t.titles[v] }))}
                    />
                  </Field>
                </div>
                <Field id="firstName" label={t.firstName} required error={errors.firstName}>
                  <input
                    id="firstName"
                    className="input-field-light"
                    value={personal.firstName}
                    onChange={(e) => {
                      setPersonal((p) => ({ ...p, firstName: e.target.value }));
                      clearError("firstName");
                    }}
                  />
                </Field>
                <Field id="lastName" label={t.lastName} required error={errors.lastName}>
                  <input
                    id="lastName"
                    className="input-field-light"
                    value={personal.lastName}
                    onChange={(e) => {
                      setPersonal((p) => ({ ...p, lastName: e.target.value }));
                      clearError("lastName");
                    }}
                  />
                </Field>
                <Field id="phone" label={t.mobile} required error={errors.phone ?? (hasLetters(personal.phone) ? t.errInvalidPhone : undefined)}>
                  <PhoneInput
                    id="phone"
                    country={personal.phoneCountry}
                    onCountry={(iso) => setPersonal((p) => ({ ...p, phoneCountry: iso }))}
                    value={personal.phone}
                    onChange={(v) => {
                      setPersonal((p) => ({ ...p, phone: v }));
                      clearError("phone");
                    }}
                    locale={locale}
                    searchLabel={t.searchCountry}
                    placeholder={t.mobilePlaceholder}
                    invalid={Boolean(errors.phone) || hasLetters(personal.phone)}
                  />
                </Field>
                <Field id="email" label={t.email} required error={errors.email}>
                  <input
                    id="email"
                    type="email"
                    dir="ltr"
                    className="input-field-light"
                    value={personal.email}
                    onChange={(e) => {
                      setPersonal((p) => ({ ...p, email: e.target.value }));
                      clearError("email");
                    }}
                  />
                </Field>
              </div>
            </Accordion>
          )}

          {!isExisting && (
            <Accordion index={2} title={t.vehicle} open={openSection.vehicle} onToggle={() => toggle("vehicle")}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="vCountry" label={t.regCountry} required error={errors.vCountry}>
                  <SelectField
                    value={vehicle.country}
                    onChange={(v) => setVehicle((x) => ({ ...x, country: v, city: "" }))}
                    placeholder={t.selectCountry}
                    options={REG_COUNTRIES.map((c) => ({ value: c.iso, label: c.iso, description: L(c) }))}
                  />
                </Field>
                <Field id="vCity" label={t.regCity} required error={errors.vCity}>
                  <SelectField
                    value={vehicle.city}
                    onChange={(v) => {
                      setVehicle((x) => ({ ...x, city: v }));
                      clearError("vCity");
                    }}
                    placeholder={t.selectCity}
                    options={regCities(vehicle.country).map((c) => ({ value: c.en, label: L(c) }))}
                  />
                </Field>
                <Field id="vPrefix" label={t.prefix} required error={errors.vPrefix}>
                  <input
                    id="vPrefix"
                    className="input-field-light uppercase"
                    dir="ltr"
                    placeholder={t.prefixPlaceholder}
                    value={vehicle.prefix}
                    onChange={(e) => {
                      setVehicle((x) => ({ ...x, prefix: e.target.value.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() }));
                      clearError("vPrefix");
                    }}
                  />
                </Field>
                <Field id="vPlate" label={t.plate} required error={errors.vPlate}>
                  <input
                    id="vPlate"
                    className="input-field-light"
                    dir="ltr"
                    inputMode="numeric"
                    placeholder={t.platePlaceholder}
                    value={vehicle.plate}
                    onChange={(e) => {
                      setVehicle((x) => ({ ...x, plate: e.target.value.replace(/\D/g, "").slice(0, 5) }));
                      clearError("vPlate");
                    }}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label={t.transmission} required>
                    <Options
                      label={t.transmission}
                      value={vehicle.transmission as "Automatic" | "Manual"}
                      fadeOthers
                      options={[
                        { value: "Automatic", label: t.automatic },
                        { value: "Manual", label: t.manual },
                      ]}
                      onChange={(v) => setVehicle((x) => ({ ...x, transmission: v }))}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field id="vModel" label={t.model} required error={errors.vModel}>
                    <Options
                      label={t.model}
                      value={vehicle.model}
                      fadeOthers
                      options={BOOKING_CONFIG.models.map((m) => ({ value: m, label: m }))}
                      onChange={(v) => {
                        setVehicle((x) => ({ ...x, model: v }));
                        clearError("vModel");
                      }}
                    />
                  </Field>
                </div>
              </div>
            </Accordion>
          )}

          <Accordion
            index={isExisting ? 1 : 3}
            title={t.appointment}
            open={openSection.appointment}
            onToggle={() => toggle("appointment")}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="purpose" label={t.purpose} required error={errors.purpose}>
                <SelectField
                  value={purpose}
                  onChange={(v) => choosePurpose(v as Purpose)}
                  placeholder={t.selectPurpose}
                  options={PURPOSES.map((p) => ({ value: p, label: t.purposes[p] }))}
                />
              </Field>
              <Field
                id="interval"
                label={t.interval}
                required={purpose === "Service"}
                error={errors.interval}
                hint={
                  purpose === "Service" && (
                    <p className="mt-1.5 text-xs text-lepas-steel">
                      {isExisting ? fill(t.previousService, { record: L(MOCK_CUSTOMER.previousService) }) : t.noPreviousService}
                    </p>
                  )
                }
              >
                <div aria-disabled={purpose !== "Service"} className={purpose === "Service" ? "" : "pointer-events-none opacity-40"}>
                  <SelectField
                    value={interval}
                    onChange={(v) => {
                      setInterval(v);
                      clearError("interval");
                    }}
                    placeholder={t.selectInterval}
                    options={SERVICE_INTERVALS.map((n) => ({
                      value: `${n} Kilometer Mileage Service`,
                      label: fill(t.km, { n: n.toLocaleString(locale === "ar" ? "ar-AE" : "en-US") }),
                    }))}
                  />
                </div>
              </Field>
              <div className="sm:col-span-2">
                <Field id="specify" label={t.specify} required={purpose === "Collision Damage" || purpose === "Report a Fault"} error={errors.specify}>
                  <textarea
                    id="specify"
                    disabled={!(purpose === "Collision Damage" || purpose === "Report a Fault")}
                    className="input-field-light min-h-[80px] disabled:cursor-not-allowed disabled:opacity-40"
                    placeholder={t.specifyPlaceholder}
                    value={specify}
                    onChange={(e) => {
                      setSpecify(e.target.value);
                      clearError("specify");
                    }}
                  />
                </Field>
              </div>
              <Field id="location" label={t.location} required error={errors.location}>
                <SelectField
                  value={locationId}
                  onChange={chooseLocation}
                  placeholder={t.selectLocation}
                  options={BOOKING_CONFIG.locations.map((l) => ({ value: l.id, label: l.label[locale] }))}
                />
              </Field>
              <Field id="date" label={t.date} required error={errors.date}>
                <DatePicker
                  value={date}
                  onChange={chooseDate}
                  min={minDate}
                  max={maxDate}
                  locale={locale}
                  placeholder={locationId ? t.selectDate : t.selectLocationFirst}
                  todayLabel={locale === "ar" ? "اليوم" : "Today"}
                  closeLabel={t.close}
                  invalid={Boolean(errors.date)}
                  disabled={!locationId}
                  isDateDisabled={isWeekend}
                />
              </Field>
              {locationId && (
                <div className="sm:col-span-2">
                  <Notice tone="info">{t.arrival}</Notice>
                </div>
              )}
              <div className="sm:col-span-2">
                <Field label={t.wait}>
                  <Options
                    label={t.wait}
                    value={wait}
                    options={[
                      { value: "yes", label: t.yes },
                      { value: "no", label: t.no },
                    ]}
                    onChange={setWait}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="message" label={t.message}>
                  <textarea
                    id="message"
                    className="input-field-light min-h-[100px]"
                    placeholder={t.messagePlaceholder}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Field>
              </div>
            </div>
          </Accordion>

          {/* Pickup / drop-off */}
          <div className={ROW}>
            <p className={`${ROW_TITLE} mb-4`}>{t.transportTitle}</p>
            {location && !location.transportAvailable ? (
              <div className="mb-4">
                <Notice tone="warn">{t.transportUnavailable}</Notice>
              </div>
            ) : (
              !transportEnabled && (
                <div className="mb-4">
                  <Notice tone="info">{t.transportHint}</Notice>
                </div>
              )
            )}
            <Options
              label={t.transportTitle}
              value={transport}
              options={TRANSPORT_OPTIONS.map((o) => ({ value: o, label: t.transport[o], disabled: o !== "none" && !transportEnabled }))}
              onChange={chooseTransport}
            />

            {transportActive && (
              <div data-field="terms" className="mt-5">
                <label className="flex cursor-pointer items-start gap-3 text-sm text-lepas-steel">
                  <input
                    type="checkbox"
                    className="checkbox-field-light mt-0.5"
                    checked={termsChecked}
                    onChange={(e) => onTermsCheckbox(e.target.checked)}
                  />
                  <span>
                    {t.termsCheckbox}{" "}
                    <button
                      type="button"
                      onClick={() => setTermsOpen(true)}
                      className="font-semibold text-lepas-ink underline decoration-lepas-amber decoration-2 underline-offset-4"
                    >
                      {t.termsLink}
                    </button>
                  </span>
                </label>
              </div>
            )}

            {showTransportDetails && charge > 0 && location && (
              <div className="mt-5">
                <Notice tone="warn">
                  {fill(transport === "pickup" ? t.chargePickup : transport === "dropoff" ? t.chargeDropoff : t.chargeBoth, {
                    pickup: location.pickupCharge,
                    dropoff: location.dropoffCharge,
                    total: charge,
                    location: location.label[locale],
                  })}
                </Notice>
              </div>
            )}
          </div>

          {showTransportDetails && (transport === "pickup" || transport === "both") && (
            <Accordion index={isExisting ? 2 : 4} title={t.pickupDetails} open={openSection.pickup} onToggle={() => toggle("pickup")}>
              <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field id="pickupAddress" label={`${t.from} — ${t.yourAddress}`} required error={errors.pickupAddress}>
                      <input
                        id="pickupAddress"
                        className="input-field-light"
                        placeholder={t.addressPlaceholder}
                        value={pickup.address}
                        onChange={(e) => {
                          const v = e.target.value;
                          setPickup((p) => ({ ...p, address: v }));
                          if (transport === "both") setDropoff((d) => ({ ...d, address: v }));
                          clearError("pickupAddress");
                        }}
                      />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label={t.to}>
                      <input className="input-field-light cursor-not-allowed bg-lepas-sand/60 text-lepas-steel" readOnly value={centre} />
                    </Field>
                  </div>
                  <Field label={t.pickupDate}>
                    <input className="input-field-light cursor-not-allowed bg-lepas-sand/60 text-lepas-steel" readOnly dir="ltr" value={formatDate(date)} />
                  </Field>
                  <Field id="pickupTime" label={t.pickupTime} required error={errors.pickupTime}>
                    <SelectField
                      value={pickup.time}
                      onChange={(v) => {
                        setPickup((p) => ({ ...p, time: v }));
                        clearError("pickupTime");
                      }}
                      placeholder={t.selectTime}
                      options={slots.map((s) => ({ value: s, label: s }))}
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field id="pickupInstructions" label={t.instructions}>
                      <textarea
                        id="pickupInstructions"
                        className="input-field-light min-h-[80px]"
                        placeholder={t.instructionsPlaceholder}
                        value={pickup.instructions}
                        onChange={(e) => setPickup((p) => ({ ...p, instructions: e.target.value }))}
                      />
                    </Field>
                  </div>
                </div>
                <iframe
                  src={BOOKING_CONFIG.serviceCentreMap}
                  title={centre}
                  loading="lazy"
                  className="h-48 w-full border-0 lg:h-full lg:min-h-[280px]"
                />
              </div>
            </Accordion>
          )}

          {showTransportDetails && (transport === "dropoff" || transport === "both") && (
            <Accordion
              index={(isExisting ? 2 : 4) + (transport === "both" ? 1 : 0)}
              title={t.dropoffDetails}
              open={openSection.dropoff}
              onToggle={() => toggle("dropoff")}
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label={t.from}>
                      <input className="input-field-light cursor-not-allowed bg-lepas-sand/60 text-lepas-steel" readOnly value={centre} />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field id="dropoffAddress" label={`${t.to} — ${t.yourAddress}`} required error={errors.dropoffAddress}>
                      <input
                        id="dropoffAddress"
                        className="input-field-light"
                        placeholder={t.addressPlaceholder}
                        value={dropoff.address}
                        onChange={(e) => {
                          setDropoff((d) => ({ ...d, address: e.target.value }));
                          clearError("dropoffAddress");
                        }}
                      />
                    </Field>
                  </div>
                  <Field label={t.dropoffDate}>
                    <input className="input-field-light cursor-not-allowed bg-lepas-sand/60 text-lepas-steel" readOnly dir="ltr" value={formatDate(date)} />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field id="dropoffInstructions" label={t.instructions}>
                      <textarea
                        id="dropoffInstructions"
                        className="input-field-light min-h-[80px]"
                        placeholder={t.instructionsPlaceholder}
                        value={dropoff.instructions}
                        onChange={(e) => setDropoff((d) => ({ ...d, instructions: e.target.value }))}
                      />
                    </Field>
                  </div>
                </div>
                <iframe
                  src={BOOKING_CONFIG.serviceCentreMap}
                  title={centre}
                  loading="lazy"
                  className="h-48 w-full border-0 lg:h-full lg:min-h-[280px]"
                />
              </div>
            </Accordion>
          )}

          {/* Privacy, CAPTCHA, submit */}
          <div className="py-6">
            <label className="flex cursor-pointer items-start gap-3 text-sm text-lepas-steel">
              <input type="checkbox" className="checkbox-field-light mt-0.5" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} />
              <span>
                {t.privacyPrefix}{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-lepas-ink underline decoration-lepas-amber decoration-2 underline-offset-4"
                >
                  {t.privacyLink}
                </a>
              </span>
            </label>

            <div className="mt-6 border-t border-lepas-fog pt-6">
              <Field id="captcha" label={t.captcha} required>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    aria-hidden="true"
                    dir="ltr"
                    className="flex h-[46px] min-w-[150px] select-none items-center justify-center border border-lepas-fog bg-lepas-sand/60 px-5 font-mono text-xl font-bold italic tracking-[0.35em] text-lepas-black"
                  >
                    {captcha}
                  </span>
                  <span className="sr-only">{captcha.split("").join(" ")}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCaptcha(makeCaptcha());
                      setCaptchaInput("");
                    }}
                    aria-label={t.captchaRefresh}
                    className="flex h-[46px] w-[46px] items-center justify-center border border-lepas-fog text-lepas-steel transition-colors hover:border-lepas-amber hover:text-lepas-ink"
                  >
                    <FiRefreshCw aria-hidden="true" />
                  </button>
                  <input
                    id="captcha"
                    dir="ltr"
                    autoComplete="off"
                    className="input-field-light w-44 uppercase"
                    placeholder={t.captchaPlaceholder}
                    maxLength={6}
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value.toUpperCase().slice(0, 6))}
                  />
                </div>
                <p aria-live="polite" className="mt-2 min-h-[1.25rem] text-xs font-medium">
                  {captchaInput.length === 6 &&
                    (captchaValid ? (
                      <span className="inline-flex items-center gap-1.5 text-lepas-ink">
                        <FiCheck aria-hidden="true" className="text-lepas-success" /> {t.captchaOk}
                      </span>
                    ) : (
                      <span className="text-lepas-error">{t.captchaWrong}</span>
                    ))}
                </p>
              </Field>
            </div>

            {Object.keys(errors).length > 0 && (
              <p role="alert" className="mt-4 text-sm font-medium text-lepas-error">
                {t.fixErrors}
              </p>
            )}

            <button type="submit" disabled={!canSubmit || submitting} className="btn-primary mt-6 w-full sm:w-auto">
              {t.submit}
            </button>
          </div>
        </>
      )}

      {searching && <BrandLoader label={t.searching} />}
      {submitting && <BrandLoader label={t.submitting} />}

      {/* Terms & Conditions */}
      <Dialog open={termsOpen} labelId={termsLabelId} onEscape={resetTerms} wide>
        <div className="p-6 md:p-8">
          <h2 id={termsLabelId} className="heading-3">
            {t.termsTitle}
          </h2>
          <p className="mt-4 text-sm text-lepas-steel">{t.termsIntro}</p>
          <h3 className="mt-6 text-sm font-bold uppercase tracking-widest2 text-lepas-black">{t.termsNature}</h3>
          <ul className="mt-3 space-y-2 text-sm text-lepas-steel">
            {t.termsNatureItems.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <h3 className="mt-6 text-sm font-bold uppercase tracking-widest2 text-lepas-black">{t.termsAuth}</h3>
          <ul className="mt-3 space-y-2 text-sm text-lepas-steel">
            {t.termsAuthItems.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <button type="button" onClick={resetTerms} className="btn-outline">
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                setTermsAck(true);
                setTermsChecked(true);
                setTermsOpen(false);
                clearError("terms");
              }}
              className="btn-primary"
            >
              {t.acknowledge}
            </button>
          </div>
        </div>
      </Dialog>

      {/* Success */}
      <Dialog open={successOpen} labelId={successLabelId} onEscape={() => setSuccessOpen(false)}>
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <FiCheckCircle aria-hidden="true" className="h-10 w-10 text-lepas-success" />
            <button
              type="button"
              onClick={() => setSuccessOpen(false)}
              aria-label={t.close}
              className="flex h-10 w-10 items-center justify-center border border-lepas-fog text-lepas-steel hover:border-lepas-amber"
            >
              <FiX aria-hidden="true" />
            </button>
          </div>
          <h2 id={successLabelId} className="heading-3 mt-4">
            {t.successTitle}
          </h2>
          <p className="mt-2 text-sm text-lepas-steel">{t.successBody}</p>
          <p className="mt-1 text-sm text-lepas-steel">{t.successSent}</p>
          <p className="mt-4 text-sm">
            <span className="text-lepas-ash">{t.reference}: </span>
            <span dir="ltr" className="font-bold tracking-wider text-lepas-black">
              {reference}
            </span>
          </p>

          <dl className="mt-6 divide-y divide-lepas-fog border-y border-lepas-fog text-sm">
            {[
              [t.summaryName, [personal.title && t.titles[personal.title as keyof typeof t.titles], personal.firstName, personal.lastName].filter(Boolean).join(" ") || "—"],
              [t.summaryPhone, <span key="p" dir="ltr">{`${phoneCountry.flag} ${phoneCountry.dial} ${shownPhone}`}</span>],
              [t.summaryEmail, <span key="e" dir="ltr">{shownEmail || "—"}</span>],
              [
                t.summaryVehicle,
                `${regCountryName(vehicle.country)}, ${cityName(vehicle.country, vehicle.city)} · ${vehicle.prefix} ${shownPlate}`,
              ],
              [t.summaryPurpose, purpose ? t.purposes[purpose] : "—"],
              ...(purpose === "Service" && interval
                ? [[t.summaryInterval, fill(t.km, { n: parseInt(interval, 10).toLocaleString(locale === "ar" ? "ar-AE" : "en-US") })]]
                : []),
              ...(purpose && purpose !== "Service" && specify ? [[t.summarySpecify, specify]] : []),
              [t.summaryLocation, locationName],
              [t.summaryDate, <span key="d" dir="ltr">{formatDate(date)}</span>],
              ...(message.trim() ? [[t.summaryMessage, message]] : []),
              ...(transportActive && (transport === "pickup" || transport === "both")
                ? [[t.summaryPickup, `${pickup.address || "—"} → ${centre}`]]
                : []),
              ...(transportActive && (transport === "dropoff" || transport === "both")
                ? [[t.summaryDropoff, `${centre} → ${dropoff.address || "—"}`]]
                : []),
            ].map(([k, v], i) => (
              <div key={i} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="text-xs font-medium uppercase tracking-widest2 text-lepas-ash">{k}</dt>
                <dd className="text-lepas-ink">{v}</dd>
              </div>
            ))}
          </dl>

          <button type="button" onClick={() => setSuccessOpen(false)} className="btn-primary mt-6 w-full sm:w-auto">
            {t.close}
          </button>
        </div>
      </Dialog>
    </form>
  );
}
