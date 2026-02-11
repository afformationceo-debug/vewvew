export const events = [
  {
    id: "evt-001",
    title: {
      en: "Spring Beauty Festival 2026",
      ko: "2026 봄 뷰티 페스티벌",
    },
    description: {
      en: "Celebrate spring with up to 50% off on selected beauty and skin care packages! From fillers and Botox to premium skin rejuvenation, refresh your look this season. Limited slots available - book now to secure your spot!",
      ko: "선별된 뷰티 및 스킨케어 패키지 최대 50% 할인으로 봄을 맞이하세요! 필러, 보톡스부터 프리미엄 피부 리쥬비네이션까지, 이번 시즌 새로운 모습으로 변신하세요. 한정 수량 - 지금 예약하세요!",
    },
    image: "https://picsum.photos/seed/event001/800/400",
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    type: "seasonal",
    discount: {
      type: "percent",
      value: 50,
      maxDiscount: 500000,
    },
    couponCode: null,
    isActive: true,
  },
  {
    id: "evt-002",
    title: {
      en: "First Visit Coupon - 15% OFF",
      ko: "첫 방문 쿠폰 - 15% 할인",
    },
    description: {
      en: "Welcome to K-MEDI TOUR! Enjoy an exclusive 15% discount on your first medical tourism package. Valid for all categories. Use coupon code WELCOME15 at checkout. Cannot be combined with other promotions.",
      ko: "K-MEDI TOUR에 오신 것을 환영합니다! 첫 의료관광 패키지에서 15% 독점 할인을 받으세요. 전 카테고리 적용 가능. 결제 시 쿠폰 코드 WELCOME15를 입력하세요. 다른 프로모션과 중복 적용 불가.",
    },
    image: "https://picsum.photos/seed/event002/800/400",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    type: "coupon",
    discount: {
      type: "percent",
      value: 15,
      maxDiscount: 300000,
    },
    couponCode: "WELCOME15",
    isActive: true,
  },
  {
    id: "evt-003",
    title: {
      en: "Refer a Friend - Get 200,000 KRW Credit",
      ko: "친구 추천 - 20만원 크레딧 증정",
    },
    description: {
      en: "Share the K-MEDI TOUR experience! Refer a friend and both of you receive a 200,000 KRW credit toward your next booking. There is no limit on referrals - the more friends you refer, the more you save. Your friend must complete their package for the credit to be applied.",
      ko: "K-MEDI TOUR 경험을 공유하세요! 친구를 추천하면 두 분 모두 다음 예약 시 20만원 크레딧을 받으실 수 있습니다. 추천 횟수 제한 없음 - 더 많이 추천할수록 더 많이 절약합니다. 친구가 패키지를 완료해야 크레딧이 적용됩니다.",
    },
    image: "https://picsum.photos/seed/event003/800/400",
    startDate: "2026-01-01",
    endDate: "2026-06-30",
    type: "referral",
    discount: {
      type: "fixed",
      value: 200000,
      maxDiscount: 200000,
    },
    couponCode: null,
    isActive: true,
  },
  {
    id: "evt-004",
    title: {
      en: "Lunar New Year Health Checkup Special",
      ko: "설날 건강검진 특별 프로모션",
    },
    description: {
      en: "Start the Lunar New Year with good health! Premium health checkup packages are now 30% off for a limited time. Includes comprehensive screening at Samsung Medical Center or Asan Medical Center with luxury hotel accommodation and Seoul city tour.",
      ko: "건강한 새해를 시작하세요! 프리미엄 건강검진 패키지를 한정 기간 30% 할인합니다. 삼성서울병원 또는 서울아산병원 종합 검진과 럭셔리 호텔 숙박, 서울 시티 투어가 포함됩니다.",
    },
    image: "https://picsum.photos/seed/event004/800/400",
    startDate: "2026-01-25",
    endDate: "2026-02-28",
    type: "special",
    discount: {
      type: "percent",
      value: 30,
      maxDiscount: 1000000,
    },
    couponCode: "LUNARHEALTH",
    isActive: true,
  },
  {
    id: "evt-005",
    title: {
      en: "Summer K-Beauty Triple Package Deal",
      ko: "여름 K-뷰티 트리플 패키지 딜",
    },
    description: {
      en: "Book any 3 beauty treatments together and save 40%! Mix and match from fillers, Botox, skin treatments, and thread lifts. Perfect for a complete beauty transformation during your Korean summer getaway. Includes a complimentary Myeongdong K-Beauty shopping tour.",
      ko: "뷰티 시술 3가지를 함께 예약하면 40% 할인! 필러, 보톡스, 피부 시술, 실리프팅 중 자유롭게 선택하세요. 한국 여름 휴가 중 완벽한 뷰티 변신에 안성맞춤. 명동 K-뷰티 쇼핑 투어 무료 제공.",
    },
    image: "https://picsum.photos/seed/event005/800/400",
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    type: "seasonal",
    discount: {
      type: "percent",
      value: 40,
      maxDiscount: 2000000,
    },
    couponCode: null,
    isActive: false,
  },
];
