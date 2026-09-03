"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MessageSquareHeart, 
  Home, 
  FolderOpen, 
  Settings, 
  Menu, 
  X,
  LogOut,
  ChevronRight,
  Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{full_name: string, email: string, role: string} | null>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        setUserProfile({
          full_name: profile?.full_name || "User",
          email: user.email || "",
          role: profile?.role || "personal"
        });
      }
    };
    fetchUser();
  }, []);

  const navItems = [
    { name: "Beranda", icon: Home, href: "/dashboard" },
    { name: "Proyek", icon: FolderOpen, href: "/dashboard/projects" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-indigo-600">
            <MessageSquareHeart className="w-7 h-7" />
            <span className="font-bold text-xl tracking-tight text-slate-900">BuatUndangan</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-4 py-2 flex-1">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute left-0 w-1 h-8 bg-indigo-600 rounded-r-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Profile & Badge */}
        <div className="p-4 border-t border-slate-100 mt-auto">
          <div className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl p-4 text-white mb-4 shadow-lg shadow-indigo-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">{userProfile?.role === 'pro' ? 'Paket Pro (EO)' : 'Paket Personal'}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-medium">Aktif</span>
            </div>
            <p className="text-xs text-indigo-100">Buat undangan tanpa batas</p>
          </div>
          
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors text-left group">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center border border-slate-300 group-hover:border-indigo-400 transition-colors">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.full_name || 'User'}`} alt="Avatar" className="w-full h-full" />
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-sm font-bold text-slate-900 truncate">{userProfile?.full_name || 'Loading...'}</h4>
              <p className="text-xs text-slate-500 truncate">{userProfile?.email || '...'}</p>
            </div>
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Mobile */}
        <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between lg:hidden sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 hover:text-slate-900">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 text-indigo-600">
            <MessageSquareHeart className="w-6 h-6" />
            <span className="font-bold text-lg text-slate-900">invitation-maker</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full" />
          </div>
        </header>

        {/* Dashboard Topbar (Desktop) */}
        <header className="hidden lg:flex bg-white/50 backdrop-blur-md border-b border-slate-200 px-8 py-4 items-center justify-between sticky top-0 z-30">
           <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
             <Home className="w-4 h-4" />
             <ChevronRight className="w-4 h-4" />
             <span className="text-slate-900">Beranda</span>
           </div>
           <div className="flex items-center gap-4">
             <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors relative">
               <Bell className="w-5 h-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
             <Link href="/dashboard/projects/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
               + Buat Proyek Baru
             </Link>
           </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
