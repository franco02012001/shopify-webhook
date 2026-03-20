import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CheckoutPage from './pages/CheckoutPage';
import StatusPage from './pages/StatusPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment/status" element={<StatusPage />} />
      </Routes>
    </BrowserRouter>
  );
}
