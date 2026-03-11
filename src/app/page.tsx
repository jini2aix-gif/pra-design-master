
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
  CheckCircle2,
  Download,
  Lock,
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import data from '../data.json';

const categories = [
  { name: "구조", icon: <Layers className="w-5 h-5" />, color: "from-blue-500 to-indigo-600", count: 53 },
  { name: "조립성(조립기술/의장요구사항)", icon: <Settings className="w-5 h-5" />, color: "from-emerald-500 to-teal-600", count: 29 },
  { name: "정비성(A/S)", icon: <Settings className="w-5 h-5" />, color: "from-orange-500 to-amber-600", count: 15 },
  { name: "성능", icon: <Cpu className="w-5 h-5" />, color: "from-red-500 to-rose-600", count: 9 },
  { name: "2D도면 검도 체크리스트", icon: <FileText className="w-5 h-5" />, color: "from-cyan-500 to-sky-600", count: 21 },
  { name: "ES/MS", icon: <ShieldCheck className="w-5 h-5" />, color: "from-slate-500 to-slate-700", count: 27 },
  { name: "커넥터블럭 일체형 PRA", icon: <Maximize2 className="w-5 h-5" />, color: "from-violet-500 to-purple-600", count: 16 },
  { name: "퓨즈통합 PRA", icon: <Zap className="w-5 h-5" />, color: "from-yellow-500 to-amber-600", count: 6 },
];

export default function PRADashboard() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const [pendingAction, setPendingAction] = useState<'access' | 'download'>('access');

  useEffect(() => {
    setMounted(true);
    // Check if already authenticated in this session (optional, for UX)
    const auth = sessionStorage.getItem('pra_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      setPasswordModalOpen(false);
    }
  }, []);

  if (!mounted) return null;

  const filteredData = data.filter((item: any) => {
    const matchesCategory = selectedCategory === "전체" || item.category === selectedCategory;
    const matchesSearch = item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.criteria.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVerifyPassword = async () => {
    setIsVerifying(true);
    setErrorStatus("");

    try {
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const result = await response.json();

      if (result.success) {
        if (pendingAction === 'download') {
          generateExcel();
        } else {
          setIsAuthenticated(true);
          sessionStorage.setItem('pra_auth', 'true');
        }
        setPasswordModalOpen(false);
        setPassword("");
      } else {
        setErrorStatus("비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      setErrorStatus("인증 시스템 오류가 발생했습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

    const generateExcel = () => {
    const excelData = data.map(item => ({
      "번호": item.id,
      "카테고리": item.category,
      "검토 항목": item.item,
      "상세 내용/기준": item.criteria
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PRA_Checklist");

    const wscols = [
      { wch: 6 }, { wch: 12 }, { wch: 30 }, { wch: 80 }
    ];
    worksheet['!cols'] = wscols;

    XLSX.writeFile(workbook, "PRA_Design_Master_Checklist.xlsx");
  };

  const openDownloadModal = () => {
    setPendingAction('download');
    setPasswordModalOpen(true);
  };

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
          <NavIcon icon={<Layers />} active={selectedCategory === "전체"} onClick={() => setSelectedCategory("전체")} />
          <NavIcon icon={<Zap />} active={selectedCategory === "회로"} onClick={() => setSelectedCategory("회회로")} />
          <NavIcon icon={<Cpu />} active={selectedCategory === "성능"} onClick={() => setSelectedCategory("성능")} />
          <NavIcon icon={<Settings />} active={selectedCategory === "조립성"} onClick={() => setSelectedCategory("조립성")} />
        </div>
      </nav>

      {isAuthenticated ? (
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
                  배터리 시스템 전장 설계 최적화를 위한 176개 기술 검토 가이드.
                  국제 표준 및 현대자동차 ES/MS 규격 기반 전문 엔지니어링 체크리스트.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={openDownloadModal}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-3 transition-all font-bold shadow-xl shadow-blue-600/20 active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  Export to Excel
                </button>
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
            <CategoryFilter name="전체" active={selectedCategory === "전체"} onClick={() => setSelectedCategory("전체")} count={176} />
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
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {filteredData.map((item: any) => (
                    <TableRow key={item.id} item={item} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <Lock className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-400">Authentication Required</h2>
            <p className="text-slate-600 mt-2">대시보드를 확인하려면 비밀번호를 입력해 주세요.</p>
          </motion.div>
        </div>
      )}

      {/* Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => {
                if (isAuthenticated) setPasswordModalOpen(false);
              }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
            >
              {isAuthenticated && (
                <button
                  onClick={() => setPasswordModalOpen(false)}
                  className="absolute top-6 right-6 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}

              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-blue-400" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                {pendingAction === 'download' ? 'Secure Download' : 'Secure Access'}
              </h3>
              <p className="text-slate-400 mb-8">
                {pendingAction === 'download'
                  ? '체크리스트 엑셀 다운로드를 위해 부서 내부 비밀번호를 입력해 주세요.'
                  : 'PRA Design Master 대시보드 접근을 위해 비밀번호를 입력해 주세요.'}
              </p>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    autoFocus
                    placeholder="Enter password..."
                    className={`w-full bg-slate-950 border ${errorStatus ? 'border-red-500/50' : 'border-slate-800'} rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-blue-500/50 transition-all`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorStatus("");
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyPassword()}
                  />
                  {errorStatus && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-0 -top-6 text-xs text-red-400 font-medium"
                    >
                      {errorStatus}
                    </motion.p>
                  )}
                </div>

                <button
                  onClick={handleVerifyPassword}
                  disabled={isVerifying || !password}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    pendingAction === 'download' ? "Confirm & Download" : "Verify & Enter"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TableRow({ item }: any) {
  return (
    <>
      <tr className="group hover:bg-slate-800/20 transition-all">
        <td className="px-8 py-6 text-sm font-mono text-slate-500">{item.id}</td>
        <td className="px-8 py-6 font-medium text-slate-200">{item.item}</td>
        <td className="px-8 py-6 text-sm text-slate-400">{item.criteria}</td>
        <td className="px-8 py-6"></td>
      </tr>
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
    <button onClick={onClick} className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all border ${active ? 'bg-white text-slate-950 border-white shadow-lg shadow-white/5' : 'bg-slate-900/40 text-slate-400 border-slate-800/80 hover:border-slate-700'}`}>
      {name} <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800/50">{count}</span>
    </button>
  );
}

function NavIcon({ icon, active, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/5' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}
    >
      {React.cloneElement(icon, { className: "w-6 h-6" })}
    </div>
  );
}
