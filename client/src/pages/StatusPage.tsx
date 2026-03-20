import { useSearchParams } from 'react-router-dom';

const STATES = {
  success: {
    icon: '✓',
    bg: 'bg-green-100',
    color: 'text-green-600',
    title: 'Payment successful',
    msg: 'Your order is confirmed. Check your email.',
    cta: 'Continue shopping',
    ctaStyle: 'bg-green-600 hover:bg-green-700 text-white',
    href: '/',
  },
  failed: {
    icon: '✕',
    bg: 'bg-red-100',
    color: 'text-red-600',
    title: 'Payment failed',
    msg: 'Your payment could not be processed. No charges were made.',
    cta: 'Try again',
    ctaStyle: 'bg-red-600 hover:bg-red-700 text-white',
    href: '/checkout',
  },
  pending: {
    icon: '◷',
    bg: 'bg-amber-100',
    color: 'text-amber-600',
    title: 'Payment pending',
    msg: 'Waiting for confirmation from your bank or wallet.',
    cta: 'Check order status',
    ctaStyle: 'bg-amber-500 hover:bg-amber-600 text-white',
    href: '/',
  },
};

export default function StatusPage() {
  const [params] = useSearchParams();
  const state = (params.get('state') ?? 'pending') as keyof typeof STATES;
  const s = STATES[state] ?? STATES.pending;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm p-8 text-center">
        <div
          className={`w-16 h-16 rounded-full ${s.bg} ${s.color} flex items-center justify-center text-2xl font-bold mx-auto mb-4`}
        >
          {s.icon}
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">{s.title}</h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">{s.msg}</p>
        <a
          href={s.href}
          className={`block w-full py-3 rounded-xl text-sm font-semibold ${s.ctaStyle}`}
        >
          {s.cta}
        </a>
      </div>
    </div>
  );
}
