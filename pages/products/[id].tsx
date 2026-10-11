import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { FadeIn, StaggerGrid, StaggerItem } from '@/components/Motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api, { getAssetUrl } from '@/lib/api';
import { FiArrowLeft, FiCheck, FiMapPin, FiLayers, FiDroplet, FiAward, FiCloud, FiArchive, FiClock, FiSend, FiTruck, FiShield, FiChevronRight } from 'react-icons/fi';
import { GetStaticProps, GetStaticPaths } from 'next';

interface Product {
  id: number;
  name_en: string;
  name_ar: string;
  short_description_en: string;
  short_description_ar: string;
  description_en: string;
  description_ar: string;
  image: string | null;
  images: string[] | null;
  category: {
    id: number;
    name_en: string;
    name_ar: string;
  };
  price?: number | string;
  sku?: string;
  stock?: number;
  is_featured?: boolean;
  origin?: string;
  form?: string;
  color?: string;
  purity?: string;
  moisture?: string;
  packaging?: string;
  shelf_life?: string;
  certifications?: string[];
  export_availability?: string;
}

interface ProductDetailsProps {
  product: Product | null;
  suggestedProducts: Product[];
}

const specIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  origin: FiMapPin,
  form: FiLayers,
  color: FiDroplet,
  purity: FiAward,
  moisture: FiCloud,
  packaging: FiArchive,
  shelf_life: FiClock,
  export_availability: FiSend,
};

const ProductDetails = ({ product, suggestedProducts }: ProductDetailsProps) => {
  const router = useRouter();
  const { language } = useAppStore();
  const t = translations[language];

  const [selectedImage, setSelectedImage] = useState<string | null>(product?.image || null);

  interface ProductSpec {
    label: string;
    key: string;
  }

  const specFields: ProductSpec[] = [
    { label: language === 'en' ? 'Origin' : 'بلد المنشأ', key: 'origin' },
    { label: language === 'en' ? 'Form' : 'الشكل', key: 'form' },
    { label: language === 'en' ? 'Color' : 'اللون', key: 'color' },
    { label: language === 'en' ? 'Purity' : 'النقاء', key: 'purity' },
    { label: language === 'en' ? 'Moisture' : 'الرطوبة', key: 'moisture' },
    { label: language === 'en' ? 'Packaging' : 'التغليف', key: 'packaging' },
    { label: language === 'en' ? 'Shelf Life' : 'مدة الصلاحية', key: 'shelf_life' },
    { label: language === 'en' ? 'Export Availability' : 'التوفر للتصدير', key: 'export_availability' },
  ];

  if (!product) {
    return (
      <Layout title={t.products.title}>
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-surface">
          <span className="text-6xl mb-6 opacity-50 text-outline">🌿</span>
          <p className="font-headline-sm text-2xl font-bold text-primary mb-8">{t.common.noData}</p>
          <button
            onClick={() => router.push('/products')}
            className="flex items-center gap-2 px-6 py-3 border border-outline-variant hover:border-primary text-primary font-label-sm font-bold uppercase tracking-widest transition-colors bg-surface-container"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Products
          </button>
        </div>
      </Layout>
    );
  }

  const productName = language === 'en' ? product.name_en : product.name_ar;
  const productDesc = language === 'en' ? product.description_en : product.description_ar;
  const categoryName = language === 'en' ? product.category?.name_en : product.category?.name_ar;
  const price = Number(product.price);
  const hasPrice = price > 0;

  return (
    <Layout title={productName}>
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-outline-variant pt-24 pb-4">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 py-4 font-label-sm text-[10px] font-bold tracking-widest uppercase">
            <button onClick={() => router.push('/')} className="text-on-surface-variant hover:text-primary transition-colors">
              {language === 'en' ? 'Home' : 'الرئيسية'}
            </button>
            <span className="text-outline-variant">/</span>
            <button onClick={() => router.push('/products')} className="text-on-surface-variant hover:text-primary transition-colors">
              {language === 'en' ? 'Products' : 'المنتجات'}
            </button>
            <span className="text-outline-variant">/</span>
            <span className="text-primary truncate max-w-[200px]">{productName}</span>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <section className="py-12 lg:py-24 bg-surface min-h-screen border-b border-outline-variant">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
            
            {/* Image Section */}
            <FadeIn className="lg:sticky lg:top-32 lg:self-start">
              {/* Main Image */}
              <div className="relative border border-outline-variant bg-surface-container-high aspect-square flex items-center justify-center overflow-hidden group">
                {selectedImage ? (
                  <img
                    src={getAssetUrl(selectedImage)}
                    alt={productName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-outline">
                    <span className="text-6xl mb-4 block opacity-50">🌿</span>
                    <span className="font-label-sm text-[10px] uppercase font-bold tracking-widest">{productName}</span>
                  </div>
                )}
                {product.is_featured && (
                  <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 bg-primary text-surface px-3 py-1.5 border border-primary font-label-sm text-[9px] font-bold uppercase tracking-widest">
                    <span>{language === 'en' ? 'Featured' : 'مميز'}</span>
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {product.images && product.images.length > 0 && (
                <div className="flex gap-4 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                  <button
                    onClick={() => setSelectedImage(product.image)}
                    className={`w-24 h-24 flex-shrink-0 border transition-all overflow-hidden ${
                      selectedImage === product.image
                        ? 'border-primary opacity-100'
                        : 'border-outline-variant opacity-60 hover:opacity-100 hover:border-outline'
                    }`}
                  >
                    {product.image ? (
                      <img
                        src={getAssetUrl(product.image)}
                        alt="Main"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-outline text-xl">🌿</div>
                    )}
                  </button>
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-24 h-24 flex-shrink-0 border transition-all overflow-hidden ${
                        selectedImage === img
                          ? 'border-primary opacity-100'
                          : 'border-outline-variant opacity-60 hover:opacity-100 hover:border-outline'
                      }`}
                    >
                      <img
                        src={getAssetUrl(img)}
                        alt={`Gallery ${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </FadeIn>

            {/* Details Section */}
            <FadeIn className="flex flex-col">
              
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1.5 h-6 bg-secondary inline-block"></span>
                <span className="font-label-sm text-[11px] font-bold text-outline uppercase tracking-[0.2em]">
                  {categoryName}
                </span>
              </div>

              <h1 className="font-headline-lg text-[40px] lg:text-[56px] font-bold text-primary mb-6 leading-[1.1] tracking-tight">
                {productName}
              </h1>

              {hasPrice && (
                <div className="mb-6 pb-6 border-b border-outline-variant">
                  <span className="font-headline-md text-3xl font-bold text-primary">
                    ${price.toFixed(2)}
                  </span>
                  <span className="ml-2 font-label-sm text-xs font-bold text-outline uppercase tracking-wider">
                    / {language === 'en' ? 'kg' : 'كجم'}
                  </span>
                </div>
              )}

              <p className="font-body-lg text-[16px] text-on-surface-variant leading-relaxed mb-10 pl-6 border-l border-outline-variant italic">
                {language === 'en' ? product.short_description_en : product.short_description_ar}
              </p>

              {/* Action Button */}
              <div className="mb-12 pb-12 border-b border-outline-variant">
                <a
                  href={(() => {
                    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201102737769';
                    const msg = language === 'en'
                      ? `Hello! I'm interested in ${productName}.%0A%0AProduct Details:%0A- Category: ${categoryName}%0A${hasPrice ? `- Price: $${price.toFixed(2)}/kg%0A` : ''}${product.origin ? `- Origin: ${product.origin}%0A` : ''}${product.form ? `- Form: ${product.form}%0A` : ''}${product.certifications?.length ? `- Certifications: ${product.certifications.join(', ')}` : ''}%0A%0ACould you please provide more details and pricing?`
                      : `مرحباً، أنا مهتم بـ ${productName}.%0A%0Aتفاصيل المنتج:%0A- التصنيف: ${categoryName}%0A${hasPrice ? `- السعر: $${price.toFixed(2)}/كجم%0A` : ''}${product.origin ? `- بلد المنشأ: ${product.origin}%0A` : ''}${product.form ? `- الشكل: ${product.form}%0A` : ''}${product.certifications?.length ? `- الشهادات: ${product.certifications.join(', ')}` : ''}%0A%0Aهل يمكنكم تزويدي بمزيد من التفاصيل والأسعار؟`;
                    return `https://wa.me/${phone}?text=${msg}`;
                  })()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 px-6 bg-primary text-surface hover:bg-secondary font-label-sm text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-3"
                >
                  <FiTruck className="w-4 h-4" />
                  <span>{language === 'en' ? 'Request a Quote' : 'طلب عرض سعر'}</span>
                </a>
              </div>

              {/* Full Description */}
              <div className="mb-12">
                <h3 className="font-label-sm text-[11px] font-bold text-outline tracking-[0.2em] uppercase mb-4">
                  {language === 'en' ? 'About this product' : 'عن هذا المنتج'}
                </h3>
                <div className="font-body-md text-[15px] text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                  {productDesc}
                </div>
              </div>

              {/* Product Specifications */}
              <div className="mb-10">
                <h3 className="font-label-sm text-[11px] font-bold text-outline tracking-[0.2em] uppercase mb-4">
                  {language === 'en' ? 'Specifications' : 'المواصفات'}
                </h3>
                <div className="border border-outline-variant divide-y divide-outline-variant bg-surface-container-lowest">
                  {specFields.map((field) => {
                    const value = (product as any)[field.key];
                    if (!value || (Array.isArray(value) && value.length === 0)) return null;
                    return (
                      <div key={field.key} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-surface transition-colors">
                        <span className="font-label-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-3 mb-2 sm:mb-0">
                          <span className="flex items-center justify-center w-6 h-6 border border-outline-variant bg-surface">
                            {(() => {
                              const Icon = specIcons[field.key];
                              return Icon ? <Icon className="w-3 h-3 text-secondary" /> : null;
                            })()}
                          </span>
                          {field.label}
                        </span>
                        <span className="font-data-tabular text-[13px] font-bold text-primary sm:text-right ml-9 sm:ml-0">
                          {value}
                        </span>
                      </div>
                    );
                  })}
                  {product.certifications && product.certifications.length > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-surface transition-colors">
                      <span className="font-label-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-3 mb-2 sm:mb-0">
                        <span className="flex items-center justify-center w-6 h-6 border border-outline-variant bg-surface">
                          <FiCheck className="w-3 h-3 text-secondary" />
                        </span>
                        {language === 'en' ? 'Certifications' : 'الشهادات'}
                      </span>
                      <div className="flex flex-wrap gap-2 justify-start sm:justify-end ml-9 sm:ml-0">
                        {product.certifications.map((cert: string, i: number) => (
                          <span key={i} className="inline-flex items-center px-2 py-1 bg-surface border border-outline-variant text-primary font-label-sm text-[9px] font-bold uppercase tracking-widest">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </FadeIn>
          </div>
        </div>
      </section>

      {/* Suggested Products Section */}
      {suggestedProducts.length > 0 && (
        <section className="w-full bg-surface-container-low py-20 lg:py-32">
          <div className="max-w-[1240px] mx-auto px-6 lg:px-12">
            <FadeIn>
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 pb-6 border-b border-outline-variant">
                <div>
                  <span className="font-label-sm text-[10px] tracking-widest text-secondary uppercase block mb-3 font-bold">
                    {language === 'en' ? 'You might also like' : 'قد يعجبك أيضاً'}
                  </span>
                  <h2 className="font-headline-md text-[32px] font-bold text-primary tracking-tight">
                    {language === 'en' ? 'Related Products' : 'منتجات ذات صلة'}
                  </h2>
                </div>
                <a href="/products" className="inline-flex items-center gap-2 font-label-sm text-[11px] font-bold text-primary hover:text-secondary uppercase tracking-widest transition-colors">
                  {language === 'en' ? 'View All' : 'عرض الكل'}
                  <FiChevronRight className="w-4 h-4" />
                </a>
              </div>

              <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {suggestedProducts.map((prod) => (
                  <StaggerItem key={prod.id}>
                    <ProductCard
                      id={prod.id}
                      name={language === 'en' ? prod.name_en : prod.name_ar}
                      category={(language === 'en' ? prod.category?.name_en : prod.category?.name_ar) || ''}

                      description={language === 'en' ? prod.short_description_en : prod.short_description_ar}
                      image={prod.image}
                      isFeatured={prod.is_featured}
                    />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </FadeIn>
          </div>
        </section>
      )}
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await api.get('/products?limit=1000');
    const products = response.data?.data || response.data || [];
    
    const paths = products.map((product: Product) => ({
      params: { id: product.id.toString() },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error fetching products for static paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps<ProductDetailsProps> = async ({ params }) => {
  try {
    const productId = params?.id;
    
    // Fetch main product
    const productResponse = await api.get(`/products/${productId}`);
    const product = productResponse.data?.data || productResponse.data;

    if (!product) {
      return { notFound: true };
    }

    // Fetch suggested products from same category
    let suggestedProducts: Product[] = [];
    if (product.category?.id) {
      try {
        const suggestedResponse = await api.get('/products', {
          params: { category_id: product.category.id },
        });
        const allSuggested = suggestedResponse.data?.data || suggestedResponse.data || [];
        suggestedProducts = allSuggested.filter((p: Product) => p.id !== product.id).slice(0, 3);
      } catch (error) {
        console.error('Error fetching suggested products:', error);
      }
    }

    // Ensure price is a number
    if (product.price) {
      product.price = Number(product.price);
    }

    return {
      props: {
        product,
        suggestedProducts,
      },
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
    };
  }
};

export default ProductDetails;
