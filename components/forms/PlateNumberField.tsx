"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import SelectField from "@/components/forms/SelectField";

const EMIRATES = [
  { value: "dubai", en: "Dubai", ar: "دبي" },
  { value: "abu-dhabi", en: "Abu Dhabi", ar: "أبوظبي" },
  { value: "sharjah", en: "Sharjah", ar: "الشارقة" },
  { value: "ajman", en: "Ajman", ar: "عجمان" },
  { value: "ras-al-khaimah", en: "Ras Al Khaimah", ar: "رأس الخيمة" },
  { value: "fujairah", en: "Fujairah", ar: "الفجيرة" },
  { value: "umm-al-quwain", en: "Umm Al Quwain", ar: "أم القيوين" },
];

function Field({
  label,
  error,
  light,
  children,
}: {
  label: string;
  error?: string;
  light?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className={`mb-2 block text-xs font-medium uppercase tracking-widest2 ${
          light ? "text-lepas-ash" : "text-white/70"
        }`}
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-white">{error}</p>}
    </div>
  );
}

function maskPlateNumber(n: string): string {
  return n.length <= 1 ? n : `${n[0]}${"X".repeat(n.length - 1)}`;
}

export default function PlateNumberField({
  emirate,
  onEmirateChange,
  code,
  onCodeChange,
  number,
  onNumberChange,
  emirateError,
  codeError,
  numberError,
  light,
  maskNumber,
}: {
  emirate: string;
  onEmirateChange: (v: string) => void;
  code: string;
  onCodeChange: (v: string) => void;
  number: string;
  onNumberChange: (v: string) => void;
  emirateError?: string;
  codeError?: string;
  numberError?: string;
  light?: boolean;
  maskNumber?: boolean;
}) {
  const { locale, dict } = useLocale();
  const selectedEmirate = EMIRATES.find((e) => e.value === emirate);
  const inputClass = light ? "input-field-light" : "input-field";
  const displayNumber = maskNumber ? maskPlateNumber(number) : number;

  return (
    <div className="grid gap-5 sm:grid-cols-[1fr_1fr_1fr_auto]">
      <Field label={dict.forms.emirate} error={emirateError} light={light}>
        <SelectField
          value={emirate}
          onChange={onEmirateChange}
          light={!!light}
          placeholder={dict.forms.selectEmirate}
          options={EMIRATES.map((e) => ({ value: e.value, label: locale === "ar" ? e.ar : e.en }))}
        />
      </Field>

      <Field label={dict.forms.plateCode} error={codeError} light={light}>
        <input
          className={`${inputClass} text-center uppercase`}
          maxLength={2}
          placeholder="A"
          value={code}
          onChange={(e) => onCodeChange(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
        />
      </Field>

      <Field label={dict.forms.plateNumber} error={numberError} light={light}>
        <input
          className={maskNumber ? `${inputClass} cursor-not-allowed bg-lepas-fog/20 text-lepas-steel` : inputClass}
          inputMode="numeric"
          maxLength={5}
          placeholder={dict.forms.plateDigitsHint}
          value={displayNumber}
          readOnly={maskNumber}
          onChange={maskNumber ? undefined : (e) => onNumberChange(e.target.value.replace(/[^0-9]/g, ""))}
        />
      </Field>

      <div>
        <p
          className={`mb-2 block text-xs font-medium uppercase tracking-widest2 ${
            light ? "text-lepas-ash" : "text-white/70"
          }`}
        >
          {dict.forms.platePreview}
        </p>
        <div className="flex h-[46px] w-40 items-stretch overflow-hidden border border-lepas-black bg-white text-lepas-black">
          <div className="flex w-8 shrink-0 flex-col items-center justify-center gap-0.5 border-e border-lepas-fog bg-lepas-fog/60 px-1 text-center text-[8px] font-bold leading-tight">
            <span>UAE</span>
            <span>{selectedEmirate ? (locale === "ar" ? selectedEmirate.ar : selectedEmirate.en) : "—"}</span>
          </div>
          <div className="flex flex-1 items-center justify-center px-2 text-sm font-bold tracking-wide">
            {code || "•"}
          </div>
          <div className="flex flex-[1.4] items-center justify-center px-2 text-base font-extrabold tracking-widest">
            {displayNumber || "•••••"}
          </div>
          <div className="w-2 shrink-0 bg-lepas-mist" />
        </div>
      </div>
    </div>
  );
}
