import type { AmortizationRow } from '../calculator';
import { exportToPdf, exportToXlsx } from '../helpers/file';
import { IDR, PCT } from '../helpers/number';
import { SummaryCard } from './SummaryCard';

export function ResultSection({ rows, principal, tenorYears }: { rows: AmortizationRow[]; principal: number; tenorYears: number }) {
  const totalInterest = rows.reduce((s, r) => s + r.interestPayment, 0);
  const totalPaid = rows.reduce((s, r) => s + r.totalPayment, 0);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Total Bulan" value={`${rows.length} bulan`} sub={`${(rows.length / 12).toFixed(0)} tahun`} />
        <SummaryCard label="Total Bunga" value={IDR(totalInterest)} sub={`${((totalInterest / principal) * 100).toFixed(1)}% dari pokok`} />
        <SummaryCard label="Total Pembayaran" value={IDR(totalPaid)} accent />
      </div>

      {/* Table Card */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <h2 className="font-semibold text-slate-200">Rincian Angsuran</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToPdf(rows, principal, tenorYears)}
              className="flex items-center gap-2 text-sm font-medium bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              PDF
            </button>
            <button
              onClick={() => exportToXlsx(rows, principal, tenorYears)}
              className="flex items-center gap-2 text-sm font-medium bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              XLSX
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900/40 text-slate-400 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3 font-medium">Bulan</th>
                <th className="text-right px-4 py-3 font-medium">Suku Bunga</th>
                <th className="text-right px-4 py-3 font-medium">Angsuran Bunga</th>
                <th className="text-right px-4 py-3 font-medium">Angsuran Pokok</th>
                <th className="text-right px-4 py-3 font-medium">Angsuran Total</th>
                <th className="text-right px-4 py-3 font-medium">Sisa Pokok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {rows.map((row) => (
                <tr key={row.month} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-2.5 text-slate-300 font-medium min-w-28 md:min-w-0">Bulan <span className="font-mono">{row.month}</span></td>
                  <td className="px-4 py-2.5 text-right text-slate-400 font-mono">{PCT(row.rate)}</td>
                  <td className="px-4 py-2.5 text-right text-amber-400 font-mono">{IDR(row.interestPayment)}</td>
                  <td className="px-4 py-2.5 text-right text-blue-400 font-mono">{IDR(row.principalPayment)}</td>
                  <td className="px-4 py-2.5 text-right text-slate-200 font-medium font-mono">{IDR(row.totalPayment)}</td>
                  <td className="px-4 py-2.5 text-right text-slate-400 font-mono">{IDR(row.remainingPrincipal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
