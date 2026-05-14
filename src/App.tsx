import { useState, useCallback, useId } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { AmortizationRow, calculateKPR, type TenorRow } from './calculator';
import { ResultSection } from './components/ResultSection';

interface TenorInput {
  id: string
  rateRaw: string
}

function makeTenorInput(rate = 7): TenorInput {
  return { id: crypto.randomUUID(), rateRaw: String(rate) };
}

export default function App() {
  const principalId = useId();
  const [principalRaw, setPrincipalRaw] = useState('');
  const [tenors, setTenors] = useState<TenorInput[]>([makeTenorInput(7)]);
  const [result, setResult] = useState<AmortizationRow[] | null>(null);
  const [error, setError] = useState('');

  const principal = Number(principalRaw.replace(/\D/g, ''));
  const totalYears = tenors.length;

  const updateTenorRate = useCallback((id: string, value: string) => {
    setTenors((prev) => prev.map((t) => (t.id === id ? { ...t, rateRaw: value } : t)));
  }, []);

  const removeTenor = useCallback((id: string) => {
    setTenors((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    setPrincipalRaw(digits ? Number(digits).toLocaleString('id-ID') : '');
  };

  const handleCalculate = () => {
    setError('');
    if (!principal || principal <= 0) return setError('Masukkan pokok pinjaman yang valid.');
    if (tenors.length === 0) return setError('Tambahkan minimal satu tenor.');
    const parsed: TenorRow[] = tenors.map((t) => ({ id: t.id, year: 1, rate: Number(t.rateRaw) }));
    if (parsed.some((t) => isNaN(t.rate) || t.rate < 0)) return setError('Suku bunga tidak boleh negatif.');
    setResult(calculateKPR(principal, parsed));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm">K</div>
          <h1 className="text-lg font-semibold tracking-tight">Kalkulator KPR</h1>
          <span className="ml-auto text-xs text-slate-500">Bunga Anuitas · Tenor Berjenjang</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Input Card */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 space-y-6">
          {/* Pokok Pinjaman */}
          <div className="space-y-1.5">
            <label htmlFor={principalId} className="text-sm font-medium text-slate-300">
              Pokok Pinjaman
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">Rp</span>
              <input
                id={principalId}
                type="text"
                inputMode="numeric"
                value={principalRaw}
                onChange={handlePrincipalChange}
                placeholder="500.000.000"
                className="w-full bg-slate-900/60 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Tenor Rows */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-300">
              Tenor <span className="text-slate-500 font-normal">({totalYears} tahun total)</span>
            </span>

            <div className="flex flex-wrap gap-y-2 gap-x-3">
              {tenors.map((tenor, idx) => (
                <div key={tenor.id} className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-600 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition w-40 md:w-44">
                  <span className="text-xs text-slate-500 whitespace-nowrap min-w-14 md:min-w-16">Tahun {idx + 1}</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={tenor.rateRaw}
                    onChange={(e) => updateTenorRate(tenor.id, e.target.value)}
                    className="w-9 md:w-11 bg-transparent text-sm text-slate-100 focus:outline-none"
                  />
                  <span className="text-xs text-slate-400 mr-1">%</span>
                  {tenors.length > 1 && (
                    <button
                      onClick={() => removeTenor(tenor.id)}
                      className="text-slate-600 hover:text-red-400 transition ml-0.5"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={() => setTenors((p) => [...p, makeTenorInput(Number(p[p.length - 1]?.rateRaw) || 7)])}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-dashed border-slate-500 hover:border-blue-400 text-slate-400 hover:text-blue-400 hover:bg-blue-400/5 text-xs font-medium transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-3 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            Hitung Angsuran
          </button>
        </div>

        {/* Result */}
        {result && <ResultSection rows={result} principal={principal} tenorYears={tenors.length} />}
      </main>
      <Analytics />
    </div>
  );
}

