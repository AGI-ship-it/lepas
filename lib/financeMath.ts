export interface LoanInput {
  vehiclePrice: number;
  downPayment: number;
  annualInterestRate: number;
  durationMonths: number;
}

export interface LoanResult {
  loanAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayable: number;
}

export function calculateLoan({
  vehiclePrice,
  downPayment,
  annualInterestRate,
  durationMonths,
}: LoanInput): LoanResult {
  const loanAmount = Math.max(vehiclePrice - downPayment, 0);
  const monthlyRate = annualInterestRate / 100 / 12;

  let monthlyPayment: number;
  if (loanAmount <= 0 || durationMonths <= 0) {
    monthlyPayment = 0;
  } else if (monthlyRate === 0) {
    monthlyPayment = loanAmount / durationMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, durationMonths);
    monthlyPayment = (loanAmount * monthlyRate * factor) / (factor - 1);
  }

  const totalPayable = monthlyPayment * durationMonths;
  const totalInterest = Math.max(totalPayable - loanAmount, 0);

  return {
    loanAmount,
    monthlyPayment,
    totalInterest,
    totalPayable: totalPayable + downPayment,
  };
}

export function formatCurrency(value: number, currency = "AED"): string {
  return `${currency} ${Math.round(value).toLocaleString("en-US")}`;
}
