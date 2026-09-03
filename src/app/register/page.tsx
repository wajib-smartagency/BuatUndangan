"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageSquareHeart, Mail, Lock, ArrowRight, User } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Panggil API Supabase untuk Sign Up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: "personal"
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        setSuccessMsg("Berhasil! Silakan cek email Anda untuk verifikasi.");
        // Redirect ke dashboard setelah 2 detik
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat mendaftar.");
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
              Mulai Petualangan <br />
              <span className="text-indigo-400">Pernikahan Anda</span> <br />
              Di Sini.
            </h1>
            <p className="text-slate-400 text-lg mb-8 max-w-sm">
              Buat undangan digital impian Anda secara gratis. Tidak perlu kartu kredit.
            </p>
            
            <div className="w-full max-w-sm h-64 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col gap-4 h-full justify-center items-center text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-2">
                    <MessageSquareHeart className="text-indigo-400 w-8 h-8"/>
                </div>
                <div className="h-4 w-32 bg-slate-700 rounded"></div>
                <div className="h-2 w-48 bg-slate-700 rounded"></div>
                <div className="h-10 w-32 bg-indigo-500/20 rounded-full mt-4"></div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm">
          © 2026 BuatUndangan
        </div>
      </div>

      {/* Kanan (60%): Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 relative overflow-y-auto">
        <Link href="/" className="absolute top-8 right-8 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          Kembali ke Beranda
        </Link>
        
        <div className="w-full max-w-md mx-auto py-10">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Buat Akun Gratis</h2>
            <p className="text-slate-500">Persiapkan acara Anda dengan mudah.</p>
          </div>

          {/* Error & Success Messages */}
          {errorMsg && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-4 rounded-lg bg-emerald-50 text-emerald-600 text-sm font-medium border border-emerald-100">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1 relative group">
              <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Nama Lengkap Anda"
                />
              </div>
            </div>

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
              <label className="text-sm font-medium text-slate-700">Password</label>
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
                  placeholder="Minimal 6 karakter"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold transition-all transform active:scale-95 disabled:opacity-70 shadow-md mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Daftar Sekarang <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
