export default function AppDownload() {
  return (
    <section className="max-w-3xl md:max-w-5xl mx-auto px-4 py-5 md:py-6">
      <div className="bg-primary-600 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h2 className="text-base font-bold text-white font-heading">
            📱 Get the App
          </h2>
          <p className="text-xs text-white/70 mt-1">
            Exclusive deals & real-time booking updates
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* App Store */}
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="text-left">
              <div className="text-[8px] text-white/60 uppercase leading-none">Download on</div>
              <div className="text-xs font-semibold text-white leading-tight">App Store</div>
            </div>
          </button>

          {/* Google Play */}
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.18 23.76c-.36-.17-.59-.52-.59-.93V1.17c0-.41.23-.76.59-.93l11.83 11.76L3.18 23.76zm.82-23.11l13.11 7.56L14 11.33 3.99.65zM17.11 15.34L14 12.22l3.11-3.12 3.78 2.18c.63.36.63.97 0 1.33l-3.78 2.73zm-3.11-3.12L4 23.35l13.11-7.56-3.11-3.57z" />
            </svg>
            <div className="text-left">
              <div className="text-[8px] text-white/60 uppercase leading-none">Get it on</div>
              <div className="text-xs font-semibold text-white leading-tight">Google Play</div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
