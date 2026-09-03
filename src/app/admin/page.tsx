"use client";

import React from "react";
import { 
  Users, 
  CreditCard, 
  Network, 
  Activity,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldAlert,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";

// Dummy Data
const pendingPayments = [
  { id: "INV-0992", user: "Rina Maharani", plan: "Paket Personal", amount: "Rp 199.000", bank: "BCA", time: "10 mnt lalu" },
  { id: "INV-0993", user: "Budi Organizer", plan: "Paket Pro (EO)", amount: "Rp 899.000", bank: "Mandiri", time: "1 jam lalu" },
  { id: "INV-0994", user: "Siti Rahma", plan: "Paket Personal", amount: "Rp 199.000", bank: "BNI", time: "3 jam lalu" },
];

const apiStatus = [
  { name: "Supabase Database", status: "Operational", latency: "45ms", provider: "AWS Singapore" },
  { name: "Resend (Email Gateway)", status: "Operational", latency: "120ms", provider: "Global" },
  { name: "Watzap (WA Gateway)", status: "Degraded", latency: "850ms", provider: "Local" },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Superadmin Overview</h1>
        <p className="text-slate-500">Pusat kendali operasional BuatUndangan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Total Users</h3>
          <div className="flex items-end gap-3">
             <p className="text-3xl font-bold text-slate-900">4,210</p>
             <span className="text-sm font-bold text-emerald-500 flex items-center"><ArrowUpRight className="w-4 h-4"/> 12%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Total Proyek Aktif</h3>
          <p className="text-3xl font-bold text-slate-900">1,845</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <CreditCard className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">Action Required</span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">Pending Pembayaran Manual</h3>
            <p className="text-3xl font-bold text-white">3 <span className="text-lg text-slate-500 font-normal">Menunggu</span></p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Manual Payment Approvals */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Approval Pembayaran Manual</h3>
              <p className="text-sm text-slate-500">Konfirmasi transfer bank manual.</p>
            </div>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
              3 Pending
            </span>
          </div>
          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-4 font-semibold">User & Invoice</th>
                  <th className="p-4 font-semibold">Nominal</th>
                  <th className="p-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 text-sm">{payment.user}</p>
                      <p className="text-xs text-slate-500">{payment.id} • {payment.bank}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-700 text-sm">{payment.amount}</p>
                      <p className="text-xs text-indigo-600 font-medium">{payment.plan}</p>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                       <button className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors" title="Terima">
                         <CheckCircle2 className="w-5 h-5" />
                       </button>
                       <button className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Tolak">
                         <XCircle className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* API Providers Status */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Status API Providers</h3>
              <p className="text-sm text-slate-500">Monitoring koneksi layanan pihak ketiga.</p>
            </div>
            <button className="text-sm text-indigo-600 font-medium hover:underline">Kelola API</button>
          </div>
          <div className="p-6 space-y-4">
            {apiStatus.map((api, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <Network className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{api.name}</h4>
                    <p className="text-xs text-slate-500">Latensi: {api.latency} • {api.provider}</p>
                  </div>
                </div>
                <div>
                   {api.status === 'Operational' ? (
                     <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                       Operational
                     </span>
                   ) : (
                     <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
                       <ShieldAlert className="w-3.5 h-3.5" />
                       Degraded
                     </span>
                   )}
                </div>
              </div>
            ))}
            
            <div className="mt-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
               <Eye className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
               <div>
                 <h4 className="font-bold text-indigo-900 text-sm">User Impersonation Tool</h4>
                 <p className="text-xs text-indigo-700 mt-1">Sebagai Superadmin, Anda dapat login sebagai user mana saja tanpa password untuk tujuan investigasi bug / support.</p>
                 <button className="mt-2 text-xs font-bold bg-white text-indigo-600 px-3 py-1.5 rounded-md border border-indigo-200 shadow-sm hover:bg-indigo-600 hover:text-white transition-colors">
                   Mulai Impersonate
                 </button>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
