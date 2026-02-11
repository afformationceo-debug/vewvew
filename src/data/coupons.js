export const coupons = [
  {
    id: "cpn-001",
    code: "WELCOME15",
    title: {
      en: "Welcome Coupon - 15% OFF",
      ko: "웰컴 쿠폰 - 15% 할인",
    },
    description: {
      en: "Welcome to K-MEDI TOUR! Enjoy 15% off on your first medical tourism package booking. Valid for all treatment categories and package types. Cannot be combined with other coupon codes.",
      ko: "K-MEDI TOUR에 오신 것을 환영합니다! 첫 의료관광 패키지 예약 시 15% 할인을 받으세요. 모든 시술 카테고리 및 패키지 유형에 적용 가능합니다. 다른 쿠폰 코드와 중복 사용이 불가합니다.",
    },
    discountType: "percent",
    discountValue: 15,
    minOrderAmount: 500000,
    expiryDate: "2026-12-31",
    isActive: true,
  },
  {
    id: "cpn-002",
    code: "SPRING200K",
    title: {
      en: "Spring Special - 200,000 KRW OFF",
      ko: "봄 특별 할인 - 20만원 할인",
    },
    description: {
      en: "Celebrate spring in Korea! Get 200,000 KRW off any package priced 1,500,000 KRW or above. Perfect for combining beauty treatments with cherry blossom season tours. Limited time offer.",
      ko: "한국의 봄을 축하하세요! 150만원 이상 패키지에서 20만원 할인을 받으세요. 벚꽃 시즌 투어와 뷰티 시술을 함께 즐기기에 안성맞춤입니다. 한정 기간 혜택.",
    },
    discountType: "fixed",
    discountValue: 200000,
    minOrderAmount: 1500000,
    expiryDate: "2026-05-31",
    isActive: true,
  },
  {
    id: "cpn-003",
    code: "VIP30",
    title: {
      en: "VIP Exclusive - 30% OFF Premium Packages",
      ko: "VIP 전용 - 프리미엄 패키지 30% 할인",
    },
    description: {
      en: "Exclusive 30% discount for VIP and premium package bookings over 5,000,000 KRW. Includes complimentary upgrade to luxury sedan airport transfer. This coupon is limited to 50 uses per month.",
      ko: "500만원 이상 VIP 및 프리미엄 패키지 예약 시 30% 독점 할인. 럭셔리 세단 공항 픽업으로 무료 업그레이드 포함. 이 쿠폰은 월 50명 한정입니다.",
    },
    discountType: "percent",
    discountValue: 30,
    minOrderAmount: 5000000,
    expiryDate: "2026-06-30",
    isActive: true,
  },
];
