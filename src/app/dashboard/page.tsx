"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  CheckCircle2, 
  MessageSquareHeart, 
  Send,
  MoreVertical,
  Download,
  Filter,
  Check
} from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dummy Data
const chartData = [
  { name: 'Jan', tamu: 400 },
  { name: 'Feb', tamu: 300 },
  { name: 'Mar', tamu: 550 },
  { name: 'Apr', tamu: 200 },
  { name: 'Mei', tamu: 700 },
  { name: 'Jun', tamu: 450 },
];

const recentRSVP = [
  { id: 1, name: "Andi & Keluarga", status: "Hadir", message: "Selamat ya! Semoga langgeng.", event: "Pernikahan Sarah & Budi", time: "2 jam yang lalu" },
  { id: 2, name: "Rina Maharani", status: "Tidak Hadir", message: "Maaf banget lagi dinas luar kota.", event: "Pernikahan Sarah & Budi", time: "5 jam yang lalu" },
  { id: 3, name: "Bapak Supriyadi", status: "Hadir", message: "Insya Allah hadir berdua.", event: "Khitanan Daffa", time: "1 hari yang lalu" },
  { id: 4, name: "Dimas", status: "Hadir", message: "Pasti datang bro!", event: "Pernikahan Sarah & Budi", time: "1 hari yang lalu" },
  { id: 5, name: "Tante Linda", status: "Hadir", message: "Selamat menempuh hidup baru.", event: "Pernikahan Sarah & Budi", time: "2 hari yang lalu" },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data fetching for skeleton loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
        
        {/* Stats Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-32">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                <div className="w-20 h-4 bg-slate-100 rounded"></div>
              </div>
              <div className="w-1/2 h-6 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* Chart & Table Skeletons */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm h-[400px]"></div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm h-[400px]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ringkasan Dasbor</h1>
          <p className="text-slate-500">Pantau aktivitas seluruh proyek undangan Anda hari ini.</p>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> +12%
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Total Tamu (Semua Proyek)</h3>
          <p className="text-3xl font-bold text-slate-900">2,650</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Aktif
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">RSVP Hadir</h3>
          <p className="text-3xl font-bold text-slate-900">1,820</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <MessageSquareHeart className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Ucapan & Doa Masuk</h3>
          <p className="text-3xl font-bold text-slate-900">945</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>
             <span className="inline-flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              Unlimited Plan
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Sisa Kuota Blast WA</h3>
          <p className="text-3xl font-bold text-slate-900">∞</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Performa Kehadiran (6 Bulan)</h3>
              <p className="text-sm text-slate-500">Statistik jumlah tamu yang melakukan RSVP Hadir.</p>
            </div>
            <button className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="tamu" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Logs Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Log RSVP Terbaru</h3>
              <p className="text-sm text-slate-500">Update langsung dari tamu.</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {recentRSVP.map((rsvp) => (
              <div key={rsvp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${rsvp.status === 'Hadir' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="font-bold text-slate-900 text-sm">{rsvp.name}</span>
                  </div>
                  <span className="text-xs text-slate-400">{rsvp.time}</span>
                </div>
                <p className="text-xs text-slate-500 mb-2 truncate">Acara: {rsvp.event}</p>
                {rsvp.message && (
                  <div className="bg-white p-2 border border-slate-100 rounded-lg text-sm text-slate-600 italic">
                    "{rsvp.message}"
                  </div>
                )}
              </div>
            ))}
          </div>

          <button className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 py-3 rounded-xl hover:bg-indigo-100 transition-colors">
            <Download className="w-4 h-4" /> Ekspor Semua Data (PDF)
          </button>
        </motion.div>
      </div>
    </div>
  );
}
