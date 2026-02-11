import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileTabBar from './components/layout/MobileTabBar';
import AIBeautyChat from './components/ai/AIBeautyChat';
import ToastContainer from './components/common/Toast';
import LoginModal from './components/auth/LoginModal';
import ConsultModal from './components/consult/ConsultModal';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProductListPage = lazy(() => import('./pages/ProductListPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const MyPage = lazy(() => import('./pages/MyPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const RecentlyViewedPage = lazy(() => import('./pages/RecentlyViewedPage'));
const EventPage = lazy(() => import('./pages/EventPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const CustomTripPage = lazy(() => import('./pages/CustomTripPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white font-body text-gray-900">
      <ScrollToTop />
      <Header />
      <main className="min-h-screen">
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/packages" element={<ProductListPage />} />
              <Route path="/packages/:category" element={<ProductListPage />} />
              <Route path="/package/:slug" element={<ProductDetailPage />} />
              <Route path="/booking/:slug" element={<BookingPage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/recent" element={<RecentlyViewedPage />} />
              <Route path="/events" element={<EventPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/custom-trip" element={<CustomTripPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
      <MobileTabBar />
      <AIBeautyChat />
      <ToastContainer />
      <LoginModal />
      <ConsultModal />
    </div>
  );
}
