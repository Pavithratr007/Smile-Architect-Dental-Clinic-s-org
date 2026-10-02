import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { GalleryItem } from '../../types';
import { ClinicVisual } from '../common/ClinicVisuals';
import { X, ZoomIn, Eye, Sparkles } from 'lucide-react';

const GALLERY_CATEGORIES = [
  'All',
  'Clinic',
  'Treatment Room',
  'Dental Equipment',
  'Waiting Area',
  'Team',
  'Branding'
] as const;

export const GalleryGrid: React.FC = () => {
  const { gallery } = useClinic();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  const filteredItems = gallery.filter((item) =>
    selectedCategory === 'All' ? true : item.category === selectedCategory
  );

  return (
    <section className="py-16 sm:py-24 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#0D6969]">
            Clinic Tour
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#15222E] tracking-tight mt-1.5" style={{ textWrap: 'balance' }}>
            Inside Smile Architect Dental Clinic
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
            Take a visual tour of our modern clinical spaces in Hebbal, Mysuru—designed with warm dark wood cabinetry,
            hygienic glass partitions, advanced equipment, and comfortable family waiting lounges.
          </p>
        </div>

        {/* Category Filter Controls */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none px-2">
          {GALLERY_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-[#15222E] text-white border-[#15222E] shadow-sm'
                    : 'bg-white text-[#1E252B] border-[#E8E6DF] hover:bg-[#F6EDE8]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            let visualType: any = 'operatory';
            if (item.category === 'Waiting Area') visualType = 'waiting';
            else if (item.category === 'Dental Equipment') visualType = 'equipment';
            else if (item.category === 'Clinic') visualType = 'operatory';
            else if (item.category === 'Team') visualType = 'doctor-pediatric';
            else if (item.category === 'Branding') visualType = 'waiting';

            return (
              <div
                key={item.id}
                onClick={() => setActiveLightboxItem(item)}
                className="bg-white rounded-2xl border border-[#E8E6DF] hover:border-[#CBD5E1] shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer group flex flex-col"
              >
                {/* Visual Area with hover zoom overlay */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF9F5]">
                  <ClinicVisual type={visualType} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={item.title} />

                  {/* Overlay button */}
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="px-3.5 py-2 rounded-full bg-white/95 text-[#15222E] text-xs font-semibold shadow-lg flex items-center gap-1.5">
                      <ZoomIn className="w-4 h-4 text-[#0D6969]" />
                      <span>View Photo</span>
                    </div>
                  </div>

                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#0D6969] border border-[#E8E6DF]">
                    {item.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <h4 className="text-sm font-bold text-[#15222E] group-hover:text-[#0D6969] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#64748B] mt-1.5 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lightbox Modal */}
        {activeLightboxItem && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          >
            <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative border border-white/20">
              {/* Close Button */}
              <button
                onClick={() => setActiveLightboxItem(null)}
                aria-label="Close Lightbox"
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Visual Display */}
              <div className="relative aspect-[16/9] w-full bg-[#15222E]">
                <ClinicVisual
                  type={
                    activeLightboxItem.category === 'Waiting Area'
                      ? 'waiting'
                      : activeLightboxItem.category === 'Dental Equipment'
                      ? 'equipment'
                      : activeLightboxItem.category === 'Team'
                      ? 'doctor-pediatric'
                      : 'operatory'
                  }
                  className="w-full h-full object-cover"
                  alt={activeLightboxItem.title}
                />
              </div>

              {/* Caption & Metadata */}
              <div className="p-6 bg-white space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0D6969] uppercase tracking-wider">
                  <span>{activeLightboxItem.category}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#15222E]">
                  {activeLightboxItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  {activeLightboxItem.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
