"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiAlertTriangle, FiCheck, FiCheckCircle, FiChevronDown, FiInfo } from "react-icons/fi";
import { useLocale } from "@/components/i18n/LocaleProvider";
import SelectField from "@/components/forms/SelectField";
import DatePicker from "@/components/forms/DatePicker";
import BrandLoader from "@/components/ui/BrandLoader";
import ReCaptcha from "@/components/forms/ReCaptcha";
import { getModels } from "@/lib/i18n/data";
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
  isoFlag,
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
      <label htmlFor={id} className="mb-2 block text-sm font-semibold uppercase text-lepas-steel">
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

/** White card with an accordion header, as in the reference booking form. */
function Accordion({
  index,
  title,
  open,
  onToggle,
  children,
  locked,
  lockedNote,
}: {
  index: number;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  /** Greyed out and closed until earlier required sections are complete. */
  locked?: boolean;
  lockedNote?: string;
}) {
  const panelId = useId();
  const isOpen = open && !locked;
  return (
    <section className="border border-lepas-fog bg-white p-5 md:p-6" data-index={index}>
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-disabled={locked}
          onClick={() => !locked && onToggle()}
          className={`flex w-full items-center gap-3 border-b border-lepas-fog pb-3 text-start ${locked ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <span className={ROW_TITLE + " flex-1"}>{title}</span>
          <FiChevronDown
            aria-hidden="true"
            className={`h-5 w-5 text-lepas-amber transition-transform ${isOpen ? "" : "-rotate-90 rtl:rotate-90"}`}
          />
        </button>
      </h3>
      {locked && lockedNote && (
        <p className="mt-3 flex items-start gap-2 text-sm text-lepas-steel">
          <FiInfo aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-lepas-amber" />
          {lockedNote}
        </p>
      )}
      <div id={panelId} hidden={!isOpen} className="pt-6">
        {children}
      </div>
    </section>
  );
}

function Notice({ tone, title, children }: { tone: "info" | "warn" | "success"; title?: string; children: React.ReactNode }) {
  const styles = {
    info: "border-lepas-fog bg-lepas-sand/60 text-lepas-steel",
    warn: "border-lepas-amber/60 bg-lepas-amber/10 text-lepas-ink",
    success: "border-lepas-amber bg-white text-lepas-ink",
  }[tone];
  const Icon = tone === "success" ? FiCheckCircle : tone === "warn" ? FiAlertTriangle : FiInfo;
  return (
    <div role={tone === "info" ? undefined : "status"} className={`flex items-start gap-3 border p-4 text-sm ${styles}`}>
      <Icon aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 ${tone === "success" ? "text-lepas-success" : "text-lepas-amber"}`} />
      <div>
        {title && <p className="mb-1 text-xs font-bold uppercase tracking-widest2 text-lepas-black">{title}</p>}
        {children}
      </div>
    </div>
  );
}

/** Native radio buttons drawn as Lepas circles (amber dot when selected). */
function Radios<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | "";
  options: { value: T; label: string; disabled?: boolean }[];
  onChange: (v: T) => void;
}) {
  const name = useId();
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-x-7 gap-y-3">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <label
            key={o.value}
            className={`inline-flex items-center gap-2.5 text-sm text-lepas-ink ${o.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={on}
              disabled={o.disabled}
              onChange={() => onChange(o.value)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-lepas-amber peer-focus-visible:ring-offset-2 ${
                on ? "border-lepas-black" : "border-lepas-black/40"
              }`}
            >
              {on && <span className="h-2.5 w-2.5 rounded-full bg-lepas-amber" />}
            </span>
            {o.label}
          </label>
        );
      })}
    </div>
  );
}

/** Checkbox inside a white bordered box; the border turns amber once ticked. */
function CheckBox({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 border bg-white p-4 text-sm text-lepas-steel transition-colors ${
        checked ? "border-lepas-amber" : "border-lepas-fog"
      }`}
    >
      <input type="checkbox" className="checkbox-field-light mt-0.5" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{children}</span>
    </label>
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
            <span aria-hidden="true">{current.flag}</span> {current.iso} ({current.dial})
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
/** Closing the confirmation starts a fresh booking: the form remounts and scrolls back to the Yes / No question. */
export default function ServiceBookingForm() {
  const [run, setRun] = useState(0);
  const top = useRef<HTMLDivElement>(null);
  const restart = () => {
    setRun((n) => n + 1);
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  return (
    <div ref={top} className="scroll-mt-28">
      <BookingForm key={run} onDone={restart} />
    </div>
  );
}

function BookingForm({ onDone }: { onDone: () => void }) {
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
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [loadingPurpose, setLoadingPurpose] = useState(false);

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
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [reference, setReference] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  // Accordions
  const [openSection, setOpenSection] = useState({ personal: false, vehicle: false, appointment: false, pickup: true, dropoff: true });
  const toggle = (k: keyof typeof openSection) => setOpenSection((s) => ({ ...s, [k]: !s[k] }));

  /* derived */
  const location = BOOKING_CONFIG.locations.find((l) => l.id === locationId);
  // Collision damage and reported faults can't be collected by a driver, so transport is off for them.
  const collision = purpose === "Collision Damage" || purpose === "Report a Fault";
  const transportEnabled = Boolean(location && date && location.transportAvailable && !collision);
  const transportActive = transport !== "none" && transportEnabled;
  const showTransportDetails = transportActive && termsAck;
  const captchaValid = Boolean(recaptchaToken);
  const canSubmit = captchaValid && privacy && (!transportActive || termsAck);
  const showForm = customerType === "new" || (customerType === "existing" && verified);
  const isExisting = customerType === "existing" && verified;
  // New customers must complete the mandatory personal and vehicle fields before the appointment opens.
  const personalComplete = Boolean(
    personal.title &&
      personal.firstName.trim() &&
      personal.lastName.trim() &&
      !hasLetters(personal.phone) &&
      personal.phone.replace(/\D/g, "").length >= 7 &&
      /^\S+@\S+\.\S+$/.test(personal.email),
  );
  const vehicleComplete = Boolean(vehicle.country && vehicle.city && vehicle.prefix && vehicle.plate && vehicle.model);
  const appointmentLocked = !isExisting && !(personalComplete && vehicleComplete);
  // Move the customer along: finishing personal opens vehicle; finishing both opens the appointment.
  useEffect(() => {
    if (!isExisting && personalComplete) setOpenSection((s) => ({ ...s, vehicle: true }));
  }, [personalComplete, isExisting]);
  useEffect(() => {
    if (!appointmentLocked) setOpenSection((s) => ({ ...s, appointment: true }));
  }, [appointmentLocked]);
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
    setOpenSection((s) => ({ ...s, personal: true, vehicle: false, appointment: true }));
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
    // Loader while the purpose's options are "loaded" (simulates the round trip).
    setLoadingPurpose(true);
    window.setTimeout(() => setLoadingPurpose(false), 1200);
    setPurpose(p);
    // Service starts on the first interval; the customer can change it.
    setInterval(p === "Service" ? `${SERVICE_INTERVALS[0]} Kilometer Mileage Service` : "");
    setSpecify("");
    if (p === "Collision Damage" || p === "Report a Fault") {
      setTransport("none");
      resetTerms();
    }
    clearError("purpose", "interval", "specify");
  };
  const resetTerms = () => {
    setTermsChecked(false);
    setTermsAck(false);
    setTermsOpen(false);
  };
  const chooseLocation = (id: string) => {
    // Loader while the location's availability is "checked" (simulates the round trip).
    setCheckingLocation(true);
    window.setTimeout(() => setCheckingLocation(false), 1200);
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
  const cityName = (iso: string, en: string) => {
    const c = regCities(iso).find((x) => x.en === en);
    return c ? L(c) : en;
  };
  const locationName = location ? location.label[locale] : "—";
  const centre = BOOKING_CONFIG.serviceCentreAddress[locale];

  const closeSuccess = () => {
    setSuccessOpen(false);
    onDone();
  };

  const termsLabelId = useId();
  const successLabelId = useId();

  // Model buttons from the site's model data: models sold in several variants (L8 ICE / Super Hybrid) list each variant.
  const modelOptions = useMemo(() => {
    const en = getModels("en");
    const local = getModels(locale);
    return en.flatMap((m, i) =>
      m.variants.length > 1
        ? m.variants.map((v, j) => ({ value: `Lepas ${v.name}`, label: `Lepas ${local[i]?.variants[j]?.name ?? v.name}` }))
        : [{ value: m.name, label: local[i]?.name ?? m.name }],
    );
  }, [locale]);

  /* ------------------------------------------------------------ render */
  const labelCls = "mb-2 block text-sm font-semibold uppercase text-lepas-steel";
  const readOnlyCls = "input-field-light cursor-not-allowed truncate !bg-lepas-fog/50 text-lepas-steel";
  const isOther = purpose === "Collision Damage" || purpose === "Report a Fault";

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Existing customer? Question left, Yes / No right. */}
      <div className={`${ROW} flex flex-col gap-4 pt-0 sm:flex-row sm:items-center sm:justify-between`}>
        <p className={ROW_TITLE}>{t.existingQuestion}</p>
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
            <p className={`${ROW_TITLE} mb-4`}>
              {t.vehicle}
              <span aria-hidden="true" className="text-lepas-amber"> *</span>
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Field label={t.regCountry} required>
                <SelectField
                  value={lookup.country}
                  onChange={(v) => setLookup((l) => ({ ...l, country: v, city: "" }))}
                  placeholder={t.selectCountry}
                  options={REG_COUNTRIES.map((c) => ({ value: c.iso, label: `${isoFlag(c.iso)} ${L(c)}`, selectedLabel: `${isoFlag(c.iso)} ${c.iso}` }))}
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
            <label htmlFor="lookupPhone" className={ROW_TITLE}>
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

      {showForm && (
        <div className="mt-8 flex flex-col gap-4">
          {saudiRedirect && customerType === "new" && <Notice tone="warn">{t.saudiRedirect}</Notice>}

          {!isExisting && (
            <Accordion index={1} title={t.personal} open={openSection.personal} onToggle={() => toggle("personal")}>
              {/* Title | First name | Last name */}
              <div className="grid gap-5 md:grid-cols-[150px_1fr_1fr]">
                <Field id="title" label={t.title} required error={errors.title}>
                  <SelectField
                    value={personal.title}
                    onChange={(v) => {
                      setPersonal((p) => ({ ...p, title: v }));
                      clearError("title");
                    }}
                    placeholder={t.selectPlaceholder}
                    options={TITLES.map((v) => ({ value: v, label: t.titles[v] }))}
                  />
                </Field>
                <Field id="firstName" label={t.firstName} required error={errors.firstName}>
                  <input
                    id="firstName"
                    className="input-field-light"
                    placeholder={t.firstNamePlaceholder}
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
                    placeholder={t.lastNamePlaceholder}
                    value={personal.lastName}
                    onChange={(e) => {
                      setPersonal((p) => ({ ...p, lastName: e.target.value }));
                      clearError("lastName");
                    }}
                  />
                </Field>
              </div>
              {/* Phone (code + number) | Email */}
              <div className="mt-5 grid gap-5 md:grid-cols-2">
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
                    placeholder={t.phonePlaceholder}
                    invalid={Boolean(errors.phone) || hasLetters(personal.phone)}
                  />
                </Field>
                <Field id="email" label={t.email} required error={errors.email}>
                  <input
                    id="email"
                    type="email"
                    dir="ltr"
                    className="input-field-light"
                    placeholder="name@example.com"
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
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Field id="vCountry" label={t.regCountry} required error={errors.vCountry}>
                  <SelectField
                    value={vehicle.country}
                    onChange={(v) => setVehicle((x) => ({ ...x, country: v, city: "" }))}
                    placeholder={t.selectCountry}
                    options={REG_COUNTRIES.map((c) => ({ value: c.iso, label: `${isoFlag(c.iso)} ${L(c)}`, selectedLabel: `${isoFlag(c.iso)} ${c.iso}` }))}
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
              </div>
              <div className="mt-6">
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
              <div className="mt-6">
                <Field id="vModel" label={t.model} required error={errors.vModel}>
                  <Options
                    label={t.model}
                    value={vehicle.model}
                    fadeOthers
                    options={modelOptions}
                    onChange={(v) => {
                      setVehicle((x) => ({ ...x, model: v }));
                      clearError("vModel");
                    }}
                  />
                </Field>
              </div>
            </Accordion>
          )}

          <Accordion
            index={isExisting ? 1 : 3}
            title={t.appointment}
            open={openSection.appointment}
            onToggle={() => toggle("appointment")}
          >
            {/* Open but disabled until personal and vehicle details are complete. */}
            {appointmentLocked && (
              <p className="mb-5 flex items-start gap-2 text-sm text-lepas-steel">
                <FiInfo aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-lepas-amber" />
                {t.appointmentLocked}
              </p>
            )}
            <fieldset disabled={appointmentLocked} className={`min-w-0 ${appointmentLocked ? "pointer-events-none opacity-50" : ""}`}>
            {/* Purpose | Service interval | Please specify */}
            <div className="grid gap-5 lg:grid-cols-3">
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
                  !isOther && (
                    <p className="mt-1.5 flex items-start gap-1.5 text-xs text-lepas-steel">
                      <FiInfo aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lepas-amber" />
                      {isExisting && purpose === "Service"
                        ? fill(t.previousService, { record: L(MOCK_CUSTOMER.previousService) })
                        : t.noPreviousService}
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
              <Field id="specify" label={t.specify} required={isOther} error={errors.specify}>
                <input
                  id="specify"
                  disabled={!isOther}
                  className="input-field-light disabled:cursor-not-allowed disabled:opacity-40"
                  placeholder={t.specifyPlaceholder}
                  value={specify}
                  onChange={(e) => {
                    setSpecify(e.target.value);
                    clearError("specify");
                  }}
                />
              </Field>
            </div>

            {/* Location | Date */}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
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
            </div>

            {locationId && (
              <div className="mt-5">
                <Notice tone="warn" title={t.important}>
                  {t.arrivalBefore}
                  <strong className="font-semibold text-lepas-black">{t.arrivalTime}</strong>
                  {t.arrivalAfter}
                </Notice>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-3">
              <span className="text-sm font-semibold uppercase text-lepas-steel">{t.wait}</span>
              <Radios
                label={t.wait}
                value={wait}
                options={[
                  { value: "yes", label: t.yes },
                  { value: "no", label: t.no },
                ]}
                onChange={setWait}
              />
            </div>

            <div className="mt-6">
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
            </fieldset>
          </Accordion>

          {/* Pickup / drop-off */}
          <section className="pt-4">
            <h3 className={`${ROW_TITLE} border-b border-lepas-fog pb-3`}>{t.transportTitle}</h3>
            <div className="mt-4 flex flex-col gap-4">
              {collision ? (
                <Notice tone="warn" title={t.important}>
                  {t.transportCollision}
                </Notice>
              ) : location && !location.transportAvailable ? (
                <Notice tone="warn" title={t.important}>
                  {t.transportUnavailable}
                </Notice>
              ) : (
                !transportEnabled && <Notice tone="info">{t.transportHint}</Notice>
              )}
              <Radios
                label={t.transportTitle}
                value={transport}
                options={TRANSPORT_OPTIONS.map((o) => ({ value: o, label: t.transport[o], disabled: o !== "none" && !transportEnabled }))}
                onChange={chooseTransport}
              />
              {transportActive && (
                <div data-field="terms">
                  <CheckBox checked={termsChecked} onChange={onTermsCheckbox}>
                    {t.termsAckPrefix}{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setTermsOpen(true);
                      }}
                      className="font-semibold text-lepas-ink underline decoration-lepas-amber decoration-2 underline-offset-4"
                    >
                      {t.termsLink}
                    </button>
                    {t.termsAckSuffix}{" "}
                    <strong className="font-semibold text-lepas-black">{fill(t.termsAckFee, { fee: BOOKING_CONFIG.cancellationFee })}</strong>{" "}
                    {t.termsAckEnd}
                  </CheckBox>
                </div>
              )}
              {showTransportDetails && charge > 0 && location && (
                <Notice tone="warn" title={t.chargeTitle}>
                  {fill(transport === "pickup" ? t.chargePickup : transport === "dropoff" ? t.chargeDropoff : t.chargeBoth, {
                    pickup: location.pickupCharge,
                    dropoff: location.dropoffCharge,
                    total: charge,
                    location: location.label[locale],
                  })}
                </Notice>
              )}
            </div>
          </section>

          {showTransportDetails && (transport === "pickup" || transport === "both") && (
            <Accordion index={isExisting ? 2 : 4} title={t.pickupDetails} open={openSection.pickup} onToggle={() => toggle("pickup")}>
              <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                <div className="flex min-w-0 flex-col gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="pickupAddress" label={t.pickupAddress} required error={errors.pickupAddress}>
                      <input
                        id="pickupAddress"
                        className="input-field-light"
                        placeholder={t.pickupAddressPlaceholder}
                        value={pickup.address}
                        onChange={(e) => {
                          const v = e.target.value;
                          setPickup((p) => ({ ...p, address: v }));
                          if (transport === "both") setDropoff((d) => ({ ...d, address: v }));
                          clearError("pickupAddress");
                        }}
                      />
                    </Field>
                    <Field label={t.dropoffAddress}>
                      <input className={readOnlyCls} readOnly value={centre} title={centre} />
                    </Field>
                  </div>
                  <Notice tone="info">{t.pickupInfo}</Notice>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={t.pickupDate}>
                      <input className={readOnlyCls} readOnly dir="ltr" value={formatDate(date)} />
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
                  </div>
                  <Field id="pickupInstructions" label={t.instructions}>
                    <input
                      id="pickupInstructions"
                      className="input-field-light"
                      placeholder={t.instructionsPlaceholder}
                      value={pickup.instructions}
                      onChange={(e) => setPickup((p) => ({ ...p, instructions: e.target.value }))}
                    />
                  </Field>
                </div>
                <iframe src={BOOKING_CONFIG.serviceCentreMap} title={centre} loading="lazy" className="h-52 w-full border-0 lg:h-full lg:min-h-[300px]" />
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
                <div className="flex min-w-0 flex-col gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={t.pickupAddress}>
                      <input className={readOnlyCls} readOnly value={centre} title={centre} />
                    </Field>
                    <Field id="dropoffAddress" label={t.dropoffAddress} required error={errors.dropoffAddress}>
                      <input
                        id="dropoffAddress"
                        className="input-field-light"
                        placeholder={t.dropoffAddressPlaceholder}
                        value={dropoff.address}
                        onChange={(e) => {
                          setDropoff((d) => ({ ...d, address: e.target.value }));
                          clearError("dropoffAddress");
                        }}
                      />
                    </Field>
                  </div>
                  <Notice tone="info">{t.dropoffInfo}</Notice>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={t.dropoffDate}>
                      <input className={readOnlyCls} readOnly dir="ltr" value={formatDate(date)} />
                    </Field>
                  </div>
                  <Field id="dropoffInstructions" label={t.instructions}>
                    <input
                      id="dropoffInstructions"
                      className="input-field-light"
                      placeholder={t.instructionsPlaceholder}
                      value={dropoff.instructions}
                      onChange={(e) => setDropoff((d) => ({ ...d, instructions: e.target.value }))}
                    />
                  </Field>
                </div>
                <iframe src={BOOKING_CONFIG.serviceCentreMap} title={centre} loading="lazy" className="h-52 w-full border-0 lg:h-full lg:min-h-[300px]" />
              </div>
            </Accordion>
          )}

          {/* Privacy */}
          <CheckBox checked={privacy} onChange={setPrivacy}>
            {t.privacyPrefix}{" "}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-lepas-ink underline decoration-lepas-amber decoration-2 underline-offset-4"
            >
              {t.privacyLink}
            </a>
          </CheckBox>

          {/* Verification: Google reCAPTCHA, with Submit beside it */}
          <div className="pt-2">
            <p className={labelCls}>
              {t.verification}
              <span aria-hidden="true" className="text-lepas-amber"> *</span>
              <span className="sr-only"> (required)</span>
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <ReCaptcha locale={locale} onChange={setRecaptchaToken} />
              <button type="submit" disabled={!canSubmit || submitting} className="btn-primary h-[46px]">
                {t.submit}
              </button>
            </div>
            {Object.keys(errors).length > 0 && (
              <p role="alert" className="mt-2 text-sm font-medium text-lepas-error">
                {t.fixErrors}
              </p>
            )}
          </div>
        </div>
      )}

      {searching && <BrandLoader label={t.searching} />}
      {submitting && <BrandLoader label={t.submitting} />}
      {checkingLocation && <BrandLoader label={t.checkingLocation} />}
      {loadingPurpose && <BrandLoader label={t.loadingPurpose} />}

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
          <div className="mt-8 grid grid-cols-2 gap-3">
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
      <Dialog open={successOpen} labelId={successLabelId} onEscape={closeSuccess}>
        <div className="p-6 md:p-8">
          <div className="flex items-start gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-lepas-success text-white">
              <FiCheck aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id={successLabelId} className="text-2xl font-bold text-lepas-black">
                {t.successTitle}
              </h2>
              <p className="mt-1 text-base text-lepas-steel">{t.successBody}</p>
              <p className="mt-3 text-sm text-lepas-steel">{t.successSent}</p>
              <p className="mt-3 inline-flex border border-lepas-amber bg-lepas-amber/10 px-4 py-2.5 text-sm font-semibold text-lepas-black">
                {t.reference}:&nbsp;
                <span dir="ltr" className="tracking-wider">
                  {reference}
                </span>
              </p>
            </div>
          </div>

          <p className="mt-8 text-sm font-bold uppercase tracking-widest2 text-lepas-black">{t.summaryTitle}</p>
          {(() => {
            const Item = ({ k, v, full }: { k: string; v: React.ReactNode; full?: boolean }) => (
              <div className={`flex gap-4 py-2.5 text-base ${full ? "sm:col-span-2" : ""}`}>
                <dt className="w-28 shrink-0 text-lepas-steel">{k}</dt>
                <dd className="min-w-0 break-words text-lepas-ink">{v}</dd>
              </div>
            );
            const group = "grid border-b border-lepas-fog py-3 last:border-b-0 sm:grid-cols-2 sm:gap-x-6";
            return (
              <div className="mt-3">
                <dl className={group}>
                  <Item
                    full
                    k={t.summaryName}
                    v={[personal.title && t.titles[personal.title as keyof typeof t.titles], personal.firstName, personal.lastName].filter(Boolean).join(" ") || "—"}
                  />
                  <Item k={t.summaryPhone} v={<span dir="ltr">{`${phoneCountry.flag} ${phoneCountry.dial} ${shownPhone}`}</span>} />
                  <Item k={t.summaryEmail} v={<span dir="ltr">{shownEmail || "—"}</span>} />
                </dl>
                <dl className={group}>
                  <Item k={t.summaryRegistration} v={`${vehicle.country} · ${cityName(vehicle.country, vehicle.city)}`} />
                  <Item k={t.summaryPlate} v={<span dir="ltr">{`${vehicle.prefix} ${shownPlate}`.trim() || "—"}</span>} />
                </dl>
                <dl className={group}>
                  <Item k={t.summaryPurpose} v={purpose ? t.purposes[purpose] : "—"} />
                  {purpose === "Service" && interval ? (
                    <Item k={t.summaryInterval} v={fill(t.km, { n: parseInt(interval, 10).toLocaleString(locale === "ar" ? "ar-AE" : "en-US") })} />
                  ) : isOther && specify ? (
                    <Item k={t.summarySpecify} v={specify} />
                  ) : (
                    <div className="hidden sm:block" />
                  )}
                  <Item full k={t.summaryLocation} v={locationName} />
                  <Item full k={t.summaryDate} v={<span dir="ltr">{formatDate(date)}</span>} />
                  {message.trim() && <Item full k={t.summaryMessage} v={message} />}
                </dl>
                {transportActive && (transport === "pickup" || transport === "both") && (
                  <dl className={group}>
                    <Item k={t.summaryTransport} v={t.transport.pickup} />
                    <Item k={t.summaryAddress} v={`${pickup.address || "—"} → ${centre}`} />
                  </dl>
                )}
                {transportActive && (transport === "dropoff" || transport === "both") && (
                  <dl className={group}>
                    <Item k={t.summaryTransport} v={t.transport.dropoff} />
                    <Item k={t.summaryAddress} v={`${centre} → ${dropoff.address || "—"}`} />
                  </dl>
                )}
              </div>
            );
          })()}

          <button type="button" onClick={closeSuccess} className="btn-primary mt-6 w-full">
            {t.close}
          </button>
        </div>
      </Dialog>
    </form>
  );
}
