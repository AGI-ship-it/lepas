"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FormField } from "@/components/forms/TestDriveForm";
import { useLocale } from "@/components/i18n/LocaleProvider";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function EnquiryForm({ subject }: { subject: string }) {
  const { locale, dict } = useLocale();
  const [open, setOpen] = useState(false);
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

  const close = () => {
    setOpen(false);
    setSubmitted(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-outline-light w-full">
        {dict.common.enquireNow}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Enquire about ${subject}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-lepas-ink p-8 text-white"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">
                  {locale === "ar" ? `استفسار — ${subject}` : `Enquire — ${subject}`}
                </h3>
                <button onClick={close} aria-label="Close" className="text-white/50 hover:text-white">
                  ✕
                </button>
              </div>

              {submitted ? (
                <div className="mt-6 text-center">
                  <p className="text-white/70">{dict.forms.submittedThankYou}</p>
                  <button onClick={close} className="btn-primary mt-6 w-full">
                    {dict.nav.close}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
                  <FormField label={dict.forms.fullName} error={errors.fullName?.message}>
                    <input className="input-field" placeholder={dict.forms.fullName} {...register("fullName")} />
                  </FormField>
                  <FormField label={dict.forms.phoneNumber} error={errors.phone?.message}>
                    <input className="input-field" type="tel" placeholder="50 123 4567" {...register("phone")} />
                  </FormField>
                  <FormField label={dict.forms.email} error={errors.email?.message}>
                    <input className="input-field" type="email" placeholder={dict.forms.email} {...register("email")} />
                  </FormField>
                  <FormField label={`${dict.forms.message} (${locale === "ar" ? "اختياري" : "optional"})`}>
                    <textarea className="input-field" rows={3} placeholder={dict.forms.message} {...register("message")} />
                  </FormField>
                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                    {isSubmitting ? dict.forms.sending : dict.common.enquireNow}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
