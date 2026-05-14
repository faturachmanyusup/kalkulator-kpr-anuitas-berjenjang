# Domain: KPR (Kredit Pemilikan Rumah)

## Concepts
- **Pokok Pinjaman**: initial loan principal
- **Tenor**: loan duration in years, split into segments each with its own annual interest rate
- **Bunga Anuitas**: annuity interest — fixed total monthly payment per segment, recalculated at each rate change
- **Tenor Berjenjang**: tiered tenor — each year row has its own rate; annuity is recalculated at the start of each segment based on remaining principal and remaining total months

## Annuity Formula (per segment)
```
monthlyRate = annualRate / 100 / 12
remainingMonths = totalMonths - monthsElapsed

annuity = ceil(
  remaining * monthlyRate * (1 + monthlyRate)^remainingMonths / ((1 + monthlyRate)^remainingMonths - 1)
)

// If monthlyRate === 0:
annuity = remaining / remainingMonths
```

## Data Models
```ts
interface TenorRow {
  id: string
  year: number   // always 1 per row (each row = 1 year)
  rate: number   // annual rate in percent
}

interface AmortizationRow {
  month: number
  rate: number
  interestPayment: number    // remaining * monthlyRate
  principalPayment: number   // annuity - interestPayment (capped at remaining)
  totalPayment: number       // interestPayment + principalPayment
  remainingPrincipal: number // after this month's payment
}
```

## Amortization Table Columns (UI order)
| Column | Bahasa Label |
|---|---|
| month | Bulan {n} |
| rate | Suku Bunga |
| interestPayment | Angsuran Bunga |
| principalPayment | Angsuran Pokok |
| totalPayment | Angsuran Total |
| remainingPrincipal | Sisa Pokok Pinjaman |

## Summary Stats (above table)
- Total Bulan + equivalent years
- Total Bunga + % of principal
- Total Pembayaran (accent)
