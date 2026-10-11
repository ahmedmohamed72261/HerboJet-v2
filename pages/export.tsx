import { useRef } from 'react';
import Layout from '@/components/Layout';
import { motion, useInView } from 'framer-motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import { FiCheckCircle, FiGlobe, FiPackage, FiTruck, FiShield, FiFileText } from 'react-icons/fi';

/* ── Floating orb for Glassmorphism ────────────────────────── */
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[80px] pointer-events-none ${className}`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ── Scroll-triggered reveal ───────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string; }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

const Export = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const isEn = language === 'en';

  const page = {
    heroBadge: isEn ? "Global Export Services" : "خدمات التصدير العالمية",
    title: isEn ? "Export & Logistics" : "التصدير والخدمات اللوجستية",
    heroDescription: isEn ? "Seamless global delivery of premium botanical ingredients, supported by rigorous quality control and comprehensive documentation." : "توصيل عالمي سلس للمكونات النباتية الفاخرة، مدعوم بمراقبة جودة صارمة وتوثيق شامل.",
    processTitle: isEn ? "Our Export Process" : "عملية التصدير لدينا",
    capabilitiesBadge: isEn ? "Global Reach" : "الوصول العالمي",
    capabilitiesTitle: isEn ? "Export Capabilities" : "قدرات التصدير",
    capabilitiesList: isEn ? [
      "FCL and LCL shipping options",
      "Air freight for urgent orders",
      "Customs clearance support",
      "Full phytosanitary documentation"
    ] : [
      "خيارات شحن FCL و LCL",
      "شحن جوي للطلبات العاجلة",
      "دعم التخليص الجمركي",
      "وثائق صحية نباتية كاملة"
    ]
  };

  const steps = [
    { icon: FiGlobe, title: isEn ? "Global Sourcing" : "مصادر عالمية", desc: isEn ? "We source the finest botanicals directly from trusted farms." : "نستورد أفضل النباتات مباشرة من مزارع موثوقة." },
    { icon: FiShield, title: isEn ? "Quality Assurance" : "ضمان الجودة", desc: isEn ? "Rigorous lab testing ensures international compliance." : "اختبارات معملية صارمة لضمان الامتثال الدولي." },
    { icon: FiPackage, title: isEn ? "Custom Packaging" : "تعبئة مخصصة", desc: isEn ? "From retail packs to bulk containers, packed to your specs." : "من عبوات التجزئة إلى حاويات الجملة، معبأة حسب مواصفاتك." },
    { icon: FiFileText, title: isEn ? "Documentation" : "التوثيق", desc: isEn ? "We handle all phytosanitary and customs documentation." : "نتعامل مع جميع الوثائق الجمركية والصحية النباتية." },
    { icon: FiTruck, title: isEn ? "Logistics" : "الخدمات اللوجستية", desc: isEn ? "Fast, reliable global shipping by sea, air, or land." : "شحن عالمي سريع وموثوق بحرًا وجوًا وبرًا." },
    { icon: FiCheckCircle, title: isEn ? "Delivery" : "التسليم", desc: isEn ? "On-time arrival with full tracking and support." : "وصول في الوقت المحدد مع تتبع كامل ودعم." }
  ];

  return (
    <Layout title={t.nav.export}>
      {/* ══════════════════════════════════════════════════════
          §1  HERO — Glassmorphism & Image Overlay
      ════════════════════════════════════════════════════ */}
      <section className={`relative h-[60vh] min-h-[500px] flex flex-col justify-center overflow-hidden ${isEn ? "" : "rtl"}`}>
        <div className="absolute inset-0 z-0">
          <img src="/images/agriculture-healthy-food.jpg" alt="Export Services" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 max-w-[1240px] mx-auto px-6 lg:px-12 w-full text-center flex flex-col items-center mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-sm text-[11px] tracking-[0.2em] text-white uppercase font-bold">{page.heroBadge}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} className="font-headline-lg text-[48px] md:text-[80px] font-bold text-white tracking-tight mb-6">{page.title}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-white/80 text-[18px] md:text-[22px] leading-relaxed max-w-3xl font-body-lg">{page.heroDescription}</motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  EXPORT PROCESS — Frosted Glass Steps
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-background py-28 lg:py-40 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[800px] h-[800px] bg-secondary/10 top-20 right-0" />
        <Orb className="w-[600px] h-[600px] bg-primary/5 bottom-0 left-0" />

        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-20">
            <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-4 font-bold">
              <span className="w-5 h-px bg-secondary inline-block" />
              {isEn ? "How it works" : "كيف نعمل"}
            </span>
            <h2 className="font-headline-lg text-[44px] md:text-[56px] font-bold text-primary tracking-tight mb-6">{page.processTitle}</h2>
            <p className="font-body-lg text-[18px] text-on-surface-variant max-w-2xl mx-auto leading-relaxed">{isEn ? "Our streamlined export process guarantees the safe, timely, and compliant delivery of our premium botanical ingredients anywhere in the world." : "تضمن عملية التصدير المبسطة لدينا تسليم آمن وفي الوقت المناسب ومطابق للمعايير."}</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-10 rounded-[32px] bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-secondary/30 transition-all duration-300 h-full relative group overflow-hidden">
                  <div className="absolute top-0 right-0 font-headline-lg text-[120px] text-surface-container font-bold opacity-30 group-hover:text-secondary/10 transition-colors pointer-events-none -mt-8 -mr-4">
                    {i + 1}
                  </div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/15 flex items-center justify-center mb-8 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors shadow-inner">
                      <step.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-headline-sm text-[26px] font-bold text-primary mb-4">{step.title}</h3>
                    <p className="font-body-md text-[16px] text-on-surface-variant leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §3  CAPABILITIES — Split Glass Panel
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full border-t border-outline-variant/30 bg-surface-container py-28 lg:py-40 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] h-[500px] bg-white/10 dark:bg-black/10 top-0 left-0" />
        
        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <Reveal>
              <div className="relative">
                <div className="rounded-[40px] overflow-hidden aspect-[4/3] shadow-2xl border border-white/20 dark:border-white/10 relative">
                  <img src="/images/lab.jpg" alt="Packaging" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 to-transparent pointer-events-none" />
                </div>
                {/* Floating Glass Stats */}
                <motion.div className="absolute -bottom-8 -right-8 z-20 rounded-3xl p-8 shadow-2xl bg-white/80 dark:bg-white/10 backdrop-blur-2xl border border-white/50 dark:border-white/20 hidden md:block" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                  <div className="font-headline-lg text-[40px] font-bold text-secondary mb-1">50+</div>
                  <div className="font-label-sm text-[12px] text-primary uppercase font-bold tracking-widest">{isEn ? "Countries Served" : "دولة مخدومة"}</div>
                </motion.div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-6 font-bold">
                <span className="w-5 h-px bg-secondary inline-block" />
                {page.capabilitiesBadge}
              </span>
              <h2 className="font-headline-lg text-[44px] md:text-[56px] font-bold text-primary tracking-tight mb-8 leading-none">
                {page.capabilitiesTitle}
              </h2>
              <div className="space-y-6">
                {page.capabilitiesList.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-4 p-6 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-sm hover:border-secondary/40 transition-colors">
                    <FiCheckCircle className="w-6 h-6 text-secondary shrink-0 mt-1" />
                    <p className="font-body-lg text-[17px] text-on-surface-variant leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Export;