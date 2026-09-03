"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  CreditCard,
  Network,
  Activity,
  Menu, 
  X,
  LogOut,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/admin" },
    { name: "Manajemen User", icon: Users, href: "/admin/users" },
    { name: "Approval Pembayaran", icon: CreditCard, href: "/admin/payments" },
    { name: "API Providers", icon: Network, href: "/admin/providers" },
    { name: "Audit Logs", icon: Activity, href: "/admin/logs" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Admin Sidebar (Dark Theme) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-slate-950 border-r border-slate-800 z-50 transform transition-transform duration-300 ease-in-out flex flex-col text-slate-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-800/60">
          <Link href="/admin" className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex flex-col">
               <span className="font-bold text-sm tracking-tight text-white leading-tight">Superadmin</span>
               <span className="text-xs text-slate-500 font-medium">BuatUndangan</span>
            </div>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-4 py-6 flex-1 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Main Menu</p>
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="admin-active-indicator"
                      className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* System Status */}
        <div className="p-4 border-t border-slate-800 mt-auto">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="font-bold text-xs text-emerald-400 uppercase tracking-wider">System Operational</span>
            </div>
            <p className="text-[11px] text-emerald-500/70">Database & API Services normal.</p>
          </div>
          
          <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors text-left group">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">SA</span>
               </div>
               <div>
                 <h4 className="text-sm font-bold text-white leading-none">Super Admin</h4>
               </div>
            </div>
            <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Mobile */}
        <header className="bg-slate-950 border-b border-slate-800 px-4 py-4 flex items-center justify-between lg:hidden sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-300">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-bold text-lg text-white">Superadmin</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
             <span className="text-xs font-bold text-white">SA</span>
          </div>
        </header>

        {/* Dashboard Topbar (Desktop) */}
        <header className="hidden lg:flex bg-white/60 backdrop-blur-md border-b border-slate-200 px-8 py-4 items-center justify-between sticky top-0 z-30 shadow-sm">
           <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
             <ShieldCheck className="w-4 h-4" />
             <ChevronRight className="w-4 h-4" />
             <span className="text-slate-900">Admin Control Panel</span>
           </div>
           <div className="flex items-center gap-3">
             <div className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200">
                v1.2.0-beta
             </div>
           </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
