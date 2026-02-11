import { useState } from 'react';
import { Mail, ChevronDown } from 'lucide-react';
import Modal from '../common/Modal';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, addToast } = useUIStore();
  const { loginWithProvider, loginDemo } = useAuthStore();
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState('');

  const handleSocialLogin = (provider) => {
    loginWithProvider(provider);
    addToast({ type: 'success', message: `Logged in with ${provider}!` });
    closeLoginModal();
  };

  const handleDemoLogin = () => {
    loginDemo();
    addToast({ type: 'success', message: 'Logged in with demo account!' });
    closeLoginModal();
  };

  return (
    <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal} size="sm">
      <div className="p-6 pt-2">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 font-heading">Welcome to K-MEDI TOUR</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage bookings and access exclusive deals</p>
        </div>

        <div className="space-y-2.5">
          {/* Google */}
          <button onClick={() => handleSocialLogin('google')} className="btn-social btn-google">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* LINE */}
          <button onClick={() => handleSocialLogin('line')} className="btn-social btn-line">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.508.43-.595.064-.023.131-.033.2-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            Continue with LINE
          </button>

          {/* KakaoTalk */}
          <button onClick={() => handleSocialLogin('kakao')} className="btn-social btn-kakao">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#191919">
              <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 01-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.664 6.201 3 12 3z"/>
            </svg>
            Continue with Kakao
          </button>

          {/* Apple */}
          <button onClick={() => handleSocialLogin('apple')} className="btn-social btn-apple">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        {/* Or divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
          <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or</span></div>
        </div>

        {/* Email login expandable */}
        {!showEmail ? (
          <button
            onClick={() => setShowEmail(true)}
            className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Continue with Email
            <ChevronDown className="w-3 h-3" />
          </button>
        ) : (
          <div className="space-y-2.5">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={() => { addToast({ type: 'info', message: 'Email login is demo-only. Use social login or Demo Login.' }); }}
              className="w-full py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Demo Login fallback */}
        <button
          onClick={handleDemoLogin}
          className="w-full mt-3 py-2.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-colors"
        >
          Try Demo Login
        </button>

        <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </Modal>
  );
}
