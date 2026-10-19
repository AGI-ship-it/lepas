interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  labelOn?: string;
  labelOff?: string;
  ariaLabel: string;
}

export default function Toggle({
  value,
  onChange,
  labelOn = "Yes",
  labelOff = "No",
  ariaLabel,
}: ToggleProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-white/15 bg-lepas-black p-1 text-sm font-semibold">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={ariaLabel}
        onClick={() => onChange(true)}
        className={`rounded-full px-5 py-2 transition-colors duration-300 ${
          value ? "bg-lepas-amber text-white" : "text-white/50 hover:text-white"
        }`}
      >
        {labelOn}
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={!value}
        aria-label={ariaLabel}
        onClick={() => onChange(false)}
        className={`rounded-full px-5 py-2 transition-colors duration-300 ${
          !value ? "bg-lepas-amber text-white" : "text-white/50 hover:text-white"
        }`}
      >
        {labelOff}
      </button>
    </div>
  );
}
