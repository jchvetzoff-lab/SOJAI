'use client';

import { motion } from 'framer-motion';

const cephMeasurements = [
  { name: 'SNA Angle', value: 82.5, normal: '80-84°', status: 'normal' },
  { name: 'SNB Angle', value: 78.2, normal: '78-82°', status: 'normal' },
  { name: 'ANB Angle', value: 4.3, normal: '2-4°', status: 'elevated' },
  { name: 'FMA Angle', value: 27.8, normal: '22-28°', status: 'normal' },
  { name: 'IMPA', value: 95.1, normal: '90-97°', status: 'normal' },
  { name: 'Interincisal Angle', value: 128.4, normal: '125-135°', status: 'normal' },
  { name: 'Upper Lip to E-line', value: -2.1, normal: '-4 to -2mm', status: 'normal' },
  { name: 'Lower Lip to E-line', value: 0.5, normal: '-2 to 0mm', status: 'elevated' },
  { name: 'Nasolabial Angle', value: 98.0, normal: '90-110°', status: 'normal' },
  { name: 'Overbite', value: 3.5, normal: '2-4mm', status: 'normal' },
  { name: 'Overjet', value: 4.8, normal: '2-4mm', status: 'elevated' },
];

const tmjData = {
  left: { condylePosition: 'Centered', jointSpace: '2.8mm', mobility: 'Normal' },
  right: { condylePosition: 'Slight anterior', jointSpace: '2.2mm', mobility: 'Reduced' },
};

export default function OrthodonticPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Orthodontic Analysis</h1>
        <p className="text-sm text-gray-500 mt-1">Cephalometric measurements and TMJ evaluation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cephalometric view */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-[#1A1A2E]">Cephalometric Analysis</h3>
          </div>
          <div className="bg-[#0a0a1a] h-[400px] flex items-center justify-center relative">
            {/* SVG ceph tracing */}
            <svg viewBox="0 0 300 400" className="h-[360px]">
              {/* Skull outline */}
              <ellipse cx="150" cy="140" rx="100" ry="120" fill="none" stroke="#2a2a4a" strokeWidth="1.5" />
              {/* Mandible */}
              <path d="M80 200 Q70 280 100 320 Q130 350 160 340 Q190 330 200 300 Q220 250 210 200" fill="none" stroke="#3a3a5a" strokeWidth="1.5" />
              {/* Maxilla */}
              <path d="M100 200 L130 230 L170 230 L200 200" fill="none" stroke="#3a3a5a" strokeWidth="1" />

              {/* Landmarks */}
              {[
                { x: 150, y: 40, label: 'N' },
                { x: 145, y: 80, label: 'S' },
                { x: 155, y: 190, label: 'A' },
                { x: 160, y: 260, label: 'B' },
                { x: 165, y: 310, label: 'Gn' },
                { x: 120, y: 160, label: 'Or' },
                { x: 100, y: 140, label: 'Po' },
              ].map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="3" fill="#4A39C0" />
                  <text x={pt.x + 8} y={pt.y + 4} fill="#8B5CF6" fontSize="10" fontFamily="Inter">{pt.label}</text>
                </g>
              ))}

              {/* Measurement lines */}
              <line x1="145" y1="80" x2="155" y2="190" stroke="#4A39C0" strokeWidth="0.8" strokeDasharray="4,4" />
              <line x1="145" y1="80" x2="160" y2="260" stroke="#FF3254" strokeWidth="0.8" strokeDasharray="4,4" />
              <line x1="150" y1="40" x2="145" y2="80" stroke="#F59E0B" strokeWidth="0.8" strokeDasharray="4,4" />

              {/* E-line */}
              <line x1="175" y1="100" x2="165" y2="310" stroke="#10B981" strokeWidth="0.8" strokeDasharray="2,2" />
              <text x="180" y="200" fill="#10B981" fontSize="9" fontFamily="Inter">E-line</text>
            </svg>
          </div>
        </div>

        {/* Measurements table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-[#1A1A2E]">Measurements</h3>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-xs font-medium text-gray-400 uppercase">Parameter</th>
                  <th className="text-right py-2 text-xs font-medium text-gray-400 uppercase">Value</th>
                  <th className="text-right py-2 text-xs font-medium text-gray-400 uppercase">Normal</th>
                  <th className="text-right py-2 text-xs font-medium text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {cephMeasurements.map((m, i) => (
                  <motion.tr
                    key={m.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-50"
                  >
                    <td className="py-2.5 text-[#1A1A2E]">{m.name}</td>
                    <td className="py-2.5 text-right font-medium text-[#1A1A2E]">{m.value}</td>
                    <td className="py-2.5 text-right text-gray-400">{m.normal}</td>
                    <td className="py-2.5 text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        m.status === 'normal' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* TMJ Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(['left', 'right'] as const).map((side) => (
          <div key={side} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-semibold text-[#1A1A2E] mb-4 capitalize">TMJ — {side} Side</h3>
            <div className="flex gap-4">
              {/* Mini TMJ illustration */}
              <div className="w-24 h-24 bg-[#0a0a1a] rounded-xl flex items-center justify-center shrink-0">
                <svg viewBox="0 0 60 60" className="w-16 h-16">
                  <circle cx="30" cy="25" r="12" fill="none" stroke="#3a3a5a" strokeWidth="1.5" />
                  <ellipse cx="30" cy="25" rx="8" ry="6" fill="#4A39C0" opacity="0.3" />
                  <path d="M15 40 Q30 50 45 40" fill="none" stroke="#3a3a5a" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="space-y-2 text-sm flex-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Condyle Position</span>
                  <span className={`font-medium ${tmjData[side].condylePosition === 'Centered' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {tmjData[side].condylePosition}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Joint Space</span>
                  <span className="font-medium text-[#1A1A2E]">{tmjData[side].jointSpace}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mobility</span>
                  <span className={`font-medium ${tmjData[side].mobility === 'Normal' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {tmjData[side].mobility}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Symmetry analysis */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="font-semibold text-[#1A1A2E] mb-4">Symmetry Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Facial Midline', value: '1.2mm left', status: 'mild' },
            { label: 'Mandibular Deviation', value: '0.8mm right', status: 'normal' },
            { label: 'Ramus Height L/R', value: '52/50mm', status: 'mild' },
            { label: 'Gonial Angle L/R', value: '125°/128°', status: 'normal' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-xs text-gray-400 mb-1">{item.label}</div>
              <div className="text-lg font-bold text-[#1A1A2E]">{item.value}</div>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium mt-1 ${
                item.status === 'normal' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {item.status === 'normal' ? 'Symmetric' : 'Mild asymmetry'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
