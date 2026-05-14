export interface TenorRow {
  id: string
  year: number
  rate: number // annual rate in percent
}

export interface AmortizationRow {
  month: number
  rate: number
  interestPayment: number
  principalPayment: number
  totalPayment: number
  remainingPrincipal: number
}

function calcAnnuity(
  principal: number,
  monthlyRate: number,
  months: number,
): number {
  if (monthlyRate === 0) {
    return principal / months;
  }

  const factor = (1 + monthlyRate) ** months;

  return Math.ceil(principal * monthlyRate * factor / (factor - 1));
}

export function calculateKPR(principal: number, tenors: TenorRow[]): AmortizationRow[] {
  const rows: AmortizationRow[] = [];
  let remainingPrincipal = principal;
  let currentMonth = 1;

  for (const tenor of tenors) {
    const monthlyRate = tenor.rate / 100 / 12;
    const remainingMonths = tenors.length * 12 - rows.length;
    const monthlyPayment = calcAnnuity(
      remainingPrincipal,
      monthlyRate,
      remainingMonths,
    );

    for (let i = 0; i < 12; i++) {
      const interestPayment = remainingPrincipal * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;

      remainingPrincipal = Math.max(remainingPrincipal - principalPayment, 0);

      rows.push({
        month: currentMonth++,
        rate: tenor.rate,
        interestPayment,
        principalPayment,
        totalPayment: monthlyPayment,
        remainingPrincipal,
      });
    }
  }

  return rows;
}