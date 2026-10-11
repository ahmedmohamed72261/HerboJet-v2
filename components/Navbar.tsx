import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api from '@/lib/api';
import { FiChevronDown, FiGlobe, FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, theme, setLanguage, toggleTheme } = useAppStore();
  const t = translations[language];
  const router = useRouter();

  const [categories, setCategories] = useState<{ id: string; order: number; slug: string; label: string }[]>([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/products', label: t.nav.products, dropdown: true },
    { href: '/certificates', label: t.nav.certificates },
    { href: '/catalog', label: t.nav.catalog },
    { href: '/team', label: t.nav.team },
    { href: '/export', label: t.nav.export },
    { href: '/contact', label: t.nav.contact },
  ];

  const darkHeroPages = ['/', '/about', '/products', '/contact', '/export', '/catalog', '/certificates', '/team'];
  const isTransparent = !isScrolled && darkHeroPages.includes(router.pathname);

  return (
    <motion.header
      initial={{ opacity: 0, y: -22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-surface/95 backdrop-blur-md shadow-sm border-b border-outline-variant py-2' : 'bg-transparent py-4'
      } ${language === 'ar' ? 'rtl' : ''}`}
    >
      <div className="max-w-[1240px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-6 transition-all duration-300 h-14">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group text-decoration-none">
          <span className={`font-headline-sm text-[22px] tracking-tight font-bold transition-colors ${isTransparent ? 'text-white group-hover:text-white/80' : 'text-primary group-hover:text-secondary'}`}>
            HerboJet
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 h-full">
          {navLinks.map((link) => (
            <div key={link.href} className="relative group flex items-center h-full">
              {link.dropdown ? (
                <div className={`flex cursor-pointer items-center space-x-1 font-label-sm text-[12px] font-bold transition-colors py-2 tracking-wider ${isTransparent ? 'text-white/90 hover:text-white' : 'text-on-surface-variant hover:text-primary'}`}>
                  <span>{link.label}</span>
                  <FiChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  
                  {/* Dropdown Menu */}
                  <div className={`invisible absolute top-full mt-0 w-48 overflow-hidden bg-surface-container-lowest border border-outline-variant shadow-lg opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 ${language === 'ar' ? 'right-0' : 'left-0'}`}>
                    <div className="py-2">
                      <Link
                        href="/products"
                        className="block px-6 py-2.5 font-label-sm text-[11px] font-bold tracking-wider text-on-surface-variant hover:bg-surface hover:text-primary transition-colors border-b border-outline-variant mb-1"
                      >
                        {language === 'en' ? 'All Products' : 'جميع المنتجات'}
                      </Link>
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/products?category=${cat.id}`}
                          className="block px-6 py-2 font-label-sm text-[11px] tracking-wider text-outline hover:bg-surface hover:text-primary transition-colors"
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href={link.href}
                  className={`font-label-sm text-[12px] font-bold transition-colors py-2 tracking-wider border-b-2 ${
                    router.pathname === link.href 
                      ? (isTransparent ? 'border-red-400 text-red-400' : 'border-red-600 text-red-600 dark:border-red-400 dark:text-red-400') 
                      : (isTransparent ? 'border-transparent text-white/80 hover:text-white' : 'border-transparent text-on-surface-variant hover:text-primary')
                  }`}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              isTransparent 
                ? 'border-white/30 bg-white/10 text-white hover:bg-white/20' 
                : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
            title="Change language"
          >
            <span className="font-bold text-xs">{language === 'en' ? 'AR' : 'EN'}</span>
          </button>
          
          <button
            onClick={toggleTheme}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              isTransparent 
                ? 'border-white/30 bg-white/10 text-white hover:bg-white/20' 
                : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
            title="Toggle theme"
          >
            {theme === 'light' ? <FiMoon className="h-4 w-4" /> : <FiSun className="h-4 w-4" />}
          </button>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-label-sm text-[11px] px-5 py-2.5 rounded-full bg-primary text-surface hover:bg-secondary transition-colors tracking-widest font-bold"
          >
            {language === 'en' ? 'Get Quote' : 'اطلب السعر'}
          </Link>
        </div>

        {/* Mobile Toggle & Actions */}
        <div className="flex lg:hidden items-center gap-1">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}
            title="Change language"
          >
            <span className="font-bold text-xs">{language === 'en' ? 'AR' : 'EN'}</span>
          </button>
          
          <button
            onClick={toggleTheme}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}
            title="Toggle theme"
          >
            {theme === 'light' ? <FiMoon className="h-4 w-4" /> : <FiSun className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`inline-flex items-center justify-center p-2 rounded-md transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-primary hover:bg-surface-container'}`}
            aria-label="Toggle Mobile Navigation"
          >
            {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: '100vh', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-0 left-0 w-full bg-surface z-40 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col h-full pt-20 px-6 pb-6">
              
              {/* Close Button & Logo for Mobile Menu Fullscreen */}
              <div className="absolute top-4 left-6 right-6 flex items-center justify-between">
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                  <span className="text-xl">🌿</span>
                  <span className="font-headline-sm text-lg font-bold text-primary">HerboJet</span>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-primary bg-surface-container rounded-full"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col gap-4 mt-6">
                {navLinks.map((link) => (
                  <div key={link.href} className="border-b border-outline-variant/30 pb-4">
                    {link.dropdown ? (
                      <div>
                        <button
                          onClick={() => setIsProductsOpen(!isProductsOpen)}
                          className={`flex w-full items-center justify-between text-primary ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                        >
                          <span className="font-headline-sm text-xl font-bold">{link.label}</span>
                          <FiChevronDown className={`h-6 w-6 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {isProductsOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="flex flex-col gap-3 mt-4"
                            >
                              <Link
                                href="/products"
                                onClick={() => setIsMenuOpen(false)}
                                className={`block font-label-sm text-[14px] font-bold text-secondary ${language === 'ar' ? 'text-right' : 'text-left'}`}
                              >
                                {language === 'en' ? 'All Products' : 'جميع المنتجات'}
                              </Link>
                              {categories.map((cat) => (
                                <Link
                                  key={cat.slug}
                                  href={`/products?category=${cat.id}`}
                                  onClick={() => setIsMenuOpen(false)}
                                  className={`block font-label-sm text-[14px] text-on-surface-variant ${language === 'ar' ? 'text-right' : 'text-left'}`}
                                >
                                  {cat.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block font-headline-sm text-xl font-bold text-primary ${language === 'ar' ? 'text-right' : 'text-left'}`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-8">
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex w-full items-center justify-center py-4 mb-4 bg-primary text-surface rounded-xl font-bold text-lg"
                >
                  {language === 'en' ? 'Get Quote' : 'اطلب السعر'}
                </Link>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
