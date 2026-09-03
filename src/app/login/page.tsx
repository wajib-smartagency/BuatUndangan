"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageSquareHeart, Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Cek apakah admin atau user biasa untuk redirect
        if (data.user.user_metadata?.role === 'admin') {
           router.push("/admin");
        } else {
           router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Email atau password salah.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Kiri (40%): Branding Panel */}
      <div className="hidden lg:flex w-[40%] relative overflow-hidden bg-slate-900 text-white flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-900" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
        
        <div className="relative z-10 flex items-center gap-2">
          <MessageSquareHeart className="w-6 h-6 text-indigo-400" />
          <span className="font-bold text-xl tracking-tight">BuatUndangan</span>
        </div>

        <div className="relative z-10 my-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl font-extrabold mb-6 leading-tight">
              Otomatisasikan <br />
              <span className="text-indigo-400">Undangan Digital</span> <br />
              Anda Hari Ini.
            </h1>
            <p className="text-slate-400 text-lg mb-8 max-w-sm">
              Bergabunglah dengan para Wedding Organizer dan Event Planner profesional yang telah menghemat waktu mereka.
            </p>
            
            <div className="w-full max-w-sm h-64 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                     <div className="h-3 w-24 bg-slate-700 rounded mb-2"></div>
                     <div className="h-2 w-16 bg-slate-700 rounded"></div>
                  </div>
                </div>
                <div className="h-px w-full bg-slate-700/50" />
                <div className="space-y-3 mt-2">
                  <div className="h-8 w-full bg-slate-700/50 rounded-lg" />
                  <div className="h-8 w-3/4 bg-slate-700/50 rounded-lg" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm">
          © 2026 BuatUndangan
        </div>
      </div>

      {/* Kanan (60%): Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 relative">
        <Link href="/" className="absolute top-8 right-8 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          Kembali ke Beranda
        </Link>
        
        <div className="w-full max-w-md mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Selamat Datang Kembali</h2>
            <p className="text-slate-500">Masuk untuk mengelola daftar tamu Anda.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1 relative group">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="anda@contoh.com"
                />
              </div>
            </div>

            <div className="space-y-1 relative group">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Link href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Lupa password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold transition-all transform active:scale-95 disabled:opacity-70 shadow-md mt-8"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Masuk ke Dasbor <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Daftar Gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
