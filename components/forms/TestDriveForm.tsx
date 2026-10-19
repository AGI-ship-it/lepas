"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";
import { formatCurrency } from "@/lib/financeMath";

function buildTimeSlots(startMins: number, endMins: number): string[] {
  const slots: string[] = [];
  for (let mins = startMins; mins <= endMins; mins += 30) {
    const h = String(Math.floor(mins / 60)).padStart(2, "0");
    const m = String(mins % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
  }
  return slots;
}

// Operating hours: 9:00 AM – 7:00 PM, for both standard and Private Viewing bookings.
const OPEN_MINS = 9 * 60;
const CLOSE_MINS = 19 * 60;
const TIME_SLOTS = buildTimeSlots(OPEN_MINS, CLOSE_MINS);
// Private Viewing shares the same 9:00 AM–7:00 PM window; the 4-hour notice
// rule (applied below) is what actually restricts which of these are bookable.
const PRIVATE_VIEWING_TIME_SLOTS = TIME_SLOTS;

const SHOWROOM_OPTIONS = ["Lepas Deira Showroom", "Lepas Sharjah Showroom", "Private Viewing"] as const;
const PRIVATE_VIEWING_NOTICE_HOURS = 4;

/**
 * A Private Viewing slot is only bookable if it falls on/after
 * (referenceTime + noticeHours). `referenceTime` must be the *actual* moment
 * of the check — pass Date.now() at submit time and a live-ticking clock for
 * on-screen slot rendering — never a value captured once when the form loaded.
 */
function isSlotWithinNotice(
  date: string,
  time: string,
  noticeHours: number,
  referenceTime: number = Date.now()
): boolean {
  if (!date || !time) return false;
  const slot = new Date(`${date}T${time}:00`);
  const earliestAllowed = new Date(referenceTime + noticeHours * 60 * 60 * 1000);
  return slot < earliestAllowed;
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
    date: z.string().min(1),
    time: z.string().min(1),
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
    if (
      data.showroom === "Private Viewing" &&
      data.date &&
      data.time &&
      isSlotWithinNotice(data.date, data.time, PRIVATE_VIEWING_NOTICE_HOURS)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["time"],
        message: "Private Viewing requires a minimum of 4 hours' notice.",
      });
    }
  });

type FormValues = z.infer<typeof schema>;

function SectionHeader({ index, title }: { index: number; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3 border-b border-lepas-fog pb-4">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lepas-black text-xs font-bold text-white">
        {index}
      </span>
      <h3 className="text-sm font-semibold uppercase tracking-widest2 text-lepas-black">{title}</h3>
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
      className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
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
  options: { value: string; label: string }[];
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
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`block w-full px-4 py-3 text-start text-sm transition-colors ${
                  value === o.value
                    ? "bg-lepas-amber text-white"
                    : "text-lepas-black hover:bg-lepas-amber/15"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ShowroomSelect({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <LightSelect
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      options={SHOWROOM_OPTIONS.map((s) => ({ value: s, label: s }))}
    />
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
      {error && <p className="mt-1.5 text-xs text-lepas-mist">{error}</p>}
    </div>
  );
}

export default function TestDriveForm() {
  const { locale, dict } = useLocale();
  const models = getModels(locale);
  const [submitted, setSubmitted] = useState(false);

  // Live clock used only to keep the Private Viewing 4-hour notice window
  // accurate while the form sits open (e.g. left open for a couple of
  // hours). The definitive check still re-runs against the real submission
  // instant inside the zod schema when the form is actually submitted.
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
      model: models[0]?.slug ?? "",
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
  const selectedModel = models.find((m) => m.slug === selectedModelSlug) ?? models[0];

  const isPrivateViewing = selectedShowroom === "Private Viewing";
  const visibleTimeSlots = isPrivateViewing ? PRIVATE_VIEWING_TIME_SLOTS : TIME_SLOTS;
  const slotDisabled = (t: string) =>
    isPrivateViewing && isSlotWithinNotice(selectedDate, t, PRIVATE_VIEWING_NOTICE_HOURS, now);
  const hasValidSlotsForDate =
    !isPrivateViewing || !selectedDate || visibleTimeSlots.some((t) => !slotDisabled(t));

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    reset({
      model: models[0]?.slug ?? "",
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
    <form onSubmit={handleSubmit(onSubmit)} className="border border-lepas-fog bg-white p-8 md:p-10" noValidate>
      <SectionHeader index={1} title={dict.testDrive.chooseYourMhero} />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-lepas-fog/40 lg:aspect-auto">
          {selectedModel && (
            <Image
              key={selectedModel.slug}
              src={carImages[selectedModel.slug]}
              alt={selectedModel.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain p-6"
            />
          )}
        </div>
        <div className="flex flex-col gap-4">
          {models.map((m) => {
            const isActive = m.slug === selectedModelSlug;
            return (
              <button
                type="button"
                key={m.slug}
                onClick={() => setValue("model", m.slug)}
                className={`flex items-center gap-3 border p-3 text-start transition-colors ${
                  isActive ? "border-lepas-amber bg-lepas-amber/5" : "border-lepas-fog hover:border-lepas-black/40"
                }`}
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden bg-lepas-fog">
                  <Image src={carImages[m.slug]} alt={m.name} fill sizes="96px" className="object-contain p-1" />
                </div>
                <div>
                  <p className="text-sm font-bold text-lepas-black">{m.name}</p>
                  <p className="mt-1 text-xs text-lepas-steel">
                    {dict.common.startingFrom} {formatCurrency(m.startingPrice, m.currency)}
                  </p>
                  {isActive && (
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest2 text-lepas-black">
                      {locale === "ar" ? "محدد" : "Selected"}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10">
        <SectionHeader index={2} title={dict.testDrive.whenAndWhere} />
        <div className="space-y-5">
          <FormField label={dict.testDrive.preferredShowroom} required error={errors.showroom?.message}>
            <ShowroomSelect
              value={selectedShowroom}
              onChange={(v) => {
                setValue("showroom", v, { shouldValidate: true });
                if (
                  v === "Private Viewing" &&
                  selectedTime &&
                  (!PRIVATE_VIEWING_TIME_SLOTS.includes(selectedTime) ||
                    isSlotWithinNotice(selectedDate, selectedTime, PRIVATE_VIEWING_NOTICE_HOURS))
                ) {
                  setValue("time", "", { shouldValidate: true });
                }
              }}
              placeholder="—"
            />
            {selectedShowroom === "Private Viewing" && (
              <div className="mt-3 flex items-start gap-3 border border-lepas-amber bg-lepas-amber/25 px-4 py-3 text-sm text-lepas-black">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lepas-amber text-xs font-bold text-white"
                >
                  !
                </span>
                <p>
                  <span className="font-semibold">{locale === "ar" ? "إشعار: " : "Notice: "}</span>
                  {locale === "ar"
                    ? "تتطلب المعاينة الخاصة حدًا أدنى 4 ساعات من الإشعار المسبق."
                    : "Private Viewing requires a minimum of 4 hours' notice."}
                </p>
              </div>
            )}
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label={dict.forms.preferredDate} required error={errors.date?.message}>
              <input
                className="input-field-light"
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                {...register("date", {
                  onChange: (e) => {
                    if (
                      isPrivateViewing &&
                      selectedTime &&
                      isSlotWithinNotice(e.target.value, selectedTime, PRIVATE_VIEWING_NOTICE_HOURS)
                    ) {
                      setValue("time", "", { shouldValidate: true });
                    }
                  },
                })}
              />
            </FormField>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-widest2 text-lepas-ash">
                {dict.forms.preferredTime} *
              </label>
              {isPrivateViewing && selectedDate && !hasValidSlotsForDate ? (
                <p className="border border-lepas-fog bg-lepas-fog/30 px-3 py-3 text-xs text-lepas-steel">
                  {selectedDate === new Date(now).toISOString().slice(0, 10)
                    ? locale === "ar"
                      ? "لا تتوفر مواعيد معاينة خاصة اليوم. أقرب موعد متاح هو غدًا الساعة 9:00 صباحًا."
                      : "No private viewing times are available today. The next available time is tomorrow at 9:00 AM."
                    : locale === "ar"
                    ? "لا تتوفر مواعيد معاينة خاصة صالحة في هذا التاريخ. الرجاء اختيار تاريخ آخر."
                    : "No Private Viewing slots are available for this date. Please choose another date."}
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {visibleTimeSlots.map((t) => {
                    const disabled = slotDisabled(t);
                    return (
                      <button
                        type="button"
                        key={t}
                        disabled={disabled}
                        onClick={() => setValue("time", t, { shouldValidate: true })}
                        title={
                          disabled
                            ? locale === "ar"
                              ? "خارج نافذة الإشعار لمدة 4 ساعات"
                              : "Outside the 4-hour notice window"
                            : undefined
                        }
                        className={`border px-2 py-2 text-xs font-semibold transition-colors ${
                          disabled
                            ? "cursor-not-allowed border-lepas-fog text-lepas-fog line-through"
                            : selectedTime === t
                            ? "border-lepas-black bg-lepas-black text-white"
                            : "border-lepas-fog text-lepas-steel hover:border-lepas-black/40"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              )}
              {errors.time && <p className="mt-1.5 text-xs text-lepas-mist">{errors.time.message}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <SectionHeader index={3} title={dict.forms.personalInformation} />
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
            <input className="input-field-light" {...register("firstName")} />
          </FormField>
          <FormField label={dict.forms.lastName} required error={errors.lastName?.message}>
            <input className="input-field-light" {...register("lastName")} />
          </FormField>
          <FormField label={dict.forms.emailAddress} required error={errors.email?.message}>
            <input className="input-field-light" type="email" {...register("email")} />
          </FormField>
          <FormField label={dict.forms.phoneNumber}>
            <div className="flex">
              <span className="flex items-center border border-e-0 border-lepas-fog bg-lepas-fog/40 px-3 text-sm text-lepas-steel">
                🇦🇪 +971
              </span>
              <input className="input-field-light" type="tel" placeholder="50 123 4567" {...register("phone")} />
            </div>
          </FormField>
          <div className="sm:col-span-2">
            <FormField label={dict.testDrive.additionalNotes}>
              <textarea
                className="input-field-light min-h-[100px]"
                placeholder={dict.testDrive.additionalNotesPlaceholder}
                {...register("notes")}
              />
            </FormField>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
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
        {errors.acceptTerms && <p className="text-xs text-lepas-mist">{errors.acceptTerms.message}</p>}
        <label className="flex cursor-pointer items-start gap-3 text-sm text-lepas-steel">
          <input type="checkbox" className="checkbox-field-light mt-0.5" {...register("marketingConsent")} />
          <span>{dict.testDrive.marketingConsent}</span>
        </label>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-lepas-fog pt-6">
        <p className="max-w-sm text-xs text-lepas-ash">{dict.testDrive.submitNote}</p>
        <button type="submit" disabled={isSubmitting} className="btn-primary shrink-0">
          {isSubmitting ? dict.forms.booking : dict.testDrive.confirmRequest}
        </button>
      </div>
    </form>
  );
}
