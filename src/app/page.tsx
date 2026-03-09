
"use client";

import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronRight,
  Zap,
  Settings,
  ShieldCheck,
  FileText,
  Maximize2,
  Cpu,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import data from '../data.json';

const categories = [
  { name: "구조", icon: <Layers className="w-5 h-5" />, color: "from-blue-500 to-indigo-600", count: 57 },
  { name: "조립성", icon: <Settings className="w-5 h-5" />, color: "from-emerald-500 to-teal-600", count: 17 },
  { name: "정비성", icon: <Settings className="w-5 h-5" />, color: "from-orange-500 to-amber-600", count: 9 },
  { name: "회로", icon: <Zap className="w-5 h-5" />, color: "from-purple-500 to-pink-600", count: 5 },
  { name: "성능", icon: <Cpu className="w-5 h-5" />, color: "from-red-500 to-rose-600", count: 9 },
  { name: "2D도면", icon: <FileText className="w-5 h-5" />, color: "from-cyan-500 to-sky-600", count: 21 },
  { name: "ES/MS", icon: <ShieldCheck className="w-5 h-5" />, color: "from-slate-500 to-slate-700", count: 34 },
  { name: "커넥터블럭", icon: <Maximize2 className="w-5 h-5" />, color: "from-violet-500 to-purple-600", count: 8 },
];

export default function PRADashboard() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const filteredData = data.filter((item: any) => {
    const matchesCategory = selectedCategory === "전체" || item.category === selectedCategory;
    const matchesSearch = item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.criteria.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 font-sans selection:bg-blue-500/30">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <nav className="fixed left-0 top-0 h-full w-20 bg-slate-900/40 backdrop-blur-xl border-r border-slate-800/50 flex flex-col items-center py-8 z-50">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-12">
          <ShieldCheck className="text-white w-8 h-8" />
        </div>
        <div className="flex flex-col gap-8">
          <NavIcon icon={<Layers />} active />
          <NavIcon icon={<Zap />} />
          <NavIcon icon={<Cpu />} />
          <NavIcon icon={<Settings />} />
        </div>
      </nav>

      <main className="pl-32 pr-12 py-12 relative z-10">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h1 className="text-5xl font-bold tracking-tight text-white mb-4">
                PRA <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Design Master</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                배터리 시스템 전장 설계 최적화를 위한 160개 기술 검토 가이드.
                국제 표준 및 현대자동차 ES/MS 규격 기반 전문 엔지니어링 체크리스트.
              </p>
            </div>
          </motion.div>
        </header>

        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StandardCard image="/images/standard_1.png" title="Insulation Coordination" desc="IEC 60664-1: Creepage & Clearance" />
            <StandardCard image="/images/standard_2.png" title="HV Cable Routing" desc="ISO 19642: Bend Radius & Separation" />
            <StandardCard image="/images/standard_3.png" title="Safety Markings" desc="ISO 7010: High Voltage Symbols" />
          </div>
        </section>

        <div className="flex flex-wrap gap-3 mb-8">
          <CategoryFilter name="전체" active={selectedCategory === "전체"} onClick={() => setSelectedCategory("전체")} count={160} />
          {categories.map((cat) => (
            <CategoryFilter key={cat.name} name={cat.name} active={selectedCategory === cat.name} onClick={() => setSelectedCategory(cat.name)} count={cat.count} />
          ))}
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800/50 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <FileText className="text-blue-400 w-5 h-5" />
              Technical Audit Items
              <span className="ml-2 text-sm text-slate-500 font-normal">({filteredData.length} items)</span>
            </h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800/80 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/30 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-8 py-5">No.</th>
                  <th className="px-8 py-5">Item</th>
                  <th className="px-8 py-5">Criteria</th>
                  <th className="px-8 py-5 text-blue-400">EE Considerations</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {filteredData.map((item: any) => (
                  <TableRow key={item.id} item={item} expanded={expandedId === item.id} onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function TableRow({ item, expanded, onToggle }: any) {
  return (
    <>
      <tr onClick={onToggle} className="group hover:bg-slate-800/20 transition-all cursor-pointer">
        <td className="px-8 py-6 text-sm font-mono text-slate-500">{item.id}</td>
        <td className="px-8 py-6 font-medium text-slate-200">{item.item}</td>
        <td className="px-8 py-6 text-sm text-slate-400">{item.criteria}</td>
        <td className="px-8 py-6 text-sm text-blue-300">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5" />
            {item.ee_consideration}
          </div>
        </td>
        <td className="px-8 py-6">
          <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${expanded ? 'rotate-90 text-blue-400' : ''}`} />
        </td>
      </tr>
      <AnimatePresence>
        {expanded && (
          <tr>
            <td colSpan={5} className="px-12 py-0">
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-8 pt-4 border-t border-slate-800/50">
                <div className="bg-slate-950/30 rounded-2xl p-6 border border-slate-800/50">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">System Integration Note</h4>
                  <p className="text-slate-300 text-sm">현대자동차 HMC 자재 표준(MS) 및 기술 표준(ES) 정합성 확인 필수 항목입니다.</p>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

function StandardCard({ image, title, desc }: any) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-800/50 bg-slate-900/40">
      <div className="aspect-[16/9] w-full">
        <img src={image} alt={title} className="w-full h-full object-cover opacity-80" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent" />
      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-xs text-blue-400 font-mono">{desc}</p>
      </div>
    </div>
  );
}

function CategoryFilter({ name, count, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all border ${active ? 'bg-white text-slate-950 border-white' : 'bg-slate-900/40 text-slate-400 border-slate-800/80 hover:border-slate-700'}`}>
      {name} <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800/50">{count}</span>
    </button>
  );
}

function NavIcon({ icon, active }: any) {
  return (
    <div className={`p-3 rounded-xl cursor-pointer ${active ? 'bg-blue-500/10 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
      {React.cloneElement(icon, { className: "w-6 h-6" })}
    </div>
  );
}
