import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { FadeIn, StaggerGrid, StaggerItem } from "@/components/Motion";
import ProductCard from "@/components/ProductCard";
import { useAppStore } from "@/store";
import { translations } from "@/lib/translations";
import { FiPackage, FiRefreshCw, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { useApi, Product, Category } from "@/hooks/useApi";
import api from "@/lib/api";

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

const Products = () => {
  const { language } = useAppStore();
  const router = useRouter();
  const t = translations[language];
  const page = t.productsPage;
  const isEn = language === "en";

  const { categories, loading: apiLoading, errors, fetchCategories } = useApi();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState(false);
  
  const loading = apiLoading.categories || loadingProducts;
  const error = errors.categories || errorProducts;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Parse query on mount/update
  useEffect(() => {
    if (!router.isReady) return;
    const cat = router.query.category as string;

    // When the category in the URL is a slug, we need to map it back to the ID
    if (cat && categories.length > 0) {
      const matchedCategory = categories.find(
        (c) => c.slug === cat || c.id.toString() === cat,
      );
      if (matchedCategory) {
        setSelectedCategory(matchedCategory.id.toString());
      } else {
        setSelectedCategory(cat);
      }
    } else if (!cat) {
      setSelectedCategory(null);
    }
  }, [router.isReady, router.query.category, categories]);

  useEffect(() => {
    if (categories.length === 0) fetchCategories();
  }, [categories.length]);

  const normalizeItem = (item: any) => (item ? { ...item, id: item.id ?? item._id } : null);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    setErrorProducts(false);
    try {
      const params = selectedCategory ? { category_id: selectedCategory } : {};
      const response = await api.get('/products', { params });
      const data = response.data?.data || response.data || [];
      setProducts(Array.isArray(data) ? data.map(normalizeItem).filter(Boolean) : []);
    } catch (error) {
      setErrorProducts(true);
    } finally {
      setLoadingProducts(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (router.isReady) {
      fetchProducts();
    }
  }, [fetchProducts, router.isReady]);

  const handleCategoryClick = useCallback(
    (id: string | null) => {
      if (id) {
        const category = categories.find((c) => c.id.toString() === id);
        if (category && category.slug) {
          router.push(`/products?category=${category.slug}`, undefined, {
            shallow: true,
          });
        } else {
          router.push(`/products?category=${id}`, undefined, { shallow: true });
        }
      } else {
        router.push("/products", undefined, { shallow: true });
      }
    },
    [router, categories],
  );

  const isCategoryActive = useCallback(
    (cat: Category) => {
      if (!selectedCategory) return false;
      return cat.id?.toString() === selectedCategory;
    },
    [selectedCategory],
  );

  return (
    <Layout title={t.products.title}>
      {/* ══════════════════════════════════════════════════════
          §1  HERO — Glassmorphism & Image Overlay
      ════════════════════════════════════════════════════ */}
      <section
        className={`relative h-[60vh] min-h-[500px] flex flex-col justify-center overflow-hidden ${isEn ? "" : "rtl"}`}
      >
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-section.jpg"
            alt="HerboJet Products"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto px-6 lg:px-12 w-full text-center flex flex-col items-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-sm text-[11px] tracking-[0.2em] text-white uppercase font-bold">
              {page.heroBadge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-headline-lg text-[48px] md:text-[80px] font-bold text-white leading-[1.05] tracking-tight mb-6"
          >
            {t.products.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/80 text-[18px] md:text-[22px] leading-relaxed max-w-2xl font-body-lg"
          >
            {page.heroDescription}
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  FILTERS & GRID — Frosted Glass
      ════════════════════════════════════════════════════ */}
      <section
        className={`relative w-full bg-background py-16 lg:py-28 min-h-screen overflow-hidden ${isEn ? "" : "rtl"}`}
      >
        <Orb className="w-[800px] h-[800px] bg-secondary/10 top-0 right-0" />
        <Orb className="w-[600px] h-[600px] bg-primary/5 bottom-0 left-0" />

        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          <FadeIn>
            <div className="mb-16 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <h3 className="font-label-sm text-[11px] font-bold text-secondary uppercase tracking-widest flex items-center gap-2 shrink-0">
                <span className="w-5 h-px bg-secondary inline-block" />
                {t.products.filterByCategory}
              </h3>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`px-6 py-3 rounded-full font-label-sm text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 shadow-sm backdrop-blur-md ${
                    !selectedCategory
                      ? "bg-secondary text-on-secondary shadow-lg border-secondary"
                      : "bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 text-on-surface-variant hover:border-secondary/50 hover:text-secondary"
                  }`}
                >
                  {t.products.allCategories}
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id.toString())}
                    className={`px-6 py-3 rounded-full font-label-sm text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 shadow-sm backdrop-blur-md ${
                      isCategoryActive(category)
                        ? "bg-secondary text-on-secondary shadow-lg border-secondary"
                        : "bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 text-on-surface-variant hover:border-secondary/50 hover:text-secondary"
                    }`}
                  >
                    {isEn ? category.name_en : category.name_ar}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-[400px] rounded-[32px] bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 p-6 animate-pulse flex flex-col"
                >
                  <div className="h-48 bg-black/5 dark:bg-white/10 rounded-2xl mb-6 w-full" />
                  <div className="h-6 bg-black/5 dark:bg-white/10 rounded-md w-3/4 mb-4" />
                  <div className="h-4 bg-black/5 dark:bg-white/10 rounded-md w-full mb-2" />
                  <div className="h-4 bg-black/5 dark:bg-white/10 rounded-md w-5/6" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[32px] bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 max-w-lg mx-auto text-center p-12 shadow-xl">
              <div className="w-16 h-16 mx-auto mb-6 bg-secondary/15 rounded-2xl flex items-center justify-center text-secondary">
                <FiPackage className="w-7 h-7" />
              </div>
              <p className="font-headline-sm text-[24px] font-bold text-primary mb-2">
                {t.common.error}
              </p>
              <p className="font-body-md text-[15px] text-on-surface-variant mb-8 leading-relaxed">
                {isEn
                  ? "Unable to load products. Please try again."
                  : "تعذر تحميل المنتجات. يرجى المحاولة مرة أخرى."}
              </p>
              <button
                onClick={() => {
                  fetchCategories();
                  fetchProducts();
                }}
                className="inline-flex items-center gap-2 font-label-sm text-[11px] font-bold px-8 py-4 rounded-full bg-primary text-surface hover:bg-secondary uppercase tracking-widest transition-colors shadow-lg"
              >
                <FiRefreshCw className="w-4 h-4" />
                {isEn ? "Retry" : "إعادة المحاولة"}
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[32px] bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 max-w-lg mx-auto text-center p-12 shadow-xl">
              <div className="w-16 h-16 mx-auto mb-6 bg-secondary/15 rounded-2xl flex items-center justify-center text-secondary">
                <FiPackage className="w-7 h-7" />
              </div>
              <p className="font-headline-sm text-[24px] font-bold text-primary">
                {t.common.noData}
              </p>
            </div>
          ) : (
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <StaggerItem key={product.id}>
                  <ProductCard
                    id={product.id}
                    name={isEn ? product.name_en : product.name_ar}
                    category={
                      (isEn ? product.category?.name_en : product.category?.name_ar) || ''
                    }

                    description={
                      (isEn
                        ? product.short_description_en || product.description_en
                        : product.short_description_ar || product.description_ar) || ''
                    }

                    image={product.image ?? null}

                  />
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Products;
