"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  dealership: z.string().min(1, "Required"),
  model: z.string().min(1, "Required"),
  agreePrivacy: z.literal(true, { errorMap: () => ({ message: "Required" }) }),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-widest2 text-white/60">
        {label} *
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-lepas-amber">{error}</p>}
    </div>
  );
}

export default function CallbackForm({ defaultModel = "" }: { defaultModel?: string }) {
  const { locale, dict } = useLocale();
  const t = dict.lepasUi;
  const models = getModels(locale);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { model: defaultModel } });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className="border border-white/10 p-10 text-center">
        <p className="text-white/80">{t.callbackThanks}</p>
        <button onClick={() => setSubmitted(false)} className="btn-outline-light mt-6">
          {t.requestCallback}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2" noValidate>
      <Field label={dict.forms.firstName} error={errors.firstName?.message}>
        <input className="input-field" autoComplete="given-name" {...register("firstName")} />
      </Field>
      <Field label={dict.forms.lastName} error={errors.lastName?.message}>
        <input className="input-field" autoComplete="family-name" {...register("lastName")} />
      </Field>
      <Field label={dict.forms.emailAddress} error={errors.email?.message}>
        <input className="input-field" type="email" autoComplete="email" {...register("email")} />
      </Field>
      <Field label={dict.forms.phoneNumber} error={errors.phone?.message}>
        <div className="phone-field">
          <span className="phone-prefix">
            🇦🇪 +971
          </span>
          <input className="phone-input" type="tel" autoComplete="tel-national" {...register("phone")} />
        </div>
      </Field>
      <Field label={t.dealership} error={errors.dealership?.message}>
        <select className="input-field" {...register("dealership")}>
          <option value="">{t.chooseDealership}</option>
          {t.dealerships.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t.model} error={errors.model?.message}>
        <select className="input-field" {...register("model")}>
          <option value="">{t.chooseModel}</option>
          {models.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.name}
            </option>
          ))}
        </select>
      </Field>

      <div aria-hidden="true" className="hidden">
        <label>
          Leave this field empty
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-white/70 sm:col-span-2">
        <input type="checkbox" className="checkbox-field mt-0.5" {...register("agreePrivacy")} />
        <span>
          {t.privacyConsentPrefix}{" "}
          <Link href="/privacy-policy" className="link-underline font-semibold text-white">
            {dict.forms.privacyPolicy}
          </Link>{" "}
          {t.privacyConsentSuffix} *
        </span>
      </label>
      {errors.agreePrivacy && (
        <p className="-mt-3 text-xs text-lepas-amber sm:col-span-2">{errors.agreePrivacy.message}</p>
      )}

      <div className="sm:col-span-2">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? dict.forms.sending : t.submit}
        </button>
      </div>
    </form>
  );
}
