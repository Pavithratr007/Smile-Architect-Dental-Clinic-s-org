import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Star, MessageSquarePlus, CheckCircle, X, ShieldCheck } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { reviews, submitReview } = useClinic();
  const [modalOpen, setModalOpen] = useState(false);

  // New review form
  const [patientName, setPatientName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [doctorMentioned, setDoctorMentioned] = useState('Dr. Nisarga Kansar');
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const approvedReviews = reviews.filter((r) => r.isApproved);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !reviewText.trim()) return;

    submitReview({
      patientName: patientName.trim(),
      rating,
      doctorMentioned,
      reviewText: reviewText.trim()
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      setPatientName('');
      setReviewText('');
    }, 1800);
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-[#E8E6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#0D6969]">
              Patient Experiences
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#15222E] tracking-tight mt-1.5" style={{ textWrap: 'balance' }}>
              Real Feedback From Our Patients
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2 max-w-xl">
              Authentic patient feedback reflecting our gentle clinical approach, clear guidance,
              and comfortable atmosphere in Hebbal, Mysuru.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#15222E] bg-[#FAF9F5] border border-[#E8E6DF] hover:border-[#CBD5E1] hover:bg-[#F6EDE8]/40 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#0D6969]" />
            <span>Share Your Experience</span>
          </button>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF9F5] p-6 rounded-2xl border border-[#E8E6DF] hover:border-[#CBD5E1] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* 5-Star indicator */}
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#1E252B]/85 leading-relaxed">
                  "{rev.reviewText}"
                </p>
              </div>

              {/* Attribution */}
              <div className="pt-4 mt-4 border-t border-[#E8E6DF] space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#15222E]">{rev.patientName}</h4>
                  <span className="text-[10px] text-[#0D6969] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {rev.source}
                  </span>
                </div>
                {rev.doctorMentioned && (
                  <p className="text-[11px] text-[#6D4C41]">
                    Care by: {rev.doctorMentioned}
                  </p>
                )}
                {rev.date && (
                  <p className="text-[10px] text-slate-400">
                    {rev.date}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Share Experience Modal */}
        {modalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
          >
            <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 border border-[#E8E6DF] shadow-2xl relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              {submitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#E0F2F1] text-[#0D6969] flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#15222E]">Thank You!</h3>
                  <p className="text-xs text-[#64748B]">
                    Your feedback helps us continuously improve our patient care.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <span className="text-[11px] font-semibold text-[#0D6969] uppercase tracking-wider">
                      Patient Feedback
                    </span>
                    <h3 className="text-xl font-bold text-[#15222E]">Share Your Experience</h3>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Let us know how your visit with our doctors was.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#15222E] mb-1">
                      Your Name or Initial
                    </label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Priya M."
                      className="w-full px-3 py-2 text-xs border border-[#E8E6DF] rounded-xl focus:outline-none focus:border-[#0D6969]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#15222E] mb-1">
                      Doctor You Consulted
                    </label>
                    <select
                      value={doctorMentioned}
                      onChange={(e) => setDoctorMentioned(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E8E6DF] rounded-xl focus:outline-none focus:border-[#0D6969] bg-white"
                    >
                      <option value="Dr. Nisarga Kansar">Dr. Nisarga Kansar (Pediatric & Preventive)</option>
                      <option value="Dr. Anushree N">Dr. Anushree N (Surgeon & Implantologist)</option>
                      <option value="Both Specialists">Both Specialists / Clinic Team</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#15222E] mb-1">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-amber-500 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating ? 'fill-amber-400 stroke-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#15222E] mb-1">
                      Feedback / Review
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your thoughts on the treatment, cleanliness, and staff..."
                      className="w-full px-3 py-2 text-xs border border-[#E8E6DF] rounded-xl focus:outline-none focus:border-[#0D6969]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-white bg-[#0D6969] hover:bg-[#094F4F] rounded-lg transition-colors shadow-sm"
                    >
                      Submit Feedback
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
