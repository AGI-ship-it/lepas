"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";
import { NO_PREFERENCE, locationOptions } from "@/components/forms/locations";
import DatePicker from "@/components/forms/DatePicker";

// Hourly appointments 10:00–17:00, plus two broader windows as a fallback.
const TIME_SLOTS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const TIME_WINDOWS = ["10:00 - 12:00", "15:00 - 17:00"];

function toLocalIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// A window counts as past once its start time has passed.
function isPastSlot(date: string, slot: string, referenceTime: number): boolean {
  if (!date || !slot) return false;
  const start = slot.slice(0, 5);
  return new Date(`${date}T${start}:00`).getTime() <= referenceTime;
}

const carImages: Record<string, string> = {
  l8: "/design/assets/model-l8-side.webp",
  l6: "/design/assets/model-l6-side.webp",
  l4: "/design/assets/model-l4-side.webp",
};

const schema = z
  .object({
    model: z.string().min(1),
    showroom: z.string().min(1),
    date: z.string(),
    time: z.string(),
    title: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    notes: z.string().optional(),
    acceptTerms: z.boolean(),
    marketingConsent: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.acceptTerms) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["acceptTerms"], message: "Required" });
    }
    // Date and time are only needed when the visitor picks a location.
    if (data.showroom && data.showroom !== NO_PREFERENCE) {
      if (!data.date) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["date"], message: "Required" });
      if (!data.time) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["time"], message: "Required" });
    }
  });

type FormValues = z.infer<typeof schema>;

function SectionHeader({
  index,
  title,
  hint,
  active = true,
}: {
  index: number;
  title: string;
  hint?: string;
  active?: boolean;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
          active ? "bg-lepas-black text-white" : "bg-lepas-fog text-lepas-ash"
        }`}
      >
        {index}
      </span>
      <h3 className={`text-lg font-bold uppercase ${active ? "text-lepas-ink" : "text-lepas-ash"}`}>
        {title}
        <span className="text-lepas-amber"> *</span>
      </h3>
      {hint && <span className="text-xs text-lepas-ash">{hint}</span>}
    </div>
  );
}

function SelectChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-lepas-amber transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M1 1.5L6 6.5L11 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LightSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; description?: string; badge?: string; disabled?: boolean }[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="input-field-light flex w-full items-center justify-between bg-white text-start"
      >
        <span className={value ? "text-lepas-black" : "text-lepas-ash"}>
          {selected?.label || placeholder}
        </span>
        <SelectChevron open={open} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 top-full z-20 mt-1 border border-lepas-fog bg-white shadow-lg">
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                disabled={o.disabled}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-start text-sm transition-colors ${
                  o.disabled
                    ? "cursor-not-allowed text-lepas-ash"
                    : value === o.value
                    ? "bg-lepas-amber text-white"
                    : "text-lepas-black hover:bg-lepas-amber/15"
                }`}
              >
                <span>
                  <span className="block">{o.label}</span>
                  {o.description && (
                    <span className={`mt-0.5 block text-xs ${value === o.value && !o.disabled ? "text-white/80" : "text-lepas-ash"}`}>
                      {o.description}
                    </span>
                  )}
                </span>
                {o.badge && (
                  <span className="shrink-0 rounded-full bg-lepas-amber px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    {o.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SlotButton({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={onClick}
      className={`border px-2 py-3 text-sm tracking-[0.12em] transition-colors ${
        disabled
          ? "cursor-not-allowed border-lepas-fog bg-white text-lepas-mist line-through"
          : selected
          ? "border-lepas-amber bg-lepas-amber text-white"
          : "border-lepas-fog bg-lepas-sand/60 text-lepas-ink hover:border-lepas-amber"
      }`}
    >
      {label}
    </button>
  );
}

export function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-widest2 text-lepas-ash">
        {label}
        {required && " *"}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-lepas-error">{error}</p>}
    </div>
  );
}

export default function TestDriveForm() {
  const { locale, dict } = useLocale();
  const models = getModels(locale);
  const t = dict.testDriveFlow;
  const searchParams = useSearchParams();
  const initialModel = models.some((m) => m.slug === searchParams.get("model"))
    ? (searchParams.get("model") as string)
    : "";
  const [submitted, setSubmitted] = useState(false);

  // Live clock so today's already-passed slots disable while the form is open.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      model: initialModel,
      showroom: "",
      date: "",
      time: "",
      title: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
      acceptTerms: false,
      marketingConsent: false,
    },
  });

  const selectedModelSlug = watch("model");
  const selectedTime = watch("time");
  const selectedShowroom = watch("showroom");
  const selectedDate = watch("date");
  const selectedModel = models.find((m) => m.slug === selectedModelSlug);
  const unlocked = Boolean(selectedModel);
  const lockedClass = unlocked ? "" : "pointer-events-none select-none opacity-40";
  const notes = watch("notes") ?? "";
  const today = new Date(now);
  const minDate = toLocalIso(today);
  const maxDate = toLocalIso(new Date(today.getFullYear(), today.getMonth() + 3, today.getDate()));

  const noPreference = selectedShowroom === NO_PREFERENCE;
  const showroomOptions = locationOptions(locale, t.noPreference, t.comingSoon);
  const slotDisabled = (slot: string) => isPastSlot(selectedDate, slot, now);

  // Default to today's date. Set after mount so the statically exported page
  // doesn't carry its build date, and restore it whenever the date is cleared
  // (after submitting, or when switching back from "no preference").
  useEffect(() => {
    if (!selectedDate && !noPreference) setValue("date", toLocalIso(new Date()));
  }, [selectedDate, noPreference, setValue]);

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    reset({
      model: "",
      showroom: "",
      date: "",
      time: "",
      title: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
      acceptTerms: false,
      marketingConsent: false,
    });
  };

  if (submitted) {
    return (
      <div className="border border-lepas-fog bg-white p-10 text-center">
        <h3 className="text-2xl font-bold text-lepas-black">
          {locale === "ar" ? "تم طلب تجربة القيادة" : "Test Drive Requested"}
        </h3>
        <p className="mt-3 text-lepas-steel">
          {locale === "ar"
            ? "شكرًا لك. سيتواصل فريقنا معك قريبًا لتأكيد موعد تجربة القيادة."
            : "Thank you. Our team will contact you shortly to confirm your test drive appointment."}
        </p>
        <button onClick={() => setSubmitted(false)} className="btn-outline mt-6">
          {locale === "ar" ? "احجز مرة أخرى" : "Book Another"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 shadow-[0_20px_60px_-30px_rgba(10,10,10,0.25)] md:p-10" noValidate>
      <SectionHeader index={1} title={dict.testDrive.chooseYourMhero} />
      <div className="mb-6 flex items-center gap-3 border border-lepas-amber/40 bg-lepas-amber/5 px-4 py-3 text-xs text-lepas-steel">
        <span aria-hidden="true" className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-lepas-amber text-[10px] font-bold text-lepas-amber">
          i
        </span>
        {t.licenseNote}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden border border-lepas-fog bg-lepas-sand/60">
          {selectedModel ? (
            <>
              <span
                aria-hidden="true"
                className="heading-display pointer-events-none absolute inset-x-0 top-6 select-none text-center text-[clamp(72px,12vw,160px)] leading-none text-lepas-ink/[0.06]"
              >
                {selectedModel.slug.toUpperCase()}
              </span>
              <Image
                key={selectedModel.slug}
                src={carImages[selectedModel.slug]}
                alt={selectedModel.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain p-8 pt-16"
              />
            </>
          ) : (
            <p className="px-6 text-center text-sm text-lepas-ash">{t.selectModelToContinue}</p>
          )}
        </div>
        <div className="grid content-start grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          {models.map((m) => {
            const isActive = m.slug === selectedModelSlug;
            return (
              <button
                type="button"
                key={m.slug}
                aria-pressed={isActive}
                onClick={() => setValue("model", m.slug, { shouldValidate: true })}
                className={`group flex flex-col border text-start transition-colors ${
                  isActive ? "border-lepas-amber bg-lepas-amber/5" : "border-lepas-fog bg-lepas-sand/40 hover:border-lepas-ink/40"
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <span
                    aria-hidden="true"
                    className="heading-display pointer-events-none absolute inset-x-0 top-2 select-none text-center text-5xl leading-none text-lepas-ink/[0.07]"
                  >
                    {m.slug.toUpperCase()}
                  </span>
                  <Image src={carImages[m.slug]} alt="" fill sizes="200px" className="object-contain p-3 pt-6" />
                </div>
                <span className={`px-3 pb-3 text-xs font-semibold uppercase tracking-[0.15em] ${isActive ? "text-lepas-amber" : "text-lepas-ink"}`}>
                  {m.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {errors.model && <p className="mt-2 text-xs text-lepas-error">{t.selectModelToContinue}</p>}

      <div className={`mt-10 transition-opacity ${lockedClass}`} aria-disabled={!unlocked}>
        <SectionHeader
          index={2}
          title={dict.testDrive.whenAndWhere}
          active={unlocked}
          hint={unlocked ? undefined : t.selectModelToContinue}
        />
        <div className="space-y-5">
          <FormField label={dict.testDrive.preferredShowroom} required error={errors.showroom?.message}>
            <LightSelect
              value={selectedShowroom}
              onChange={(v) => {
                setValue("showroom", v, { shouldValidate: true });
                if (v === NO_PREFERENCE) {
                  setValue("date", "");
                  setValue("time", "");
                }
              }}
              placeholder={t.selectShowroom}
              options={showroomOptions}
            />
          </FormField>

          {noPreference ? (
            <p className="flex items-center gap-3 border border-lepas-amber/40 bg-lepas-amber/5 px-4 py-4 text-sm text-lepas-steel">
              <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-lepas-amber text-[11px] font-bold text-lepas-amber">
                i
              </span>
              {t.teamWillContact}
            </p>
          ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label={dict.forms.preferredDate} required error={errors.date?.message}>
              <DatePicker
                value={selectedDate}
                min={minDate}
                max={maxDate}
                locale={locale}
                placeholder={t.selectDate}
                todayLabel={t.today}
                closeLabel={t.close}
                invalid={Boolean(errors.date)}
                onChange={(iso) => {
                  setValue("date", iso, { shouldValidate: true });
                  if (selectedTime && isPastSlot(iso, selectedTime, Date.now())) {
                    setValue("time", "", { shouldValidate: true });
                  }
                }}
              />
              <p className="mt-1.5 text-xs text-lepas-ash">{t.bookableAhead}</p>
            </FormField>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-widest2 text-lepas-ash">
                {dict.forms.preferredTime} *
              </label>
              {!selectedShowroom ? (
                <p className="flex items-center gap-2 border border-lepas-amber/40 bg-lepas-amber/5 px-4 py-3 text-xs text-lepas-steel">
                  <span aria-hidden="true" className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-lepas-amber text-[10px] font-bold text-lepas-amber">
                    i
                  </span>
                  {t.selectShowroomForTimes}
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <SlotButton
                        key={slot}
                        label={slot}
                        selected={selectedTime === slot}
                        disabled={slotDisabled(slot)}
                        onClick={() => setValue("time", slot, { shouldValidate: true })}
                      />
                    ))}
                  </div>
                  {[...TIME_SLOTS, ...TIME_WINDOWS].every(slotDisabled) && (
                    <p className="mt-3 text-xs text-lepas-error">{t.noSlotsLeft}</p>
                  )}
                  <p className="mt-5 text-sm text-lepas-steel">{t.preferredWindow}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {TIME_WINDOWS.map((slot) => (
                      <SlotButton
                        key={slot}
                        label={slot}
                        selected={selectedTime === slot}
                        disabled={slotDisabled(slot)}
                        onClick={() => setValue("time", slot, { shouldValidate: true })}
                      />
                    ))}
                  </div>
                </>
              )}
              {errors.time && <p className="mt-1.5 text-xs text-lepas-error">{errors.time.message}</p>}
            </div>
          </div>
          )}
        </div>
      </div>

      <div className={`mt-10 transition-opacity ${lockedClass}`} aria-disabled={!unlocked}>
        <SectionHeader
          index={3}
          title={t.yourDetails}
          active={unlocked}
          hint={unlocked ? undefined : t.selectModelToContinue}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2 sm:max-w-xs">
            <FormField label={dict.forms.title} required error={errors.title?.message}>
              <LightSelect
                value={watch("title")}
                onChange={(v) => setValue("title", v, { shouldValidate: true })}
                placeholder="—"
                options={[
                  { value: "mr", label: dict.forms.titleMr },
                  { value: "mrs", label: dict.forms.titleMrs },
                  { value: "ms", label: dict.forms.titleMs },
                  { value: "dr", label: dict.forms.titleDr },
                ]}
              />
            </FormField>
          </div>
          <FormField label={dict.forms.firstName} required error={errors.firstName?.message}>
            <input className="input-field-light" placeholder={dict.forms.firstName} {...register("firstName")} />
          </FormField>
          <FormField label={dict.forms.lastName} required error={errors.lastName?.message}>
            <input className="input-field-light" placeholder={dict.forms.lastName} {...register("lastName")} />
          </FormField>
          <FormField label={dict.forms.emailAddress} required error={errors.email?.message}>
            <input className="input-field-light" type="email" placeholder={dict.forms.emailAddress} {...register("email")} />
          </FormField>
          <FormField label={dict.forms.phoneNumber}>
            <div className="phone-field-light">
              <span className="phone-prefix">
                🇦🇪 +971
              </span>
              <input className="phone-input" type="tel" placeholder="50 123 4567" {...register("phone")} />
            </div>
          </FormField>
          <div className="sm:col-span-2">
            <div className="mb-2 flex items-baseline justify-between">
              <label htmlFor="td-notes" className="text-xs font-medium uppercase tracking-widest2 text-lepas-ash">
                {dict.testDrive.additionalNotes} <span className="normal-case tracking-normal">({t.optional})</span>
              </label>
              <span className="text-xs text-lepas-ash">{notes.length}/2000</span>
            </div>
            <textarea
              id="td-notes"
              maxLength={2000}
              className="input-field-light min-h-[100px]"
              placeholder={dict.testDrive.additionalNotesPlaceholder}
              {...register("notes")}
            />
          </div>
        </div>
      </div>

      <div className={`mt-8 space-y-3 transition-opacity ${lockedClass}`}>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-lepas-steel">
          <input type="checkbox" className="checkbox-field-light mt-0.5" {...register("acceptTerms")} />
          <span>
            {dict.testDrive.acceptTermsPrefix}{" "}
            <Link href="/terms" className="link-underline font-semibold text-lepas-black">
              {dict.testDrive.termsAndConditions}
            </Link>{" "}
            *
          </span>
        </label>
        {errors.acceptTerms && <p className="text-xs text-lepas-error">{errors.acceptTerms.message}</p>}
        <label className="flex cursor-pointer items-start gap-3 text-sm text-lepas-steel">
          <input type="checkbox" className="checkbox-field-light mt-0.5" {...register("marketingConsent")} />
          <span>{dict.testDrive.marketingConsent}</span>
        </label>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-lepas-fog pt-6">
        <p className="max-w-sm text-xs text-lepas-ash">{dict.testDrive.submitNote}</p>
        <button type="submit" disabled={isSubmitting || !unlocked} className="btn-primary shrink-0 uppercase tracking-[0.15em]">
          {isSubmitting ? dict.forms.booking : dict.testDrive.confirmRequest}
        </button>
      </div>
    </form>
  );
}
