import { useEffect, useRef, useState } from 'react';
import Layout from '@/components/Layout';
import { motion, useInView } from 'framer-motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import { FiTarget, FiEye, FiHeart, FiCheck, FiAward, FiGlobe, FiShield } from 'react-icons/fi';

/* ── Animated counter ──────────────────────────────────────── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / (2500 / 16));
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

const About = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.aboutPage;
  const isEn = language === 'en';

  const stats = [
    { number: 25, label: isEn ? "Years Experience" : "سنوات خبرة", suffix: "+" },
    { number: 500, label: isEn ? "Premium Products" : "منتجات فاخرة", suffix: "+" },
    { number: 50, label: isEn ? "Global Markets" : "أسواق عالمية", suffix: "+" },
    { number: 100, label: isEn ? "Client Satisfaction" : "رضا العملاء", suffix: "%" },
  ];

  return (
    <Layout title={t.about.title}>
      
      {/* ══════════════════════════════════════════════════════
          §1  HERO — Glassmorphism & Image Overlay
      ════════════════════════════════════════════════════ */}
      <section className={`relative h-[65vh] min-h-[500px] sm:min-h-[600px] flex flex-col justify-center overflow-hidden ${isEn ? "" : "rtl"}`}>
        <div className="absolute inset-0 z-0">
          <img src="/images/about.jpg" alt="About HerboJet" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-12 w-full text-center flex flex-col items-center mt-12 sm:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 mb-5 sm:mb-8 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-label-sm text-[10px] sm:text-[11px] tracking-[0.2em] text-white uppercase font-bold">
              {page.heroBadge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-headline-lg text-[32px] sm:text-[56px] md:text-[80px] font-bold text-white leading-[1.1] sm:leading-[1.05] tracking-tight mb-4 sm:mb-6 max-w-4xl"
          >
            {t.about.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/80 text-[15px] sm:text-[18px] md:text-[22px] leading-relaxed max-w-2xl font-body-lg"
          >
            {isEn ? "Pioneering the export of premium botanical ingredients with an unwavering commitment to quality and purity." : "ريادة في تصدير المكونات النباتية الفاخرة مع التزام راسخ بالجودة والنقاء."}
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  OUR STORY — Glassmorphism Split
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-16 sm:py-28 lg:py-40 overflow-hidden bg-background ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-secondary/15 top-0 left-0" />
        <Orb className="w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-primary/10 bottom-0 right-0" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
            
            <Reveal>
              <div className="relative">
                <div className="rounded-[28px] sm:rounded-[40px] overflow-hidden aspect-[4/5] relative shadow-2xl border border-white/20 dark:border-white/10 z-10">
                  <img src="/images/lab.jpg" alt="Our Quality" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                </div>
                {/* Floating Glass Card */}
                <motion.div
                  className="absolute -bottom-10 -right-10 z-20 rounded-3xl p-8 shadow-2xl bg-white/70 dark:bg-white/10 backdrop-blur-2xl border border-white/50 dark:border-white/20 max-w-[260px] hidden md:block"
                  animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FiGlobe className="w-10 h-10 text-secondary mb-4 drop-shadow-md" />
                  <div className="font-headline-sm text-[22px] font-bold text-primary mb-2">Global Leader</div>
                  <div className="font-body-sm text-[14px] text-on-surface-variant leading-relaxed">Trusted by top manufacturers worldwide.</div>
                </motion.div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-4 sm:mb-6 font-bold">
                <span className="w-5 h-px bg-secondary inline-block" />
                {page.storyBadge}
              </span>
              <h2 className="font-headline-lg text-[28px] sm:text-[44px] md:text-[56px] font-bold text-primary tracking-tight mb-5 sm:mb-8 leading-tight sm:leading-none">
                {isEn ? "Rooted in Quality, Growing Globally." : "جذور في الجودة، ونمو عالمي."}
              </h2>
              
              <div className="p-5 sm:p-8 rounded-2xl sm:rounded-[32px] bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg">
                <p className="font-body-lg text-[15px] sm:text-[17px] text-on-surface-variant leading-relaxed mb-4 sm:mb-6">
                  {page.storyDescriptionOne}
                </p>
                <p className="font-body-lg text-[15px] sm:text-[17px] text-on-surface-variant leading-relaxed">
                  {page.storyDescriptionTwo}
                </p>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §3  STATS — Frosted Glass Cards
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-12 sm:py-20 overflow-hidden bg-surface-container ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-secondary/5 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
        
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="px-3 py-6 sm:px-6 sm:py-10 rounded-2xl sm:rounded-[32px] bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-xl text-center hover:-translate-y-2 transition-transform duration-300">
                  <div className="font-headline-lg text-[32px] sm:text-[48px] md:text-[56px] font-bold text-secondary mb-1 sm:mb-3 flex items-center justify-center">
                    <CountUp target={stat.number} suffix={stat.suffix} />
                  </div>
                  <div className="font-label-sm text-[10px] sm:text-[12px] text-primary uppercase tracking-wider sm:tracking-widest font-bold">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §4  MISSION, VISION, VALUES — Premium Grid
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-16 sm:py-28 lg:py-40 overflow-hidden bg-background ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-primary/10 top-0 right-0" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-10 sm:mb-20">
            <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-3 font-bold">
              <span className="w-5 h-px bg-secondary inline-block" />
              {page.philosophyBadge}
            </span>
            <h2 className="font-headline-lg text-[28px] sm:text-[44px] md:text-[56px] font-bold text-primary tracking-tight">
              {page.philosophyTitle}
            </h2>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            
            {/* Mission */}
            <Reveal delay={0.1}>
              <div className="p-6 sm:p-10 h-full rounded-2xl sm:rounded-[32px] bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-secondary/30 transition-all duration-300 group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-secondary/15 flex items-center justify-center mb-5 sm:mb-8 shadow-inner group-hover:bg-secondary group-hover:text-white transition-colors text-secondary">
                  <FiTarget className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-headline-sm text-[20px] sm:text-[26px] font-bold text-primary mb-3 sm:mb-4">
                  {t.about.mission}
                </h3>
                <p className="font-body-md text-[14px] sm:text-[16px] text-on-surface-variant leading-relaxed">
                  {page.missionDescription}
                </p>
              </div>
            </Reveal>

            {/* Vision */}
            <Reveal delay={0.2}>
              <div className="p-6 sm:p-10 h-full rounded-2xl sm:rounded-[32px] bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-secondary/30 transition-all duration-300 group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-5 sm:mb-8 shadow-inner group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                  <FiEye className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-headline-sm text-[20px] sm:text-[26px] font-bold text-primary mb-3 sm:mb-4">
                  {t.about.vision}
                </h3>
                <p className="font-body-md text-[14px] sm:text-[16px] text-on-surface-variant leading-relaxed">
                  {page.visionDescription}
                </p>
              </div>
            </Reveal>

            {/* Values */}
            <Reveal delay={0.3}>
              <div className="p-6 sm:p-10 h-full rounded-2xl sm:rounded-[32px] bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-secondary/30 transition-all duration-300 group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-secondary/15 flex items-center justify-center mb-5 sm:mb-8 shadow-inner group-hover:bg-secondary group-hover:text-white transition-colors text-secondary">
                  <FiHeart className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-headline-sm text-[20px] sm:text-[26px] font-bold text-primary mb-3 sm:mb-4">
                  {page.valuesTitle}
                </h3>
                <p className="font-body-md text-[14px] sm:text-[16px] text-on-surface-variant leading-relaxed">
                  {page.valuesDescription}
                </p>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §5  WHY CHOOSE US — Fully Responsive Layout
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full border-t border-outline-variant/30 bg-surface-container py-16 sm:py-28 lg:py-40 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-white/10 dark:bg-black/10 -bottom-20 left-10" />
        
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center relative z-10 mb-10 sm:mb-20">
          <Reveal>
            <span className="font-label-sm text-[11px] sm:text-[12px] tracking-widest text-secondary uppercase block mb-3 font-bold">
              {isEn ? "Excellence Guaranteed" : "التميز مضمون"}
            </span>
            <h2 className="font-headline-lg text-[26px] sm:text-[44px] md:text-[56px] font-bold text-primary tracking-tight mb-4 sm:mb-8 leading-tight">
              {page.whyChooseUsTitle}
            </h2>
            <div className="font-body-lg text-[15px] sm:text-[18px] text-on-surface-variant leading-relaxed">
              {page.whyChooseUsIntro}
            </div>
          </Reveal>
        </div>

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {page.whyChooseUsSections.map((section: any, i: number) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-lg hover:border-secondary/40 transition-colors h-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl sm:rounded-full bg-secondary/10 flex items-center justify-center font-headline-sm text-secondary font-bold text-lg sm:text-xl">
                    0{i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline-sm text-[18px] sm:text-[22px] font-bold text-primary mb-2 sm:mb-3">
                      {section.title}
                    </h3>
                    <p className="font-body-sm text-[14px] sm:text-[15px] text-on-surface-variant leading-relaxed">
                      {section.body}
                    </p>
                    {/* Quality Certifications Grid */}
                    {i === 1 && (
                      <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                        {page.certifications.map((cert: string, j: number) => (
                          <div key={j} className="flex items-center gap-2 font-label-sm text-[12px] text-primary font-bold bg-white/40 dark:bg-white/5 px-3 py-1.5 rounded-lg sm:bg-transparent sm:p-0">
                            <FiAward className="text-secondary w-4 h-4 shrink-0" />
                            <span className="truncate">{cert}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default About;

