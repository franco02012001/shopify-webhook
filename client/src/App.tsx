import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CheckoutPage from './pages/CheckoutPage';
import HomePage from './pages/HomePage';
import StatusPage from './pages/StatusPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment/status" element={<StatusPage />} />
      </Routes>
    </BrowserRouter>
  );
}
