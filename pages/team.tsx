import { useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { motion, useInView } from 'framer-motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import { getAssetUrl } from '@/lib/api';
import { FiUsers, FiAward, FiMail, FiLinkedin } from 'react-icons/fi';
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

const Team = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.teamPage;
  const isEn = language === 'en';
  
  const { teamMembers, loading: apiLoading, fetchTeamMembers } = useApi();
  const loading = apiLoading.teamMembers;

  useEffect(() => {
    if (teamMembers.length === 0) {
      fetchTeamMembers();
    }
  }, [teamMembers.length]);

  return (
    <Layout title={t.nav.team}>
      {/* ══════════════════════════════════════════════════════
          §1  HERO — Glassmorphism & Image Overlay
      ════════════════════════════════════════════════════ */}
      <section className={`relative h-[60vh] min-h-[500px] flex flex-col justify-center overflow-hidden ${isEn ? "" : "rtl"}`}>
        <div className="absolute inset-0 z-0">
          <img src="/images/about.jpg" alt="Our Team" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 max-w-[1240px] mx-auto px-6 lg:px-12 w-full text-center flex flex-col items-center mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-sm text-[11px] tracking-[0.2em] text-white uppercase font-bold">{page.heroBadge}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} className="font-headline-lg text-[48px] md:text-[80px] font-bold text-white tracking-tight mb-6">{t.team.title}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-white/80 text-[18px] md:text-[22px] leading-relaxed max-w-2xl font-body-lg">{t.team.subtitle}</motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  DYNAMIC TEAM MEMBERS — Frosted Glass Grid
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-background py-28 lg:py-40 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[800px] h-[800px] bg-secondary/10 top-0 left-0" />
        <Orb className="w-[600px] h-[600px] bg-primary/5 bottom-0 right-0" />

        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {/* Lead Story / Description Panel */}
            <div className="lg:col-span-2">
              <Reveal>
                <div className="p-10 md:p-14 h-full rounded-[40px] bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="w-20 h-20 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mb-10 shadow-inner">
                    <FiUsers className="w-10 h-10" />
                  </div>
                  <h2 className="font-headline-lg text-[36px] md:text-[48px] font-bold text-primary tracking-tight mb-8">
                    {isEn ? "Our Agricultural & Export Experts" : "خبراء الزراعة والتصدير لدينا"}
                  </h2>
                  <div className="font-body-lg text-[18px] text-on-surface-variant leading-relaxed max-w-2xl space-y-6">
                    <p>{isEn ? "Together, we share a singular vision: to cultivate and deliver the finest organic herbs while empowering our local farming communities." : "معًا، نتشارك رؤية واحدة: زراعة وتقديم أفضل الأعشاب العضوية مع تمكين مجتمعاتنا الزراعية المحلية."}</p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Side Stat Panel */}
            <div className="lg:col-span-1">
              <Reveal delay={0.2}>
                <div className="p-10 h-full rounded-[40px] bg-primary text-surface backdrop-blur-2xl border border-primary-container shadow-2xl relative overflow-hidden flex flex-col justify-center">
                  <div className="absolute top-0 right-0 p-8 opacity-20"><FiAward className="w-32 h-32" /></div>
                  <div className="relative z-10">
                    <div className="font-headline-lg text-[80px] font-bold text-secondary mb-2">25+</div>
                    <h3 className="font-headline-sm text-[24px] font-bold mb-4">{isEn ? "Years of Combined Experience" : "سنوات من الخبرة المتراكمة"}</h3>
                    <p className="font-body-sm text-[15px] opacity-80 leading-relaxed">
                      {isEn ? "Our leadership team brings decades of agricultural and export expertise to every shipment." : "يجلب فريق القيادة لدينا عقودًا من الخبرة الزراعية والتصديرية لكل شحنة."}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Dynamic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1,2,3].map((i) => (
                <div key={i} className="p-10 rounded-[32px] bg-white/40 dark:bg-white/5 border border-white/20 h-[400px] animate-pulse" />
              ))
            ) : teamMembers.map((member, i) => (
              <Reveal key={member.id} delay={i * 0.1}>
                <div className="p-10 rounded-[40px] bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group">
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border border-white/40 shadow-inner">
                    {member.image ? (
                      <img src={getAssetUrl(member.image)} alt={isEn ? member.name_en : member.name_ar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-surface-container flex items-center justify-center"><FiUsers className="w-8 h-8 text-primary/50" /></div>
                    )}
                  </div>
                  
                  <h3 className="font-headline-sm text-[26px] font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                    {isEn ? member.name_en : member.name_ar}
                  </h3>
                  <div className="mb-6">
                    <span className="inline-block px-4 py-1.5 bg-secondary/15 text-secondary rounded-full font-label-sm text-[11px] font-bold uppercase tracking-widest">
                      {isEn ? member.position_en : member.position_ar}
                    </span>
                  </div>
                  <p className="font-body-md text-[16px] text-on-surface-variant leading-relaxed flex-grow">
                    {isEn ? member.bio_en : member.bio_ar}
                  </p>
                  
                  {/* Social Links */}
                  <div className="flex items-center gap-4 pt-8 mt-auto border-t border-outline-variant/30">
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="w-12 h-12 rounded-full bg-white/80 dark:bg-white/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-white/40 dark:border-white/10">
                        <FiMail className="w-5 h-5" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/80 dark:bg-white/10 hover:bg-[#0A66C2] text-primary hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-white/40 dark:border-white/10">
                        <FiLinkedin className="w-5 h-5" />
                      </a>
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

export default Team;