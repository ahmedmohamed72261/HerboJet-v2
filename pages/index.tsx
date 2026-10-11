import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store";
import { translations } from "@/lib/translations";
import api, { getAssetUrl } from "@/lib/api";
import {
  FiArrowRight, FiStar, FiPackage, FiGlobe,
  FiShield, FiTruck, FiAward, FiChevronDown, FiCheck
} from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useInView } from "framer-motion";

interface Product {
  id: number;
  name_en: string;
  name_ar: string;
  short_description_en: string;
  short_description_ar: string;
  image: string | null;
  category: { name_en: string; name_ar: string };
}

/* ── Animated counter ──────────────────────────────────────── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / (1800 / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Floating orb for Glassmorphism ────────────────────────── */
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[80px] pointer-events-none ${className}`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ── Scroll-triggered reveal ───────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const Home = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.homePage;
  const isEn = language === "en";

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials]         = useState<any[]>([]);
  const [navCategories, setNavCategories]       = useState<any[]>([]);
  const [activeCategory, setActiveCategory]     = useState(0);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchTestimonials();
    fetchCategories();
  }, [language]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      const data = res.data?.data || res.data || [];
      if (Array.isArray(data)) {
        setNavCategories(
          data
            .filter((c: any) => c.is_active !== false)
            .map((c: any) => ({
              id: c.id ?? c._id,
              order: c.order ?? 0,
              slug: c.slug,
              label: isEn ? c.name_en : c.name_ar,
              desc: isEn ? c.description_en : c.description_ar,
            }))
            .sort((a: any, b: any) => a.order - b.order)
        );
      }
    } catch {}
  };

  const fetchTestimonials = async () => {
    try {
      const res = await api.get("/testimonials");
      const data = res.data?.data || res.data || [];
      setTestimonials(Array.isArray(data) ? data : []);
    } catch { setTestimonials([]); }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const res = await api.get("/products");
      setFeaturedProducts(res.data.data?.slice(0, 6) || []);
    } catch { setFeaturedProducts([]); }
  };

  const testimonialItems = testimonials.length > 0 ? testimonials : page.testimonialsItems;

  const stats = [
    { value: 25,  suffix: "+", label: isEn ? "Years Experience"  : "سنوات خبرة"  },
    { value: 50,  suffix: "+", label: isEn ? "Countries Served"  : "دولة مخدومة" },
    { value: 500, suffix: "+", label: isEn ? "Botanical Species" : "نوع نباتي"    },
    { value: 100, suffix: "%", label: isEn ? "Quality Certified" : "معتمد الجودة" },
  ];

  const features = [
    { icon: FiShield,  title: isEn ? "Premium Quality"  : "جودة متميزة",  desc: isEn ? "Lab-tested and certified to international phytosanitary standards." : "مختبرة ومعتمدة وفق المعايير الدولية." },
    { icon: FiGlobe,   title: isEn ? "Global Reach"     : "انتشار عالمي", desc: isEn ? "Exporting to 50+ countries across Europe, Asia & the Americas."     : "تصدير لأكثر من 50 دولة عبر العالم." },
    { icon: FiPackage, title: isEn ? "Custom Packaging" : "تعبئة مخصصة", desc: isEn ? "Flexible from 1kg retail packs to full container loads."             : "من عبوات 1 كجم حتى حاويات كاملة." },
    { icon: FiTruck,   title: isEn ? "Fast Shipping"    : "شحن سريع",     desc: isEn ? "Full documentation and on-time delivery guaranteed."                 : "توثيق كامل وتسليم في الوقت المحدد." },
  ];

  return (
    <Layout title={t.home.heroTitle}>

      {/* ══════════════════════════════════════════════════════
          §1  HERO — Pure Glassmorphism & Video
      ════════════════════════════════════════════════════ */}
      <section className={`relative min-h-screen flex flex-col justify-center overflow-hidden ${isEn ? "" : "rtl"}`}>
        
        {/* Full Screen Video Background */}
        <div className="absolute inset-0 z-0">
          <video src="/images/ORGANIC HERBS CO.mp4" autoPlay loop muted playsInline
            className="w-full h-full object-cover" />
          {/* Overlay to ensure text is ALWAYS readable regardless of light/dark mode */}
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto px-6 lg:px-12 pt-32 pb-20 w-full text-center flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-sm text-[11px] tracking-[0.2em] text-white uppercase font-bold">
              {page.heroBadge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-headline-lg text-[56px] md:text-[80px] lg:text-[100px] font-bold text-white leading-[1.05] tracking-tight mb-8 max-w-5xl"
          >
            {page.heroTitleLine1}<br />
            <span className="text-secondary">{page.heroTitleLine2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/80 text-[18px] md:text-[20px] leading-relaxed max-w-2xl mb-12 font-body-lg"
          >
            {page.heroDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 w-full sm:w-auto"
          >
            <Link href="/products"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-secondary text-on-secondary font-label-sm text-[13px] font-bold uppercase tracking-widest hover:bg-secondary-container hover:text-on-secondary-container transition-all duration-300 shadow-xl w-full sm:w-auto"
            >
              {t.home.heroCta}
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/about"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-white font-label-sm text-[13px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all duration-300 shadow-xl w-full sm:w-auto"
            >
              {page.discoverMore}
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="font-label-sm text-[9px] text-white/50 tracking-widest uppercase">Scroll</span>
          <FiChevronDown className="text-white/50 w-5 h-5" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  STATS BAR — Glassmorphism over background
      ════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-background overflow-hidden border-b border-outline-variant/30">
        <Orb className="w-[800px] h-[800px] bg-secondary/5 dark:bg-secondary/10 -top-[400px] left-1/2 -translate-x-1/2" />
        
        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 py-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="px-6 py-8 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg text-center hover:-translate-y-1 transition-transform duration-300">
                  <div className="font-headline-lg text-[40px] font-bold text-primary mb-2">
                    <CountUp target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest font-bold">
                    {s.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §3  CATEGORIES — Glassmorphic Grid
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-28 lg:py-40 overflow-hidden bg-background ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-secondary/10 dark:bg-secondary/15 -bottom-40 -right-40" />
        <Orb className="w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 top-20 -left-40" />

        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-4 font-bold">
                <span className="w-5 h-px bg-secondary inline-block" />
                {page.featuredBadge}
              </span>
              <h2 className="font-headline-lg text-[44px] md:text-[56px] font-bold text-primary tracking-tight leading-none">
                {t.products.title}
              </h2>
            </div>
            <Link href="/products"
              className="group inline-flex items-center gap-2 font-label-sm text-[12px] font-bold text-secondary hover:text-primary uppercase tracking-widest transition-colors shrink-0"
            >
              {isEn ? "View All Categories" : "عرض جميع الفئات"}
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>

          {navCategories.length > 0 && (
            <>
              <Reveal delay={0.08}>
                <div className="flex gap-2 mb-10 overflow-x-auto pb-4 flex-wrap">
                  {navCategories.slice(0, 6).map((cat, i) => (
                    <button key={cat.id} onClick={() => setActiveCategory(i)}
                      className={`px-6 py-3 rounded-full font-label-sm text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 shadow-sm backdrop-blur-md ${
                        activeCategory === i
                          ? "bg-secondary text-on-secondary shadow-lg border-secondary"
                          : "bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 text-on-surface-variant hover:border-secondary/50 hover:text-secondary"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </Reveal>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {navCategories.slice(0, 6).map((cat, i) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.id}`}
                      className={`group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                          i === activeCategory
                            ? "border border-secondary/50 shadow-xl"
                            : "border border-white/40 dark:border-white/10 hover:border-secondary/30"
                        }`}
                    >
                      <div className="p-8 h-full flex flex-col bg-white/60 dark:bg-white/5 backdrop-blur-2xl relative z-10">
                        <div className="flex items-start justify-between mb-8">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${
                            i === activeCategory
                              ? "bg-secondary text-on-secondary"
                              : "bg-white/80 dark:bg-white/10 text-secondary"
                          }`}>
                            <FiPackage className="w-6 h-6" />
                          </div>
                          <span className="font-data-tabular text-[13px] text-outline font-bold opacity-50">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className={`font-headline-md text-[26px] font-bold mb-4 transition-colors ${
                          i === activeCategory ? "text-secondary" : "text-primary group-hover:text-secondary"
                        }`}>
                          {cat.label}
                        </h3>
                        <p className="font-body-md text-[15px] text-on-surface-variant leading-relaxed flex-1 line-clamp-3">
                          {cat.desc || (isEn ? "Premium grade, export-certified botanical ingredients." : "مكونات نباتية متميزة معتمدة للتصدير.")}
                        </p>
                        <div className="mt-8 flex items-center gap-2 font-label-sm text-[12px] font-bold text-secondary uppercase tracking-widest">
                          {isEn ? "Explore" : "استكشف"}
                          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §4  WHY CHOOSE US — Frosted Glass Panel
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-28 lg:py-40 overflow-hidden bg-surface-container ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] h-[500px] bg-secondary/15 top-0 right-0" />
        <Orb className="w-[400px] h-[400px] bg-primary/10 bottom-0 left-0" />

        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <Reveal>
              <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-6 font-bold">
                <span className="w-5 h-px bg-secondary inline-block" />
                {page.formulaBadge}
              </span>
              <h2 className="font-headline-lg text-[44px] md:text-[56px] font-bold text-primary tracking-tight mb-8 leading-none">
                {t.home.whyChooseUs}
              </h2>
              <p className="font-body-lg text-[18px] text-on-surface-variant leading-relaxed mb-10">
                {page.formulaDescription}
              </p>

              <div className="space-y-4">
                {page.progressItems.map((item: any, idx: number) => (
                  <motion.div key={idx}
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="flex gap-5 items-start p-6 rounded-3xl bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 hover:border-secondary/40 transition-all duration-300 shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
                      <FiCheck className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-[18px] font-bold text-primary mb-2">
                        {item.title}
                      </h3>
                      <p className="font-body-sm text-[14px] text-on-surface-variant leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="relative">
                {/* Main image with glass overlay */}
                <div className="rounded-[40px] overflow-hidden aspect-[4/5] relative shadow-2xl border border-white/20 dark:border-white/10">
                  <img src="/images/lab.jpg" alt="Our Quality" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                </div>

                {/* Glassmorphic Floating Badge */}
                <motion.div
                  className="absolute -bottom-8 -left-8 rounded-3xl p-6 shadow-2xl bg-white/70 dark:bg-[#1c1c16]/70 backdrop-blur-2xl border border-white/50 dark:border-white/10 max-w-[220px]"
                  animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FiAward className="w-10 h-10 text-secondary mb-4 drop-shadow-md" />
                  <div className="font-headline-sm text-[22px] font-bold text-primary uppercase tracking-wider mb-1">
                    ISO 22000
                  </div>
                  <div className="font-body-sm text-[13px] text-on-surface-variant leading-tight">
                    Certified for international food safety and hygiene.
                  </div>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §5  HOW WE WORK — Glass Cards
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-28 lg:py-40 overflow-hidden bg-background ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-secondary/15 -top-48 left-1/2 -translate-x-1/2" />

        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-20">
            <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-4 font-bold">
              <span className="w-5 h-px bg-secondary inline-block" />
              {isEn ? "Our Advantages" : "مزاياتنا"}
            </span>
            <h2 className="font-headline-lg text-[44px] md:text-[56px] font-bold text-primary tracking-tight mb-4">
              {isEn ? "How We Work" : "كيف نعمل"}
            </h2>
            <p className="font-body-lg text-[18px] text-on-surface-variant max-w-xl mx-auto">
              {isEn
                ? "Every order meets the highest international export standards."
                : "كل طلب يلبي أعلى معايير التصدير الدولية."}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.3 }}
                  className="rounded-[32px] p-8 h-full bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 hover:border-secondary/40 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-secondary/15 flex items-center justify-center mb-8 shadow-inner">
                    <feat.icon className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="font-headline-sm text-[22px] font-bold text-primary mb-3">
                    {feat.title}
                  </h3>
                  <p className="font-body-sm text-[15px] text-on-surface-variant leading-relaxed">
                    {feat.desc}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §6  TESTIMONIALS
      ════════════════════════════════════════════════════ */}
      {testimonialItems.length > 0 && (
        <section className={`relative w-full py-28 lg:py-40 overflow-hidden bg-surface-container ${isEn ? "" : "rtl"}`}>
          <Orb className="w-[500px] h-[500px] bg-secondary/10 -bottom-40 -left-40" />

          <div className="max-w-[900px] mx-auto px-6 text-center relative z-10">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/10 border border-secondary/20 mb-8 backdrop-blur-sm">
                <FiStar className="w-4 h-4 text-secondary" />
                <span className="font-label-sm text-[11px] font-bold tracking-widest text-secondary uppercase">
                  {page.testimonialsBadge}
                </span>
              </div>
              <h2 className="font-headline-lg text-[44px] md:text-[56px] font-bold text-primary tracking-tight mb-16">
                {page.testimonialsTitle}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={30} slidesPerView={1} loop
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                pagination={{
                  clickable: true,
                  bulletClass: "swiper-pagination-bullet !w-2 !h-2 !bg-outline !opacity-40 !rounded-full transition-all",
                  bulletActiveClass: "!bg-secondary !opacity-100 !w-6",
                }}
                className="pb-16"
              >
                {testimonialItems.map((item: any, idx: number) => (
                  <SwiperSlide key={idx}>
                    <div className="rounded-[40px] bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/50 dark:border-white/10 p-10 lg:p-16 text-left shadow-2xl">
                      <div className="text-[60px] text-secondary/30 font-serif leading-none mb-6">"</div>
                      <p className="font-headline-sm text-[22px] md:text-[28px] leading-relaxed text-primary font-medium mb-10">
                        {item?.text_en ? (isEn ? item.text_en : item.text_ar) : item?.text}
                      </p>
                      <div className="flex items-center gap-5 border-t border-outline-variant/30 pt-8">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-secondary-container flex items-center justify-center font-bold text-on-secondary text-xl shadow-lg">
                          {item?.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-label-sm text-[15px] font-bold text-primary mb-1">{item?.name}</div>
                          <div className="font-body-sm text-[13px] text-on-surface-variant uppercase tracking-wider">{item?.role}</div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Reveal>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          §7  CTA — Clean Glassmorphism
      ════════════════════════════════════════════════════ */}
      <section className={`relative overflow-hidden py-28 lg:py-40 bg-background border-t border-outline-variant/30 ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-secondary/10 -top-40 -right-40" />
        <Orb className="w-[400px] h-[400px] bg-primary/5 -bottom-20 left-0" />
        
        <div className="max-w-[1000px] mx-auto px-6 text-center relative z-10">
          <Reveal>
            <div className="rounded-[40px] bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 p-12 lg:p-20 shadow-2xl">
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-secondary/20 bg-secondary/10 backdrop-blur-md mb-8"
                animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="font-label-sm text-[11px] font-bold tracking-widest text-secondary uppercase">
                  {isEn ? "Start Your Partnership" : "ابدأ شراكتك"}
                </span>
              </motion.div>

              <h2 className="font-headline-lg text-[48px] md:text-[68px] font-bold text-primary tracking-tight mb-8 leading-[1.05]">
                {isEn ? "Ready to Work Together?" : "جاهز للعمل معاً؟"}
              </h2>
              <p className="font-body-lg text-[18px] text-on-surface-variant max-w-xl mx-auto mb-14 leading-relaxed">
                {isEn
                  ? "Contact our export team and get a custom quote within 24 hours."
                  : "تواصل مع فريق التصدير واحصل على عرض سعر خلال 24 ساعة."}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link href="/contact"
                  className="group inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-secondary text-on-secondary font-label-sm text-[13px] font-bold uppercase tracking-widest hover:bg-secondary-container hover:text-on-secondary-container transition-all duration-300 shadow-xl w-full sm:w-auto"
                >
                  {isEn ? "Get a Free Quote" : "احصل على عرض مجاني"}
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/products"
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-white/80 dark:bg-white/10 border border-white/40 dark:border-white/20 text-primary font-label-sm text-[13px] font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-sm w-full sm:w-auto"
                >
                  {isEn ? "Browse Products" : "تصفح المنتجات"}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </Layout>
  );
};

export default Home;
