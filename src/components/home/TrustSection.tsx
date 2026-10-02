import React from 'react';
import { UserCheck, Stethoscope, Heart, Building2 } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const trustPoints = [
    {
      title: 'Experienced Dental Care',
      desc: 'Led by qualified MDS specialists in pediatric dentistry, oral & maxillofacial surgery, and dental implantology.',
      icon: UserCheck
    },
    {
      title: 'Comprehensive Treatments',
      desc: 'From routine preventive hygiene and fillings to surgical extractions, orthodontic care, and root canal therapy under one roof.',
      icon: Stethoscope
    },
    {
      title: 'Child-Friendly Care',
      desc: 'Specialized gentle pediatric dental protocols designed to make dental appointments reassuring and anxiety-free for young patients.',
      icon: Heart
    },
    {
      title: 'Modern Clinical Environment',
      desc: 'Bright, sterile clinical operatory featuring dark wood furniture, hygienic glass partitions, and modern ergonomic treatment chairs.',
      icon: Building2
    }
  ];

  return (
    <section className="bg-white py-12 sm:py-16 border-y border-[#E8E6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] hover:border-[#CBD5E1] transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[#EEF8F7] text-[#0D6969] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#15222E] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
