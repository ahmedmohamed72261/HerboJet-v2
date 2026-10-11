import { FC } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { getAssetUrl } from '@/lib/api';
import { useAppStore } from '@/store';

interface ProductCardProps {
  id: number | string;
  name: string;
  category: string;
  description: string;
  image?: string | null;
  isFeatured?: boolean;

}

const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  category,
  description,
  image,
  isFeatured = false,
}) => {
  const { language } = useAppStore();
  const viewDetailsLabel = language === 'en' ? 'Explore' : 'استكشف';

  return (
    <Link href={`/products/${id}`} className="block h-full group">
      <article className="h-full rounded-[32px] overflow-hidden bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 hover:border-secondary/40 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col relative">
        
        {/* Floating Badge */}
        <div className="absolute top-5 left-5 z-20 flex gap-2">
          <span className="font-label-sm text-[10px] px-4 py-1.5 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md text-primary uppercase font-bold tracking-widest shadow-sm">
            {category}
          </span>
          {isFeatured && (
            <span className="font-label-sm text-[10px] px-4 py-1.5 rounded-full bg-secondary/90 backdrop-blur-md text-on-secondary uppercase font-bold tracking-widest shadow-sm">
              {language === 'en' ? 'Featured' : 'مميز'}
            </span>
          )}
        </div>

        {/* Image Section */}
        <div className="relative overflow-hidden aspect-[4/3] bg-surface-container-high w-full">
          {image ? (
            <img
              src={getAssetUrl(image)}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
              <span className="text-[10px] font-label-sm font-bold text-outline uppercase tracking-wider">No Image</span>
            </div>
          )}
          {/* Glass Gradient overlay at bottom of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 flex flex-col flex-grow relative z-10 bg-white/60 dark:bg-white/5 backdrop-blur-2xl">
          <h3 className="font-headline-sm text-[22px] font-bold text-primary mb-3 line-clamp-1 group-hover:text-secondary transition-colors">
            {name}
          </h3>
          <p className="font-body-sm text-[15px] text-on-surface-variant leading-relaxed line-clamp-2 mb-8 flex-grow">
            {description}
          </p>

          <div className="flex items-center gap-2 mt-auto font-label-sm text-[12px] font-bold text-secondary uppercase tracking-widest">
            {viewDetailsLabel}
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;