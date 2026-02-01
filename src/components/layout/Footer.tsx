'use client';

export default function Footer() {
  const footerLinks = {
    Product: ['Features', 'AI Detection', 'CBCT Analysis', 'PDF Reports', 'Integrations'],
    Company: ['About Us', 'Careers', 'Press', 'Blog', 'Contact'],
    Resources: ['Documentation', 'White Papers', 'Case Studies', 'Webinars', 'Support'],
    Legal: ['Privacy Policy', 'Terms of Service', 'HIPAA', 'GDPR'],
  };

  return (
    <footer className="bg-[#1A1A2E]">
      <div style={{ paddingTop: '60px', paddingBottom: '40px', paddingLeft: '60px', paddingRight: '60px', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '40px', width: '100%' }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#4A39C0] flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-lg font-[family-name:var(--font-playfair)]">S</span>
              </div>
              <span className="text-white text-lg sm:text-xl font-bold tracking-tight">
                SOJ<span className="text-[#4A39C0]">AI</span>
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm sm:text-base" style={{ marginBottom: '20px' }}>{category}</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/50 hover:text-white transition-colors duration-200 text-xs sm:text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
            {['Twitter', 'LinkedIn', 'YouTube'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-white/40 hover:text-white transition-colors duration-200 text-xs sm:text-sm"
              >
                {social}
              </a>
            ))}
          </div>
          <p className="text-white/40 text-xs sm:text-sm text-center">
            &copy; {new Date().getFullYear()} SOJAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
