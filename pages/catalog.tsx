import { useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { motion, useInView } from 'framer-motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import { getAssetUrl } from '@/lib/api';
import { FiDownload, FiFileText, FiEye, FiRefreshCw } from 'react-icons/fi';
import { useApi, Catalog } from '@/hooks/useApi';

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

const CatalogPage = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.catalogPage;
  const isEn = language === 'en';
  
  const { catalogs, loading: apiLoading, errors, fetchCatalogs } = useApi();
  const loading = apiLoading.catalogs;
  const error = errors.catalogs;

  useEffect(() => {
    if (catalogs.length === 0) {
      fetchCatalogs();
    }
  }, [catalogs.length]);

  return (
    <Layout title={t.nav.catalog}>
      {/* ══════════════════════════════════════════════════════
          §1  HERO — Glassmorphism & Image Overlay
      ════════════════════════════════════════════════════ */}
      <section className={`relative h-[50vh] min-h-[450px] flex flex-col justify-center overflow-hidden ${isEn ? "" : "rtl"}`}>
        <div className="absolute inset-0 z-0">
          <img src="/images/1.jpg" alt="Product Catalog" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 max-w-[1240px] mx-auto px-6 lg:px-12 w-full text-center flex flex-col items-center mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-sm text-[11px] tracking-[0.2em] text-white uppercase font-bold">{page.heroBadge}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} className="font-headline-lg text-[48px] md:text-[80px] font-bold text-white tracking-tight mb-6">{t.catalog.title}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-white/80 text-[18px] md:text-[22px] leading-relaxed max-w-2xl font-body-lg">{t.catalog.subtitle}</motion.p>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  CATALOG LIST — Frosted Glass Grid
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-background py-28 lg:py-40 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[800px] h-[800px] bg-secondary/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-[1360px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col gap-16">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-60">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-[40px] bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-lg flex flex-col h-[500px] animate-pulse">
                  <div className="h-64 bg-black/5 dark:bg-white/10 rounded-t-[40px]" />
                  <div className="p-8 flex flex-col gap-4 flex-grow">
                    <div className="h-4 w-1/3 bg-black/5 dark:bg-white/10 rounded-full" />
                    <div className="h-8 w-3/4 bg-black/5 dark:bg-white/10 rounded-xl" />
                    <div className="h-4 w-full bg-black/5 dark:bg-white/10 rounded-md" />
                    <div className="h-4 w-5/6 bg-black/5 dark:bg-white/10 rounded-md" />
                    <div className="mt-auto h-14 w-full bg-black/5 dark:bg-white/10 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[48px] bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-2xl max-w-lg mx-auto text-center p-16">
              <div className="w-20 h-20 mx-auto mb-8 bg-error/10 rounded-3xl flex items-center justify-center text-error">
                <FiFileText className="w-10 h-10" />
              </div>
              <p className="font-headline-sm text-[28px] font-bold text-primary mb-4">{t.common.error}</p>
              <button
                onClick={fetchCatalogs}
                className="inline-flex items-center gap-3 font-label-sm text-[12px] font-bold px-10 py-5 rounded-full bg-primary text-surface hover:bg-secondary uppercase tracking-widest transition-all duration-300 shadow-lg"
              >
                <FiRefreshCw className="w-5 h-5" />
                {isEn ? "Retry" : "إعادة المحاولة"}
              </button>
            </div>
          ) : catalogs.length === 0 ? (
            <div className="rounded-[48px] bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-2xl max-w-lg mx-auto text-center p-16">
              <p className="font-headline-sm text-[28px] font-bold text-primary mb-4">{t.common.noData}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {catalogs.map((catalog, index) => (
                <Reveal key={catalog.id} delay={index * 0.1} className="h-full">
                  <div className="rounded-[40px] bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-xl flex flex-col h-full group overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:border-secondary/40 transition-all duration-500 relative">
                    
                    {/* Top Image Area */}
                    <div className="h-72 bg-surface-container relative overflow-hidden shrink-0">
                      {catalog.image ? (
                        <img src={getAssetUrl(catalog.image)} alt={isEn ? catalog.title_en : catalog.title_ar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary/40 group-hover:text-secondary transition-colors duration-500">
                          <FiFileText className="w-20 h-20" />
                        </div>
                      )}
                      
                      {/* Hover Overlay */}
                      {catalog.file && (
                        <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                          <a href={getAssetUrl(catalog.file)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-surface-container-lowest text-primary font-bold text-sm rounded-full shadow-lg transition-transform duration-300 hover:scale-105">
                            <FiDownload className="text-lg" />
                            {isEn ? "Download PDF" : "تحميل PDF"}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Bottom Info Area */}
                    <div className="p-8 flex flex-col flex-grow relative z-10 bg-gradient-to-b from-white/10 to-transparent">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-label-sm text-[10px] text-secondary bg-secondary/10 px-3 py-1 rounded-sm uppercase tracking-widest font-bold">
                          {catalog.version ? `${isEn ? "Version" : "الإصدار"} ${catalog.version}` : (isEn ? "Guide" : "دليل")}
                        </span>
                        <span className="font-label-sm text-[10px] font-bold text-outline-variant uppercase tracking-[0.2em]">PDF</span>
                      </div>
                      
                      <h3 className="font-headline-sm text-[26px] font-bold text-primary tracking-tight mb-3 transition-colors duration-300">
                        {isEn ? catalog.title_en : catalog.title_ar}
                      </h3>
                      <p className="font-body-md text-[16px] text-on-surface-variant leading-relaxed mb-8 flex-grow">
                        {isEn ? catalog.description_en : catalog.description_ar}
                      </p>
                      
                      {catalog.file && (
                        <a href={getAssetUrl(catalog.file)} target="_blank" rel="noopener noreferrer" className="mt-auto w-full inline-flex items-center justify-center gap-3 font-label-sm text-[13px] font-bold px-8 py-4 rounded-full bg-surface-container-high text-on-surface hover:bg-primary hover:text-surface uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md">
                          <FiDownload className="w-4 h-4" />
                          {isEn ? "Download Catalog" : "تحميل الكتالوج"}
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

    </Layout>
  );
};

export default CatalogPage;