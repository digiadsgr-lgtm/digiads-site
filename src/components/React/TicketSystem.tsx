'use client';

import React, { useState } from 'react';

export default function TicketSystem() {
  const [formData, setFormData] = useState({
    fullName: '',
    afm: '',
    companyDetails: '',
    websiteUrl: '',
    rawRequest: '',
    isUrgent: false,
  });
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/tickets/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Σφάλμα ανάλυσης.');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result, formData }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Σφάλμα διασύνδεσης πληρωμής.');
        return;
      }
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert('Σφάλμα διασύνδεσης πληρωμής.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-slate-900/95 backdrop-blur-xl text-slate-100 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            <span className="text-[#FFBF00]">DIGI</span>ADS | Τεχνικό Αίτημα & AI Κοστολόγηση
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Αυτόματη τεχνική ανάλυση WordPress, ιεράρχηση εργασιών, υπολογισμός εργατοωρών & εκτιμώμενης παράδοσης (ETD)
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          AI Engine Active
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            required
            placeholder="Ονοματεπώνυμο"
            value={formData.fullName}
            className="w-full bg-slate-800 border border-slate-700 focus:border-[#FFBF00] focus:outline-none rounded-lg p-3 text-sm text-white placeholder-slate-400"
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          <input
            type="text"
            required
            pattern="\d{9}"
            maxLength={9}
            placeholder="ΑΦΜ (9 ψηφία)"
            value={formData.afm}
            className="w-full bg-slate-800 border border-slate-700 focus:border-[#FFBF00] focus:outline-none rounded-lg p-3 text-sm text-white placeholder-slate-400"
            onChange={(e) => setFormData({ ...formData, afm: e.target.value })}
          />
          <input
            type="text"
            required
            placeholder="Στοιχεία Επιχείρησης (Επωνυμία / ΔΟΥ / Έδρα)"
            value={formData.companyDetails}
            className="w-full bg-slate-800 border border-slate-700 focus:border-[#FFBF00] focus:outline-none rounded-lg p-3 text-sm text-white placeholder-slate-400"
            onChange={(e) => setFormData({ ...formData, companyDetails: e.target.value })}
          />
          <input
            type="url"
            required
            placeholder="Ιστοσελίδα URL (π.χ. https://example.gr)"
            value={formData.websiteUrl}
            className="w-full bg-slate-800 border border-slate-700 focus:border-[#FFBF00] focus:outline-none rounded-lg p-3 text-sm text-white placeholder-slate-400"
            onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div
            onClick={() => setFormData({ ...formData, isUrgent: false })}
            className={`cursor-pointer p-4 rounded-lg border transition-all ${
              !formData.isUrgent
                ? 'border-blue-500 bg-blue-950/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold">Standard Ticket</span>
              <span className="text-blue-400 font-semibold">50€ Base Fee</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Κανονική προτεραιότητα στην ουρά εργασιών</p>
          </div>
          <div
            onClick={() => setFormData({ ...formData, isUrgent: true })}
            className={`cursor-pointer p-4 rounded-lg border transition-all ${
              formData.isUrgent
                ? 'border-amber-500 bg-amber-950/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-amber-300">Urgent Ticket ⚡</span>
              <span className="text-amber-400 font-semibold">+120€ Surcharge</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Άμεση προτεραιότητα & επιτάχυνση παράδοσης</p>
          </div>
        </div>

        <textarea
          rows={6}
          required
          placeholder="Περιγράψτε αναλυτικά τις εργασίες που επιθυμείτε να γίνουν στην ιστοσελίδα σας..."
          value={formData.rawRequest}
          className="w-full bg-slate-800 border border-slate-700 focus:border-[#FFBF00] focus:outline-none rounded-lg p-3.5 text-sm text-white placeholder-slate-400"
          onChange={(e) => setFormData({ ...formData, rawRequest: e.target.value })}
        />

        {error && (
          <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
        >
          {loading ? 'Ανάλυση Αιτήματος μέσω AI...' : 'Υπολογισμός Κόστους & Χρόνου Παράδοσης'}
        </button>
      </form>

      {result && (
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-6">
          {/* Τεχνική Ανάλυση & Ιεράρχηση Εργασιών */}
          {result.analysis?.tasks && result.analysis.tasks.length > 0 && (
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h3 className="text-lg font-bold text-white">
                  Ιεράρχηση & Ανάλυση Τεχνικών Εργασιών
                </h3>
                {result.analysis.riskLevel && (
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded ${
                      result.analysis.riskLevel === 'HIGH'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : result.analysis.riskLevel === 'MEDIUM'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    Τεχνική Πολυπλοκότητα: {result.analysis.riskLevel}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {result.analysis.tasks.map((task: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-blue-950 text-blue-400 border border-blue-800">
                          #{task.executionOrder}
                        </span>
                        <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {task.technicalCategory}
                        </span>
                        <h4 className="font-semibold text-white text-sm">{task.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400">{task.technicalDescription}</p>
                      {task.dependencyReason && (
                        <p className="text-[11px] text-slate-500 italic">
                          Σειρά εκτέλεσης: {task.dependencyReason}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block px-3 py-1 rounded-md bg-slate-800 text-slate-200 font-mono text-xs font-bold">
                        {task.estimatedHours}h
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {result.analysis.missingInformationWarnings &&
                result.analysis.missingInformationWarnings.length > 0 && (
                  <div className="mt-4 p-3.5 rounded-lg bg-amber-950/30 border border-amber-800/60">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                      Διευκρινίσεις / Πληροφορίες που θα χρειαστούν:
                    </h4>
                    <ul className="list-disc list-inside text-xs text-amber-200/90 space-y-1">
                      {result.analysis.missingInformationWarnings.map((warn: string, i: number) => (
                        <li key={i}>{warn}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}

          {/* Οικονομική Προσφορά & Χρόνος */}
          <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4">Οικονομική Προσφορά & Χρόνος</h3>
            <div className="flex justify-between text-sm text-slate-300 mb-2">
              <span>
                Εργατοώρες ({result.pricing.totalHours}h){' '}
                {result.pricing.markupMultiplier > 1
                  ? `[Συντελεστής ×${result.pricing.markupMultiplier}]`
                  : ''}
                :
              </span>
              <span>{result.pricing.laborCost}€</span>
            </div>
            <div className="flex justify-between text-sm text-slate-300 mb-2">
              <span>Πάγιο (Base Fee):</span>
              <span>{result.pricing.baseFee}€</span>
            </div>
            {result.ticketType === 'URGENT' && (
              <div className="flex justify-between text-sm text-amber-400 mb-2">
                <span>Επείγουσα Προτεραιότητα:</span>
                <span>+{result.pricing.urgentSurcharge}€</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-slate-400 mb-2 border-t border-slate-800/70 pt-2">
              <span>Καθαρή Αξία (Net):</span>
              <span>{result.pricing.totalCostNet}€</span>
            </div>
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>ΦΠΑ (24%):</span>
              <span>{result.pricing.vatAmount}€</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-white mt-4 border-t border-slate-800 pt-4">
              <span>Τελικό Ποσό (+24% ΦΠΑ):</span>
              <span className="text-[#FFBF00]">{result.pricing.totalCostGross}€</span>
            </div>
            <div className="mt-4 p-3 bg-emerald-950/30 border border-emerald-800/50 rounded text-emerald-400 text-sm font-bold text-center">
              Παράδοση (ETD): {result.schedule.etdFormatted} ({result.schedule.estimatedBusinessDays}{' '}
              εργάσιμες ημέρες)
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full mt-6 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold rounded-lg text-lg transition-colors cursor-pointer"
            >
              {checkoutLoading ? 'Μετάβαση σε Stripe...' : 'Πληρωμή & Κατοχύρωση Ticket'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
