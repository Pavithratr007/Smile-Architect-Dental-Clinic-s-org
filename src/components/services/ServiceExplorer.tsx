import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Service, ServiceCategory } from '../../types';
import { ServiceDetailModal } from './ServiceDetailModal';
import { Search, Calendar, Clock, ChevronRight, Sparkles, Filter } from 'lucide-react';

const CATEGORIES: ('All' | ServiceCategory)[] = [
  'All',
  'General Dentistry',
  'Pediatric Dentistry',
  'Oral & Maxillofacial',
  'Endodontics',
  'Implantology',
  'Orthodontics',
  'Cosmetic Dentistry',
  'Prosthodontics',
  'Periodontics'
];

export const ServiceExplorer: React.FC = () => {
  const { services, doctors, navigateTo } = useClinic();
  const [selectedCategory, setSelectedCategory] = useState<'All' | ServiceCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeServiceModal, setActiveServiceModal] = useState<Service | null>(null);

  // Active services
  const activeServices = services.filter((s) => s.isActive);

  // Filtered services
  const filteredServices = activeServices.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-16 sm:py-24 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#0D6969]">
            Comprehensive Dental Care
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#15222E] tracking-tight mt-1.5" style={{ textWrap: 'balance' }}>
            Explore Our Dental Treatments & Services
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
            From routine checkups and child-friendly pediatric care to surgical wisdom tooth extractions and dental implants,
            every treatment is delivered with precision and patient comfort in mind.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mb-10 space-y-4">
          {/* Search bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search treatments (e.g., Root Canal, Wisdom Tooth, Cleaning)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white text-xs sm:text-sm text-[#15222E] border border-[#E8E6DF] rounded-xl focus:outline-none focus:border-[#0D6969] shadow-sm transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Interactive filter tabs / segmented controls */}
          <div className="flex items-center justify-start md:justify-center gap-1.5 overflow-x-auto pb-2 scrollbar-none px-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer border ${
                    isActive
                      ? 'bg-[#15222E] text-white border-[#15222E] shadow-sm'
                      : 'bg-white text-[#1E252B]/80 border-[#E8E6DF] hover:bg-[#F6EDE8]/50 hover:text-[#15222E]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E6DF] max-w-lg mx-auto p-8">
            <Filter className="w-8 h-8 text-[#64748B] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#15222E]">No services match your search</p>
            <p className="text-xs text-[#64748B] mt-1">Try clearing your search query or selecting "All".</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-[#0D6969] bg-[#EEF8F7] rounded-lg hover:bg-[#D1EAE7] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const assignedDoc = doctors.find((d) => d.id === service.assignedDoctorId);

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl border border-[#E8E6DF] hover:border-[#CBD5E1] shadow-sm hover:shadow-md transition-all flex flex-col justify-between p-6 group"
                >
                  <div className="space-y-3">
                    {/* Category Label (clean text metadata without pills) */}
                    <div className="flex items-center justify-between text-[11px] text-[#0D6969] font-semibold uppercase tracking-wider">
                      <span>{service.category}</span>
                      <div className="flex items-center gap-1 text-[#64748B] font-normal lowercase tracking-normal">
                        <Clock className="w-3.5 h-3.5 text-[#0D6969]" />
                        <span>{service.durationMinutes} min</span>
                      </div>
                    </div>

                    {/* Service Name */}
                    <h3
                      onClick={() => setActiveServiceModal(service)}
                      className="text-lg font-bold text-[#15222E] group-hover:text-[#0D6969] transition-colors cursor-pointer"
                    >
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">
                      {service.description}
                    </p>

                    {/* Specialist recommendation */}
                    {assignedDoc && (
                      <p className="text-[11px] text-[#15222E]/80">
                        Lead Specialist: <span className="font-semibold">{assignedDoc.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Card Bottom / Price Note & Actions */}
                  <div className="pt-5 mt-5 border-t border-[#E8E6DF] space-y-3">
                    <div className="text-[11px] font-medium text-[#6D4C41]">
                      {service.customPrice
                        ? `₹${service.customPrice.toLocaleString('en-IN')}`
                        : service.priceNote || 'Price available after consultation'}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveServiceModal(service)}
                        className="text-xs font-semibold text-[#15222E] hover:text-[#0D6969] inline-flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Details & FAQ</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => navigateTo('booking', { serviceSlug: service.slug })}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0D6969] hover:bg-[#094F4F] rounded-lg transition-colors cursor-pointer shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Educational note footer */}
        <div className="mt-12 text-center text-xs text-[#64748B] max-w-xl mx-auto">
          <p>
            * All treatment recommendations and exact fees are discussed transparently following a personalized clinical assessment.
          </p>
        </div>
      </div>

      {/* Service Detail Modal */}
      {activeServiceModal && (
        <ServiceDetailModal
          service={activeServiceModal}
          onClose={() => setActiveServiceModal(null)}
        />
      )}
    </section>
  );
};
