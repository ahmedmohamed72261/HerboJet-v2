import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api from '@/lib/api';

const Footer = () => {
  const { language } = useAppStore();
  const [categories, setCategories] = useState<{ id: string; order: number; slug: string; label: string }[]>([]);
  const t = translations[language];
  const isEn = language === 'en';

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/categories');
        const data = res.data?.data || res.data || [];
        if (Array.isArray(data)) {
          const slugToKey: Record<string, string> = {
            herbs: t.nav.herbs,
            spices: t.nav.spices,
            seeds: t.nav.seeds,
            'dried-flowers': t.nav.driedFlowers,
            'herbal-teas': t.nav.herbalTeas,
            botanicals: t.nav.botanicals,
          };
          setCategories(
            data
              .filter((c: any) => c.is_active !== false)
              .map((c: any) => ({
                id: c._id || c.id,
                order: c.order ?? 0,
                slug: c.slug,
                label: slugToKey[c.slug] || (language === 'en' ? c.name_en : c.name_ar),
              }))
              .sort((a: any, b: any) => a.order - b.order)
          );
        }
      } catch {
        // fallback silently
      }
    })();
  }, [language, t.nav]);
  
  const footerText = {
    intro: isEn
        ? 'Exporting premium herbs, spices, seeds, and botanical ingredients with careful sourcing, strict quality control, and professional international handling.'
        : 'نصدر أعشابًا وتوابل وبذورًا ومكونات نباتية فاخرة مع توريد دقيق ورقابة صارمة على الجودة وتعامل دولي احترافي.',
    products: isEn ? 'Our Products' : 'منتجاتنا',
    company: isEn ? 'Company' : 'الشركة',
    contact: isEn ? 'Contact Us' : 'اتصل بنا',
    rights: isEn ? 'All Rights Reserved.' : 'جميع الحقوق محفوظة.',
    terms: isEn ? 'Terms of Service' : 'شروط الخدمة',
    privacy: isEn ? 'Privacy Policy' : 'سياسة الخصوصية',
  };

  const quickLinks = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/certificates', label: t.nav.certificates },
    { href: '/catalog', label: t.nav.catalog },
    { href: '/team', label: t.nav.team },
  ];

  return (
    <footer className={`w-full bg-surface-container-lowest border-t border-outline-variant/30 ${language === 'ar' ? 'rtl' : ''}`}>
      <div className="max-w-[1240px] mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-outline-variant/30">
          
          <div className="lg:col-span-4 flex flex-col pr-4">
            <Link href="/" className="flex items-center gap-2 text-decoration-none mb-6">
              <span className="font-headline-sm text-2xl tracking-tight text-primary font-bold">
                HerboJet
              </span>
            </Link>
            <p className="font-body-md text-[15px] text-on-surface-variant leading-relaxed max-w-sm">
              {footerText.intro}
            </p>
          </div>

          <div className="lg:col-span-3 lg:col-start-6 space-y-6">
            <span className="font-headline-sm text-lg font-bold text-primary block">
              {footerText.products}
            </span>
            <ul className="space-y-3 font-body-md text-[15px]">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/products?category=${cat.id}`} className="text-on-surface-variant hover:text-secondary cursor-pointer transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <span className="font-headline-sm text-lg font-bold text-primary block">
              {footerText.company}
            </span>
            <ul className="space-y-3 font-body-md text-[15px]">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-on-surface-variant hover:text-secondary cursor-pointer transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <span className="font-headline-sm text-lg font-bold text-primary block">
              {footerText.contact}
            </span>
            <div className="space-y-3 font-body-md text-[15px] text-on-surface-variant">
              <a href="mailto:info@organicherbseg.com" className="block hover:text-secondary transition-colors select-all">info@organicherbseg.com</a>
              <a href="mailto:sales@organicherbseg.com" className="block hover:text-secondary transition-colors select-all">sales@organicherbseg.com</a>
              <a href="https://wa.me/201553190955" target="_blank" rel="noopener noreferrer" className="block hover:text-secondary transition-colors mt-2">+20 155 319 0955</a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-body-sm text-[13px] text-on-surface-variant">
          <div>© {new Date().getFullYear()} HerboJet. {footerText.rights}</div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="#" className="hover:text-primary transition-colors">{footerText.privacy}</Link>
            <Link href="#" className="hover:text-primary transition-colors">{footerText.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
