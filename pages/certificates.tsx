import { useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { motion, useInView } from 'framer-motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import { getAssetUrl } from '@/lib/api';
import { FiAward, FiShield, FiCheckCircle } from 'react-icons/fi';
import { useApi } from '@/hooks/useApi';

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

const Certificates = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.certificatesPage;
  const isEn = language === 'en';

  const { certificates, loading: apiLoading, fetchCertificates } = useApi();
  const loading = apiLoading.certificates;

  useEffect(() => {
    if (certificates.length === 0) {
      fetchCertificates();
    }
  }, [certificates.length]);

  return (
    <Layout title={t.nav.certificates}>
      {/* ══════════════════════════════════════════════════════
          §1  HERO — Glassmorphism & Image Overlay
      ════════════════════════════════════════════════════ */}
      <section className={`relative h-[60vh] min-h-[500px] flex flex-col justify-center overflow-hidden ${isEn ? "" : "rtl"}`}>
        <div className="absolute inset-0 z-0">
          <img src="/images/lab.jpg" alt="Certifications" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 max-w-[1240px] mx-auto px-6 lg:px-12 w-full text-center flex flex-col items-center mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-sm text-[11px] tracking-[0.2em] text-white uppercase font-bold">{page.heroBadge}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} className="font-headline-lg text-[48px] md:text-[80px] font-bold text-white tracking-tight mb-6">{t.certificates.title}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-white/80 text-[18px] md:text-[22px] leading-relaxed max-w-2xl font-body-lg">{t.certificates.subtitle}</motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  CERTIFICATES GRID — Frosted Glass Cards
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-background py-28 lg:py-40 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[800px] h-[800px] bg-secondary/10 top-0 right-0" />
        <Orb className="w-[600px] h-[600px] bg-primary/5 bottom-0 left-0" />

        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-20">
            <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-4 font-bold">
              <span className="w-5 h-px bg-secondary inline-block" />
              {isEn ? "Global Standards" : "معايير عالمية"}
            </span>
            <h2 className="font-headline-lg text-[44px] md:text-[56px] font-bold text-primary tracking-tight mb-6">{isEn ? "International Certifications" : "الشهادات الدولية"}</h2>
            <p className="font-body-lg text-[18px] text-on-surface-variant max-w-2xl mx-auto leading-relaxed">{isEn ? "Our commitment to quality is validated by internationally recognized certifications." : "التزامنا بالجودة معتمد من خلال شهادات معترف بها دوليًا."}</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              [1, 2].map(i => (
                <div key={i} className="p-8 md:p-12 rounded-[40px] bg-white/40 dark:bg-white/5 border border-white/20 h-[240px] animate-pulse" />
              ))
            ) : certificates.map((cert, i) => {
              const icons = [FiAward, FiShield, FiCheckCircle];
              const Icon = icons[i % icons.length];
              return (
                <Reveal key={cert.id} delay={i * 0.1}>
                  <div className="p-8 md:p-12 rounded-[40px] bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-2xl hover:border-secondary/30 hover:-translate-y-2 transition-all duration-300 flex flex-col md:flex-row items-center md:items-start text-center md:text-start gap-8 group">
                    
                    {cert.image ? (
                      <div className="w-24 h-24 shrink-0 rounded-full bg-surface-container overflow-hidden border border-outline-variant shadow-inner">
                        <img src={getAssetUrl(cert.image)} alt="Cert" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 shrink-0 rounded-full bg-surface-container flex items-center justify-center text-secondary border border-outline-variant group-hover:bg-secondary group-hover:text-white transition-colors shadow-inner">
                        <Icon className="w-10 h-10" />
                      </div>
                    )}

                    <div>
                      <h3 className="font-headline-md text-[32px] font-bold text-primary mb-3">{isEn ? cert.title_en : cert.title_ar}</h3>
                      <p className="font-body-md text-[17px] text-on-surface-variant leading-relaxed mb-6">{isEn ? cert.description_en : cert.description_ar}</p>
                      <div className="inline-flex items-center gap-2 font-label-sm text-[12px] font-bold text-secondary uppercase tracking-widest">
                        <FiCheckCircle className="w-4 h-4" />
                        {isEn ? "Verified Active" : "نشط وموثق"}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Certificates;