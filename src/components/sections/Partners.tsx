'use client';

import { PARTNERS } from '@/lib/constants';

const row1 = ['Morita', 'Acteon', 'Durr Dental', 'Dentsply Sirona', 'Planmeca', 'Carestream'];
const row2 = ['Vatech', 'KaVo Kerr', 'Instrumentarium', 'NewTom', 'Owandy', 'Soredex'];
const row3 = ['Prexion', 'Asahi Roentgen', 'FONA', 'Cefla', 'Yoshida', 'Castellini'];

export default function Partners() {
  return (
    <section className="py-16 sm:py-20 md:py-24 overflow-hidden" style={{ background: '#FFFFFF' }}>
      <div className="container px-4 sm:px-6" style={{ marginTop: '40px', marginBottom: '60px' }}>
        <h2 className="heading-section text-center font-[family-name:var(--font-playfair)]">
          <span className="relative inline-block">
            Trusted
            <svg
              className="absolute -bottom-2 left-0 w-full"
              height="10"
              viewBox="0 0 100 10"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M1 5.5C20 2 40 7 60 4C80 1 90 5 99 3"
                stroke="#4A39C0"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          {' '}by Leading Equipment Manufacturers
        </h2>
      </div>

      <div className="flex flex-col gap-6 sm:gap-8" style={{ paddingBottom: '60px' }}>
        {/* Row 1 - Right direction */}
        <div className="relative overflow-hidden">
          <div
            className="flex gap-4 sm:gap-6 animate-scroll-right"
            style={{ width: 'max-content' }}
          >
            {[...row1, ...row1, ...row1].map((partner, i) => (
              <div
                key={`row1-${i}`}
                className="flex-shrink-0 w-[150px] sm:w-[180px] h-[70px] sm:h-[80px] rounded-2xl bg-[#F9F8FF] flex items-center justify-center"
              >
                <span className="text-[#1A1A2E]/60 text-sm sm:text-base font-medium">{partner}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Left direction */}
        <div className="relative overflow-hidden">
          <div
            className="flex gap-4 sm:gap-6 animate-scroll-left"
            style={{ width: 'max-content' }}
          >
            {[...row2, ...row2, ...row2].map((partner, i) => (
              <div
                key={`row2-${i}`}
                className="flex-shrink-0 w-[150px] sm:w-[180px] h-[70px] sm:h-[80px] rounded-2xl bg-[#F9F8FF] flex items-center justify-center"
              >
                <span className="text-[#1A1A2E]/60 text-sm sm:text-base font-medium">{partner}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3 - Right direction */}
        <div className="relative overflow-hidden">
          <div
            className="flex gap-4 sm:gap-6 animate-scroll-right"
            style={{ width: 'max-content' }}
          >
            {[...row3, ...row3, ...row3].map((partner, i) => (
              <div
                key={`row3-${i}`}
                className="flex-shrink-0 w-[150px] sm:w-[180px] h-[70px] sm:h-[80px] rounded-2xl bg-[#F9F8FF] flex items-center justify-center"
              >
                <span className="text-[#1A1A2E]/60 text-sm sm:text-base font-medium">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
