import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiUrl } from '../config';

const METHODS = [
  { id: 'gcash', label: 'GCash', icon: '💚' },
  { id: 'card', label: 'Credit / Debit card', icon: '💳' },
  { id: 'paymaya', label: 'Maya', icon: '🔵' },
  { id: 'grab_pay', label: 'GrabPay', icon: '🟢' },
];

export default function CheckoutPage() {
  const [params] = useSearchParams();
  const intentId = params.get('intent_id');
  const clientKey = params.get('client_key');
  const sessionId = params.get('session_id');
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl('/payment/attach'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intentId,
          clientKey,
          sessionId,
          paymentMethod: selected,
          returnUrl: `${window.location.origin}/payment/callback`,
        }),
      });
      const data = await res.json();
      if (data.redirectUrl) window.location.href = data.redirectUrl;
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-6">
        <h1 className="text-lg font-semibold text-gray-900 mb-1">Choose payment method</h1>
        <p className="text-sm text-gray-500 mb-6">Secured by PayMongo</p>

        <div className="space-y-3 mb-6">
          {METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelected(method.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left ${
                selected === method.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200'
              }`}
            >
              <span className="text-xl">{method.icon}</span>
              <span className="text-sm font-medium text-gray-700">{method.label}</span>
            </button>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-4 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          onClick={handlePay}
          disabled={!selected || loading}
          className="w-full py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-100 disabled:text-gray-400"
        >
          {loading ? 'Redirecting...' : 'Pay now'}
        </button>
      </div>
    </div>
  );
}
