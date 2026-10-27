"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";

const LOCATIONS = [
  { value: "deira", en: "Lepas Deira Showroom — Port Saeed, Dubai", ar: "صالة عرض ليباس ديرة — بورسعيد، دبي" },
  { value: "sharjah", en: "Lepas Sharjah Showroom — Al Ruqa Al Hamra", ar: "صالة عرض ليباس الشارقة — الرقة الحمراء" },
  { value: "al-quoz", en: "Lepas Al Quoz After-Sales Facility", ar: "مركز ليباس لخدمات ما بعد البيع — القوز" },
];

const schema = z.object({
  title: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  model: z.string().min(1),
  location: z.string().min(1),
  message: z.string().min(10),
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

function Field({
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

export default function ContactForm() {
  const { locale, dict } = useLocale();
  const models = getModels(locale);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className="border border-lepas-fog bg-white p-10 text-center">
        <h3 className="text-2xl font-bold text-lepas-black">{dict.forms.messageSent}</h3>
        <p className="mt-3 text-lepas-steel">{dict.forms.messageSentThankYou}</p>
        <button onClick={() => setSubmitted(false)} className="btn-outline mt-6">
          {dict.forms.sendAnotherMessage}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border border-lepas-fog bg-white p-8 md:p-10" noValidate>
      <h3 className="text-xl font-bold text-lepas-black">{dict.contact.sendMessage}</h3>
      <p className="mt-2 text-sm text-lepas-steel">{dict.contact.sendMessageDescription}</p>

      <div className="mt-8">
        <SectionHeader index={1} title={dict.contact.yourDetails} />
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2 sm:max-w-xs">
            <Field label={dict.forms.title} required error={errors.title?.message}>
              <select className="input-field-light" {...register("title")}>
                <option value="">—</option>
                <option value="mr">{dict.forms.titleMr}</option>
                <option value="mrs">{dict.forms.titleMrs}</option>
                <option value="ms">{dict.forms.titleMs}</option>
                <option value="dr">{dict.forms.titleDr}</option>
              </select>
            </Field>
          </div>
          <Field label={dict.forms.firstName} required error={errors.firstName?.message}>
            <input className="input-field-light" placeholder={dict.forms.firstName} {...register("firstName")} />
          </Field>
          <Field label={dict.forms.lastName} required error={errors.lastName?.message}>
            <input className="input-field-light" placeholder={dict.forms.lastName} {...register("lastName")} />
          </Field>
          <Field label={dict.forms.emailAddress} required error={errors.email?.message}>
            <input className="input-field-light" type="email" placeholder={dict.forms.emailAddress} {...register("email")} />
          </Field>
          <Field label={dict.forms.phoneNumber}>
            <div className="phone-field-light">
              <span className="phone-prefix">
                🇦🇪 +971
              </span>
              <input className="phone-input" type="tel" placeholder="50 123 4567" {...register("phone")} />
            </div>
          </Field>
        </div>
      </div>

      <div className="mt-10">
        <SectionHeader index={2} title={dict.contact.enquiryDetails} />
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={dict.contact.selectModel} required error={errors.model?.message}>
              <select className="input-field-light" {...register("model")}>
                <option value="">{dict.contact.selectModel}</option>
                {models.map((m) => (
                  <option key={m.slug} value={m.slug}>
                    {m.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={dict.forms.location} required error={errors.location?.message}>
              <select className="input-field-light" {...register("location")}>
                <option value="">{dict.forms.selectLocation}</option>
                {LOCATIONS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {locale === "ar" ? l.ar : l.en}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label={dict.forms.message} required error={errors.message?.message}>
            <textarea
              className="input-field-light min-h-[120px]"
              placeholder={
                locale === "ar" ? "شاركنا بعض التفاصيل وسيتواصل معك فريقنا." : "Share a few details and our team will get back to you."
              }
              {...register("message")}
            />
          </Field>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-lepas-fog pt-6">
        <p className="max-w-sm text-xs text-lepas-ash">{dict.contact.responseNote}</p>
        <button type="submit" disabled={isSubmitting} className="btn-primary shrink-0">
          {isSubmitting ? dict.forms.sending : dict.forms.sendMessage}
        </button>
      </div>
    </form>
  );
}
