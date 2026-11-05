/**
 * Lepas service booking: brand configuration and copy for the journey described in
 * VEHICLE_SERVICE_BOOKING_REPLICATION_SPEC.md (existing/new customer, appointment, transport, T&C, CAPTCHA).
 * Internal values stay English and stable; labels come from SERVICE_BOOKING_COPY[locale].
 */

export type Locale = "en" | "ar";

export type ServiceLocation = {
  id: string;
  label: Record<Locale, string>;
  pickupCharge: number;
  dropoffCharge: number;
  transportAvailable: boolean;
};

export const BOOKING_CONFIG = {
  referencePrefix: "LP-",
  // PLACEHOLDER: confirm the late-cancellation fee for pickup / drop-off.
  cancellationFee: 20,
  serviceCentreAddress: {
    en: "Lepas Al Quoz After-Sales Facility, Al Quoz Industrial Area 4, Dubai",
    ar: "مركز ليباس لخدمات ما بعد البيع، القوز الصناعية 4، دبي",
  } as Record<Locale, string>,
  serviceCentreMap: "https://www.google.com/maps?q=25.1162109,55.2236328&z=15&output=embed",
  // PLACEHOLDER transport charges: replace with the confirmed Lepas pickup/drop-off prices.
  locations: [
    {
      id: "al-quoz",
      label: { en: "Dubai, Al Quoz", ar: "دبي، القوز" },
      pickupCharge: 50,
      dropoffCharge: 50,
      transportAvailable: true,
    },
  ] as ServiceLocation[],
  models: ["Lepas L8", "Lepas L6", "Lepas L4"],
};

export const TITLES = ["Mr.", "Mrs.", "Miss", "Ms.", "Doctor", "Professor"] as const;
export const PURPOSES = ["Service", "Collision Damage", "Report a Fault"] as const;
export const TRANSPORT_OPTIONS = ["none", "pickup", "dropoff", "both"] as const;
export type Purpose = (typeof PURPOSES)[number];
export type TransportOption = (typeof TRANSPORT_OPTIONS)[number];

/** 10,000 to 200,000 km in 10,000 km steps. */
export const SERVICE_INTERVALS = Array.from({ length: 20 }, (_, i) => (i + 1) * 10000);

export const PHONE_COUNTRIES = [
  { iso: "AE", dial: "+971", flag: "🇦🇪", en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" },
  { iso: "SA", dial: "+966", flag: "🇸🇦", en: "Saudi Arabia", ar: "المملكة العربية السعودية" },
  { iso: "QA", dial: "+974", flag: "🇶🇦", en: "Qatar", ar: "قطر" },
  { iso: "KW", dial: "+965", flag: "🇰🇼", en: "Kuwait", ar: "الكويت" },
  { iso: "BH", dial: "+973", flag: "🇧🇭", en: "Bahrain", ar: "البحرين" },
  { iso: "OM", dial: "+968", flag: "🇴🇲", en: "Oman", ar: "عُمان" },
  { iso: "EG", dial: "+20", flag: "🇪🇬", en: "Egypt", ar: "مصر" },
  { iso: "JO", dial: "+962", flag: "🇯🇴", en: "Jordan", ar: "الأردن" },
  { iso: "LB", dial: "+961", flag: "🇱🇧", en: "Lebanon", ar: "لبنان" },
  { iso: "IN", dial: "+91", flag: "🇮🇳", en: "India", ar: "الهند" },
  { iso: "PK", dial: "+92", flag: "🇵🇰", en: "Pakistan", ar: "باكستان" },
  { iso: "BD", dial: "+880", flag: "🇧🇩", en: "Bangladesh", ar: "بنغلاديش" },
  { iso: "PH", dial: "+63", flag: "🇵🇭", en: "Philippines", ar: "الفلبين" },
  { iso: "NP", dial: "+977", flag: "🇳🇵", en: "Nepal", ar: "نيبال" },
  { iso: "LK", dial: "+94", flag: "🇱🇰", en: "Sri Lanka", ar: "سريلانكا" },
  { iso: "GB", dial: "+44", flag: "🇬🇧", en: "United Kingdom", ar: "المملكة المتحدة" },
  { iso: "US", dial: "+1", flag: "🇺🇸", en: "United States", ar: "الولايات المتحدة" },
  { iso: "FR", dial: "+33", flag: "🇫🇷", en: "France", ar: "فرنسا" },
  { iso: "DE", dial: "+49", flag: "🇩🇪", en: "Germany", ar: "ألمانيا" },
  { iso: "TR", dial: "+90", flag: "🇹🇷", en: "Turkey", ar: "تركيا" },
];

/** Emoji flag from an ISO country code (e.g. "AE" → 🇦🇪). */
export const isoFlag = (iso: string) =>
  String.fromCodePoint(...iso.toUpperCase().split("").map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));

export const REG_COUNTRIES: { iso: string; en: string; ar: string; cities: { en: string; ar: string }[] }[] = [
  {
    iso: "AE",
    en: "United Arab Emirates",
    ar: "الإمارات العربية المتحدة",
    cities: [
      { en: "Abu Dhabi", ar: "أبوظبي" },
      { en: "Dubai", ar: "دبي" },
      { en: "Sharjah", ar: "الشارقة" },
      { en: "Ajman", ar: "عجمان" },
      { en: "Umm Al Quwain", ar: "أم القيوين" },
      { en: "Ras Al Khaimah", ar: "رأس الخيمة" },
      { en: "Fujairah", ar: "الفجيرة" },
    ],
  },
  {
    iso: "SA",
    en: "Saudi Arabia",
    ar: "المملكة العربية السعودية",
    cities: [
      { en: "Riyadh", ar: "الرياض" },
      { en: "Jeddah", ar: "جدة" },
      { en: "Mecca", ar: "مكة المكرمة" },
      { en: "Medina", ar: "المدينة المنورة" },
      { en: "Dammam", ar: "الدمام" },
      { en: "Khobar", ar: "الخبر" },
    ],
  },
  {
    iso: "KW",
    en: "Kuwait",
    ar: "الكويت",
    cities: [
      { en: "Kuwait City", ar: "مدينة الكويت" },
      { en: "Hawalli", ar: "حولي" },
      { en: "Salmiya", ar: "السالمية" },
      { en: "Farwaniya", ar: "الفروانية" },
    ],
  },
  {
    iso: "QA",
    en: "Qatar",
    ar: "قطر",
    cities: [
      { en: "Doha", ar: "الدوحة" },
      { en: "Al Rayyan", ar: "الريان" },
      { en: "Al Wakrah", ar: "الوكرة" },
      { en: "Al Khor", ar: "الخور" },
    ],
  },
  {
    iso: "BH",
    en: "Bahrain",
    ar: "البحرين",
    cities: [
      { en: "Manama", ar: "المنامة" },
      { en: "Muharraq", ar: "المحرق" },
      { en: "Riffa", ar: "الرفاع" },
      { en: "Hamad Town", ar: "مدينة حمد" },
    ],
  },
  {
    iso: "OM",
    en: "Oman",
    ar: "عُمان",
    cities: [
      { en: "Muscat", ar: "مسقط" },
      { en: "Salalah", ar: "صلالة" },
      { en: "Sohar", ar: "صحار" },
      { en: "Nizwa", ar: "نزوى" },
    ],
  },
];

/** Prototype customer lookup (no backend): mobile 000000000 with two registered vehicles. */
export const MOCK_CUSTOMER = {
  phone: "000000000",
  title: "Mr." as (typeof TITLES)[number],
  firstName: "Ahmed",
  lastName: "Al Mansouri",
  email: "ahmed.almansouri@example.com",
  vehicles: [
    { country: "AE", city: "Dubai", prefix: "CC", plate: "12345", model: "Lepas L8", year: 2025 },
    { country: "AE", city: "Abu Dhabi", prefix: "AD", plate: "67890", model: "Lepas L4", year: 2026 },
  ],
  previousService: { en: "Service Contract, 10,000 km service", ar: "عقد الخدمة، صيانة 10,000 كم" },
};

const COPY = {
  en: {
    existingQuestion: "Are you an existing customer?",
    existingHint: "Existing customers can verify with their vehicle registration and mobile number.",
    yes: "Yes",
    no: "No",
    lookupTitle: "Find your vehicle",
    regCountry: "Registration country",
    regCity: "Registration city",
    selectCountry: "Select country",
    selectCity: "Select city",
    prefix: "Plate code",
    prefixPlaceholder: "e.g. CC",
    plate: "Plate number",
    platePlaceholder: "e.g. 12345",
    mobile: "Mobile number",
    mobilePlaceholder: "Enter your mobile number",
    verify: "Verify",
    searching: "Searching for your vehicle…",
    errFillVehicle: "Please fill in all vehicle details.",
    errInvalidPhone: "Please enter a valid mobile number.",
    errNoCustomer: "No customer found with this number.",
    errNoVehicle: "Vehicle not found. Please check your details.",
    vehicleFound: "Vehicle found: {vehicle}. Your details have been loaded.",
    saudiRedirect:
      "Vehicles registered in Saudi Arabia can't be verified here. Please continue as a new customer.",
    personal: "Personal information",
    vehicle: "Vehicle details",
    appointment: "Appointment details",
    appointmentLocked: "Complete your personal information and vehicle details to continue.",
    title: "Title",
    titles: { "Mr.": "Mr.", "Mrs.": "Mrs.", Miss: "Miss", "Ms.": "Ms.", Doctor: "Doctor", Professor: "Professor" },
    firstName: "First name",
    lastName: "Last name",
    phoneCountry: "Country code",
    searchCountry: "Search country or code",
    email: "Email address",
    transmission: "Transmission",
    automatic: "Automatic",
    manual: "Manual",
    model: "Vehicle model",
    purpose: "Purpose of visit",
    selectPurpose: "Select purpose",
    purposes: { Service: "Service", "Collision Damage": "Collision damage", "Report a Fault": "Report a fault" },
    interval: "Service next interval",
    selectInterval: "Select next service interval",
    km: "Service Contract, {n} Kilometer Mileage Service",
    specify: "Please specify",
    specifyPlaceholder: "Please specify purpose",
    previousService: "Previous service record: {record}",
    noPreviousService: "No previous service records",
    location: "Location",
    selectLocation: "Select location",
    date: "Preferred appointment date",
    selectDate: "Select a date",
    selectLocationFirst: "Select a location first",
    arrival:
      "Please check in between 8:00 AM and 11:30 AM. If any additional work is needed, our advisor will explain it first; once approved, we'll confirm a revised collection time, which may be the following day.",
    wait: "Will you wait at the workshop reception?",
    message: "Leave additional message",
    messagePlaceholder: "Any additional information about your vehicle or service request…",
    transportTitle: "Vehicle pickup / drop-off",
    transportHint: "Select a location and appointment date to request pickup or drop-off.",
    transportUnavailable: "Pickup and drop-off aren't available for this location.",
    transportCollision: "Pickup and drop-off aren't available for collision damage or reported faults. Please bring your vehicle to the service centre.",
    transport: { none: "Not required", pickup: "Pickup", dropoff: "Drop-off", both: "Both" },
    termsCheckbox: "I agree to the pickup and drop-off",
    termsLink: "Terms & Conditions",
    chargePickup: "A pickup charge of AED {pickup} applies for {location}.",
    chargeDropoff: "A drop-off charge of AED {dropoff} applies for {location}.",
    chargeBoth: "Pickup (AED {pickup}) and drop-off (AED {dropoff}) charges apply for {location}: AED {total} in total.",
    pickupDetails: "Pickup details",
    dropoffDetails: "Drop-off details",
    from: "From",
    to: "To",
    yourAddress: "Your address",
    addressPlaceholder: "Building, street, area, city",
    pickupDate: "Pickup date",
    dropoffDate: "Drop-off date",
    pickupTime: "Pickup time",
    selectTime: "Select time",
    instructions: "Instructions",
    instructionsPlaceholder: "Gate code, parking spot, landmarks…",
    privacyPrefix: "I have read and agree to the",
    privacyLink: "Privacy Policy",
    captcha: "Verification code",
    verification: "Verification",
    captchaPlaceholder: "Enter the code",
    captchaRefresh: "Get a new code",
    captchaWrong: "Incorrect code. Please try again.",
    captchaOk: "Verified",
    submit: "Submit",
    submitting: "Booking your appointment…",
    checkingLocation: "Checking availability…",
    loadingPurpose: "Loading service options…",
    required: "Required",
    fieldsRequired: "Fields marked with * are required.",
    fixErrors: "Please complete the highlighted fields.",
    termsTitle: "Customer Terms & Conditions",
    termsIntro:
      "These terms apply to the vehicle pickup and drop-off service arranged by Lepas UAE through its authorised chauffeur partner.",
    termsNature: "1. Nature of service",
    termsNatureItems: [
      "1.1 A licensed driver collects your vehicle from, and returns it to, the address you provide.",
      "1.2 Pickup and drop-off are subject to driver availability and confirmation by our service team.",
      "1.3 Charges are shown before you confirm and are payable at the service centre.",
    ],
    termsAuth: "2. Customer authorisation",
    termsAuthItems: [
      "2.1 You authorise the driver to operate your vehicle between your address and the service centre.",
      "2.2 You confirm the vehicle is insured, roadworthy and free of valuables.",
      "2.3 Cancellations made less than two hours before the scheduled pickup time incur the cancellation fee.",
    ],
    cancel: "Cancel",
    acknowledge: "Acknowledge",
    successTitle: "Booking confirmed",
    successBody: "Your service appointment has been booked.",
    successSent: "We've sent the booking details by email, SMS and WhatsApp.",
    reference: "Appointment number",
    summaryName: "Name",
    summaryPhone: "Phone",
    summaryEmail: "Email",
    summaryVehicle: "Vehicle registration",
    summaryPurpose: "Purpose",
    summaryInterval: "Next interval",
    summarySpecify: "Details",
    summaryLocation: "Location",
    summaryDate: "Date",
    summaryMessage: "Message",
    summaryPickup: "Pickup",
    summaryDropoff: "Drop-off",
    close: "Close",
    selectPlaceholder: "Select",
    firstNamePlaceholder: "First name",
    lastNamePlaceholder: "Last name",
    phonePlaceholder: "55 00 00 000",
    important: "Important",
    arrivalBefore: "Please check in between ",
    arrivalTime: "8:00 AM and 11:30 AM",
    arrivalAfter:
      ". If our technicians recommend additional work, we'll talk you through it first. Once approved, we'll confirm a revised collection time, which may be the following day.",
    chargeTitle: "Vehicle transport service charge",
    termsAckPrefix: "I acknowledge that I have read and accept the applicable",
    termsAckSuffix: ", including the",
    termsAckFee: "AED {fee} cancellation fee",
    termsAckEnd: "for cancellations made less than two hours before the scheduled pickup time.",
    pickupAddress: "Pick-up address",
    dropoffAddress: "Drop-off address",
    pickupAddressPlaceholder: "Enter pick-up address",
    dropoffAddressPlaceholder: "Enter drop-off address",
    pickupInfo: "Your pick-up date matches your appointment date. We'll collect your vehicle ahead of time so it's ready for the service.",
    dropoffInfo: "Your drop-off date matches your appointment date. We'll return your vehicle once the service is complete.",
    successSentVia: "Booking details sent via:",
    channels: ["Email", "SMS", "WhatsApp"],
    summaryTitle: "Booking summary",
    summaryRegistration: "Location",
    summaryPlate: "Plate",
    summaryTransport: "Pick-up / Drop-off",
    summaryAddress: "Address",
  },
  ar: {
    existingQuestion: "هل أنت عميل حالي؟",
    existingHint: "يمكن للعملاء الحاليين التحقق باستخدام تسجيل المركبة ورقم الجوال.",
    yes: "نعم",
    no: "لا",
    lookupTitle: "ابحث عن مركبتك",
    regCountry: "بلد التسجيل",
    regCity: "مدينة التسجيل",
    selectCountry: "اختر البلد",
    selectCity: "اختر المدينة",
    prefix: "رمز اللوحة",
    prefixPlaceholder: "مثال: CC",
    plate: "رقم اللوحة",
    platePlaceholder: "مثال: 12345",
    mobile: "رقم الجوال",
    mobilePlaceholder: "أدخل رقم جوالك",
    verify: "تحقق",
    searching: "جارٍ البحث عن مركبتك…",
    errFillVehicle: "يرجى تعبئة جميع بيانات المركبة.",
    errInvalidPhone: "يرجى إدخال رقم جوال صحيح.",
    errNoCustomer: "لم يتم العثور على عميل بهذا الرقم.",
    errNoVehicle: "لم يتم العثور على المركبة. يرجى التحقق من البيانات.",
    vehicleFound: "تم العثور على المركبة: {vehicle}. تم تحميل بياناتك.",
    saudiRedirect: "لا يمكن التحقق من المركبات المسجلة في السعودية هنا. يرجى المتابعة كعميل جديد.",
    personal: "المعلومات الشخصية",
    vehicle: "بيانات المركبة",
    appointment: "تفاصيل الموعد",
    appointmentLocked: "أكمل معلوماتك الشخصية وبيانات المركبة للمتابعة.",
    title: "اللقب",
    titles: { "Mr.": "السيد", "Mrs.": "السيدة", Miss: "الآنسة", "Ms.": "السيدة", Doctor: "الدكتور", Professor: "الأستاذ" },
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    phoneCountry: "رمز الدولة",
    searchCountry: "ابحث عن الدولة أو الرمز",
    email: "البريد الإلكتروني",
    transmission: "ناقل الحركة",
    automatic: "أوتوماتيك",
    manual: "يدوي",
    model: "طراز المركبة",
    purpose: "سبب الزيارة",
    selectPurpose: "اختر السبب",
    purposes: { Service: "صيانة دورية", "Collision Damage": "أضرار تصادم", "Report a Fault": "الإبلاغ عن عطل" },
    interval: "موعد الصيانة التالية",
    selectInterval: "اختر موعد الصيانة التالية",
    km: "عقد الخدمة، صيانة {n} كيلومتر",
    specify: "يرجى التوضيح",
    specifyPlaceholder: "يرجى تحديد الغرض",
    previousService: "سجل الصيانة السابق: {record}",
    noPreviousService: "لا توجد سجلات صيانة سابقة",
    location: "الموقع",
    selectLocation: "اختر الموقع",
    date: "تاريخ الموعد المفضل",
    selectDate: "اختر تاريخاً",
    selectLocationFirst: "اختر الموقع أولاً",
    arrival:
      "يرجى الحضور بين الساعة 8:00 صباحاً و11:30 صباحاً. إذا تطلّب الأمر أعمالاً إضافية، سيشرحها لك المستشار أولاً، وبعد الموافقة نؤكد موعد استلام جديداً قد يكون في اليوم التالي.",
    wait: "هل ستنتظر في استقبال المركز؟",
    message: "اترك رسالة إضافية",
    messagePlaceholder: "أي معلومات إضافية عن مركبتك أو طلب الخدمة…",
    transportTitle: "استلام / توصيل المركبة",
    transportHint: "اختر الموقع وتاريخ الموعد لطلب الاستلام أو التوصيل.",
    transportUnavailable: "خدمة الاستلام والتوصيل غير متاحة في هذا الموقع.",
    transportCollision: "خدمة الاستلام والتوصيل غير متاحة لأضرار التصادم أو الأعطال. يرجى إحضار مركبتك إلى مركز الخدمة.",
    transport: { none: "غير مطلوب", pickup: "استلام", dropoff: "توصيل", both: "كلاهما" },
    termsCheckbox: "أوافق على",
    termsLink: "شروط وأحكام الاستلام والتوصيل",
    chargePickup: "تُطبّق رسوم استلام قدرها {pickup} درهم في {location}.",
    chargeDropoff: "تُطبّق رسوم توصيل قدرها {dropoff} درهم في {location}.",
    chargeBoth: "تُطبّق رسوم الاستلام ({pickup} درهم) والتوصيل ({dropoff} درهم) في {location}: الإجمالي {total} درهم.",
    pickupDetails: "تفاصيل الاستلام",
    dropoffDetails: "تفاصيل التوصيل",
    from: "من",
    to: "إلى",
    yourAddress: "عنوانك",
    addressPlaceholder: "المبنى، الشارع، المنطقة، المدينة",
    pickupDate: "تاريخ الاستلام",
    dropoffDate: "تاريخ التوصيل",
    pickupTime: "وقت الاستلام",
    selectTime: "اختر الوقت",
    instructions: "تعليمات",
    instructionsPlaceholder: "رمز البوابة، موقف السيارة، معالم قريبة…",
    privacyPrefix: "لقد قرأت وأوافق على",
    privacyLink: "سياسة الخصوصية",
    captcha: "رمز التحقق",
    verification: "التحقق",
    captchaPlaceholder: "أدخل الرمز",
    captchaRefresh: "رمز جديد",
    captchaWrong: "الرمز غير صحيح. يرجى المحاولة مرة أخرى.",
    captchaOk: "تم التحقق",
    submit: "إرسال",
    submitting: "جارٍ حجز موعدك…",
    checkingLocation: "جارٍ التحقق من التوفر…",
    loadingPurpose: "جارٍ تحميل خيارات الخدمة…",
    required: "مطلوب",
    fieldsRequired: "الحقول المميزة بـ * إلزامية.",
    fixErrors: "يرجى استكمال الحقول المحددة.",
    termsTitle: "شروط وأحكام العميل",
    termsIntro: "تنطبق هذه الشروط على خدمة استلام المركبة وتوصيلها التي ترتبها ليباس الإمارات عبر شريكها المعتمد للسائقين.",
    termsNature: "1. طبيعة الخدمة",
    termsNatureItems: [
      "1.1 يستلم سائق مرخّص مركبتك من العنوان الذي تقدمه ويعيدها إليه.",
      "1.2 تخضع خدمة الاستلام والتوصيل لتوفر السائقين وتأكيد فريق الخدمة.",
      "1.3 تُعرض الرسوم قبل التأكيد وتُدفع في مركز الخدمة.",
    ],
    termsAuth: "2. تفويض العميل",
    termsAuthItems: [
      "2.1 تفوّض السائق بقيادة مركبتك بين عنوانك ومركز الخدمة.",
      "2.2 تؤكد أن المركبة مؤمّنة وصالحة للسير وخالية من المقتنيات الثمينة.",
      "2.3 تُطبَّق رسوم الإلغاء على الإلغاء قبل أقل من ساعتين من موعد الاستلام.",
    ],
    cancel: "إلغاء",
    acknowledge: "موافق",
    successTitle: "تم تأكيد الحجز",
    successBody: "تم حجز موعد الصيانة الخاص بك.",
    successSent: "أرسلنا تفاصيل الحجز عبر البريد الإلكتروني والرسائل النصية وواتساب.",
    reference: "رقم الموعد",
    summaryName: "الاسم",
    summaryPhone: "الهاتف",
    summaryEmail: "البريد الإلكتروني",
    summaryVehicle: "تسجيل المركبة",
    summaryPurpose: "السبب",
    summaryInterval: "فترة الصيانة",
    summarySpecify: "التفاصيل",
    summaryLocation: "الموقع",
    summaryDate: "التاريخ",
    summaryMessage: "الرسالة",
    summaryPickup: "الاستلام",
    summaryDropoff: "التوصيل",
    close: "إغلاق",
    selectPlaceholder: "اختر",
    firstNamePlaceholder: "الاسم الأول",
    lastNamePlaceholder: "اسم العائلة",
    phonePlaceholder: "55 00 00 000",
    important: "مهم",
    arrivalBefore: "يرجى تسجيل الوصول بين الساعة ",
    arrivalTime: "8:00 ص و11:30 ص",
    arrivalAfter:
      ". إذا أوصى الفنيون بأعمال إضافية فسنشرحها لك أولًا، وبعد موافقتك سنؤكد موعدًا جديدًا للاستلام قد يكون في اليوم التالي.",
    chargeTitle: "رسوم خدمة نقل المركبة",
    termsAckPrefix: "أقر بأنني اطلعت على",
    termsAckSuffix: " المعمول بها ووافقت عليها، بما في ذلك",
    termsAckFee: "رسوم إلغاء بقيمة {fee} درهم",
    termsAckEnd: "على الإلغاء قبل أقل من ساعتين من موعد الاستلام.",
    pickupAddress: "عنوان الاستلام",
    dropoffAddress: "عنوان التسليم",
    pickupAddressPlaceholder: "أدخل عنوان الاستلام",
    dropoffAddressPlaceholder: "أدخل عنوان التسليم",
    pickupInfo: "تاريخ الاستلام هو نفس تاريخ موعدك. سنستلم مركبتك مسبقًا لتكون جاهزة للصيانة.",
    dropoffInfo: "تاريخ التسليم هو نفس تاريخ موعدك. سنعيد مركبتك إليك فور انتهاء الصيانة.",
    successSentVia: "تم إرسال تفاصيل الحجز عبر:",
    channels: ["البريد الإلكتروني", "رسالة نصية", "واتساب"],
    summaryTitle: "ملخص الحجز",
    summaryRegistration: "الموقع",
    summaryPlate: "اللوحة",
    summaryTransport: "الاستلام / التسليم",
    summaryAddress: "العنوان",
  },
};

export type BookingCopy = (typeof COPY)["en"];
export const SERVICE_BOOKING_COPY: Record<Locale, BookingCopy> = COPY;

export const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

/** Pickup slots every 30 minutes, 07:00–17:00; Fridays end at 12:30. */
export function pickupSlots(isoDate: string): string[] {
  const friday = isoDate ? new Date(`${isoDate}T00:00:00`).getDay() === 5 : false;
  const out: string[] = [];
  for (let m = 7 * 60; m <= 17 * 60; m += 30) {
    const h = Math.floor(m / 60);
    if (friday && h >= 13) break;
    out.push(`${String(h).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return out;
}

export const maskPhone = (p: string) => (p.length <= 4 ? p : `${p.slice(0, 2)}${"X".repeat(p.length - 4)}${p.slice(-2)}`);
export const maskPlate = (p: string) => (p.length <= 2 ? p : `${p.slice(0, 2)}${"X".repeat(p.length - 2)}`);
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const dot = domain.lastIndexOf(".");
  const name = dot > 0 ? domain.slice(0, dot) : domain;
  const tld = dot > 0 ? domain.slice(dot) : "";
  return `${local[0]}${"*".repeat(Math.max(local.length - 1, 1))}@${"*".repeat(name.length)}${tld}`;
}

export const CAPTCHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const makeCaptcha = () =>
  Array.from({ length: 6 }, () => CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)]).join("");
