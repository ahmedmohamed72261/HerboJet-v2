import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import { motion, useInView } from 'framer-motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import { getAssetUrl } from '@/lib/api';
import { FiMapPin, FiPhone, FiMail, FiSend, FiMessageSquare } from 'react-icons/fi';
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

const Contact = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.contactPage;
  const isEn = language === 'en';
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => setFormStatus('success'), 1500);
  };

  const contactMethods = [
    { icon: FiMapPin, title: isEn ? "Visit Us" : "زورونا", content: t.contact.addressFull },
    { icon: FiPhone, title: isEn ? "Call Us" : "اتصل بنا", content: "+201017409241" },
    { icon: FiMail, title: isEn ? "Email Us" : "راسلنا", content: "sales@herbojet.com" }
  ];

  const { exportCountries: countries, fetchExportCountries } = useApi();

  useEffect(() => {
    if (countries.length === 0) {
      fetchExportCountries();
    }
  }, [countries.length]);

  return (
    <Layout title={t.contact.title}>
      {/* ══════════════════════════════════════════════════════
          §1  HERO — Glassmorphism & Image Overlay
      ════════════════════════════════════════════════════ */}
      <section className={`relative h-[50vh] min-h-[450px] flex flex-col justify-center overflow-hidden ${isEn ? "" : "rtl"}`}>
        <div className="absolute inset-0 z-0">
          <img src="/images/hero-section.jpg" alt="Contact Us" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 max-w-[1240px] mx-auto px-6 lg:px-12 w-full text-center flex flex-col items-center mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-sm text-[11px] tracking-[0.2em] text-white uppercase font-bold">{page.heroBadge}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} className="font-headline-lg text-[48px] md:text-[80px] font-bold text-white tracking-tight mb-6">{t.contact.title}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-white/80 text-[18px] md:text-[22px] leading-relaxed max-w-2xl font-body-lg">{t.contact.subtitle}</motion.p>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  CONTACT INFO & FORM — Frosted Glass
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-background py-20 lg:py-32 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-secondary/10 top-0 left-0" />
        <Orb className="w-[500px] h-[500px] bg-primary/10 bottom-0 right-0" />

        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Contact Information (Left) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <Reveal>
                <div className="mb-8">
                  <h2 className="font-headline-lg text-[36px] font-bold text-primary mb-4 tracking-tight">{isEn ? "Get In Touch" : "تواصل معنا"}</h2>
                  <p className="font-body-md text-[16px] text-on-surface-variant leading-relaxed">{isEn ? "Whether you need a custom quote, have a question about our export process, or just want to say hello, we are ready to answer all your inquiries." : "سواء كنت بحاجة لعرض سعر مخصص، أو لديك سؤال حول عملية التصدير، نحن مستعدون للإجابة على جميع استفساراتك."}</p>
                </div>
              </Reveal>
              
              {contactMethods.map((method, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="p-8 rounded-[32px] bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-2xl hover:border-secondary/30 transition-all duration-300 flex items-start gap-5">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary shadow-inner">
                      <method.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-[20px] font-bold text-primary mb-2">{method.title}</h3>
                      <p className="font-body-sm text-[15px] text-on-surface-variant leading-relaxed whitespace-pre-line">{method.content}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Contact Form (Right) */}
            <div className="lg:col-span-7">
              <Reveal delay={0.2}>
                <div className="p-8 md:p-12 rounded-[40px] bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary"><FiMessageSquare className="w-5 h-5" /></div>
                    <h3 className="font-headline-sm text-[28px] font-bold text-primary">{isEn ? "Send an Inquiry" : "إرسال استفسار"}</h3>
                  </div>

                  {formStatus === 'success' ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-10 text-center rounded-[32px] bg-secondary/10 border border-secondary/30">
                      <div className="w-20 h-20 mx-auto rounded-full bg-secondary text-white flex items-center justify-center mb-6 shadow-xl"><FiSend className="w-8 h-8" /></div>
                      <h4 className="font-headline-sm text-[24px] font-bold text-primary mb-2">{isEn ? "Message Sent!" : "تم إرسال الرسالة!"}</h4>
                      <p className="font-body-md text-on-surface-variant">{isEn ? "Thank you for reaching out. Our team will get back to you within 24 hours." : "شكرا لتواصلك معنا. سيقوم فريقنا بالرد عليك خلال 24 ساعة."}</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-label-sm text-[12px] font-bold text-primary uppercase tracking-widest">{t.contact.name}</label>
                          <input required type="text" className="w-full p-4 rounded-2xl bg-surface/50 border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-sm outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="font-label-sm text-[12px] font-bold text-primary uppercase tracking-widest">{t.contact.email}</label>
                          <input required type="email" className="w-full p-4 rounded-2xl bg-surface/50 border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-sm outline-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-sm text-[12px] font-bold text-primary uppercase tracking-widest">{t.contact.subject}</label>
                        <input required type="text" className="w-full p-4 rounded-2xl bg-surface/50 border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-sm outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-sm text-[12px] font-bold text-primary uppercase tracking-widest">{t.contact.message}</label>
                        <textarea required rows={5} className="w-full p-4 rounded-2xl bg-surface/50 border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-sm outline-none resize-none" />
                      </div>
                      <button disabled={formStatus === 'submitting'} type="submit" className="w-full py-5 rounded-full bg-primary text-surface font-label-sm text-[13px] font-bold uppercase tracking-widest hover:bg-secondary transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-3">
                        {formStatus === 'submitting' ? (isEn ? "Sending..." : "جاري الإرسال...") : t.contact.sendMessage}
                        <FiSend className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §3  EXPORT COUNTRIES — Frosted Glass Grid
      ════════════════════════════════════════════════════ */}
      {countries.length > 0 && (
        <section className={`relative w-full bg-surface-container/30 py-24 lg:py-32 overflow-hidden border-t border-outline-variant/20 ${isEn ? "" : "rtl"}`}>
          <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10 text-center">
            <Reveal>
              <div className="mb-16">
                <span className="font-label-sm text-[12px] uppercase tracking-[0.2em] text-secondary font-bold block mb-4">
                  {t.exportCountries?.title || (isEn ? "Global Reach" : "الوصول العالمي")}
                </span>
                <h2 className="font-headline-lg text-[40px] md:text-[56px] text-primary tracking-tight font-bold">
                  {isEn ? "Where We Export" : "أين نصدر"}
                </h2>
                <p className="mt-6 font-body-md text-[18px] text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
                  {t.exportCountries?.subtitle || (isEn ? "We ship our premium botanicals worldwide, adhering strictly to international quality and safety standards." : "نقوم بشحن نباتاتنا الفاخرة لجميع أنحاء العالم، ملتزمين بمعايير الجودة والسلامة الدولية.")}
                </p>
              </div>
            </Reveal>

            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {countries.map((country, index) => (
                <Reveal key={country._id} delay={index * 0.05}>
                  <div className="flex flex-col items-center gap-4 w-28 group">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-white/50 dark:border-white/10 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:border-secondary relative bg-white/40 dark:bg-white/5 backdrop-blur-md">
                      {country.flag ? (
                        <img
                          src={getAssetUrl(country.flag)}
                          alt={isEn ? country.name_en : country.name_ar}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-outline-variant">
                          <FiMapPin className="text-2xl" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <span className="font-label-sm text-[13px] text-on-surface-variant group-hover:text-primary transition-colors text-center font-bold">
                      {isEn ? country.name_en : country.name_ar}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

    </Layout>
  );
};

export default Contact;