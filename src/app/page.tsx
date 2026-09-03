"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquareHeart,
  Users,
  Palette,
  Send,
  Download,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* 1. Navbar */}
      <nav className="fixed w-full top-0 z-50 glass-panel border-b-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                <MessageSquareHeart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                BuatUndangan
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#fitur" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Fitur</Link>
              <Link href="#harga" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Harga</Link>
              <Link href="#faq" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">FAQ</Link>
              <div className="flex items-center gap-4 ml-4">
                <Link href="/login" className="text-slate-900 font-medium hover:text-indigo-600 transition-colors">
                  Masuk
                </Link>
                <Link href="/register" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full font-medium transition-all transform hover:scale-105 shadow-md hover:shadow-xl">
                  Coba Gratis
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 absolute w-full shadow-lg">
            <div className="flex flex-col space-y-4">
              <Link href="#fitur" className="text-slate-600 font-medium p-2 hover:bg-slate-50 rounded-lg">Fitur</Link>
              <Link href="#harga" className="text-slate-600 font-medium p-2 hover:bg-slate-50 rounded-lg">Harga</Link>
              <Link href="#faq" className="text-slate-600 font-medium p-2 hover:bg-slate-50 rounded-lg">FAQ</Link>
              <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                <Link href="/login" className="text-center font-medium p-2 border border-slate-200 rounded-lg">Masuk</Link>
                <Link href="/register" className="text-center font-medium p-2 bg-slate-900 text-white rounded-lg">Coba Gratis</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-400 blur-[100px] rounded-full mix-blend-multiply" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
            
            {/* 2. Pre-headline badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium text-sm mb-8">
              <span>✨</span>
              Platform Pembuatan Undangan Digital #1 di Indonesia
            </motion.div>

            {/* 3. Headline (H1) */}
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
              Buat Undangan Digital Premium <br className="hidden md:block" />
              <span className="text-gradient">dalam Hitungan Menit.</span>
            </motion.h1>

            {/* 4. Sub-headline */}
            <motion.p variants={fadeInUp} className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Tinggalkan cara lama yang merepotkan. Kelola daftar tamu, sebar undangan otomatis, dan pantau kehadiran (RSVP) secara real-time dari satu dashboard interaktif.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Link href="/register" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2">
                Buat Undangan Sekarang <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#demo" className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-full font-semibold text-lg border border-slate-200 transition-all shadow-sm">
                Lihat Contoh Undangan
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* 5. Hero section: browser frame */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-xl p-2 shadow-2xl">
            <div className="rounded-xl overflow-hidden border border-slate-100 bg-white shadow-inner">
              {/* Browser Header */}
              <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto bg-white text-slate-400 text-xs px-4 py-1.5 rounded-md flex items-center gap-2 w-1/2 max-w-md border border-slate-200 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  app.BuatUndangan/dashboard
                </div>
              </div>
              {/* Fake Dashboard Content */}
              <div className="h-[400px] md:h-[600px] bg-slate-50 p-6 relative overflow-hidden flex">
                {/* Fake Sidebar */}
                <div className="w-64 hidden md:flex flex-col gap-4 border-r border-slate-200 pr-6">
                  <div className="h-8 bg-slate-200 rounded-md w-3/4 mb-4"></div>
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-slate-200/50 rounded-lg w-full"></div>)}
                </div>
                {/* Fake Main Area */}
                <div className="flex-1 md:pl-6 flex flex-col gap-6">
                  <div className="h-10 bg-slate-200 rounded-md w-1/3"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2"><Users size={20}/></div>
                      <div className="text-2xl font-bold text-slate-800">450</div>
                      <div className="text-sm text-slate-500">Total Tamu Diundang</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2"><CheckCircle2 size={20}/></div>
                      <div className="text-2xl font-bold text-slate-800">320</div>
                      <div className="text-sm text-slate-500">RSVP Hadir</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                      <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-2"><MessageSquareHeart size={20}/></div>
                      <div className="text-2xl font-bold text-slate-800">185</div>
                      <div className="text-sm text-slate-500">Ucapan Diterima</div>
                    </div>
                  </div>
                  <div className="flex-1 bg-white border border-slate-100 rounded-xl shadow-sm p-4">
                    <div className="h-full w-full bg-slate-50/50 rounded border border-slate-100 flex items-center justify-center flex-col gap-4">
                       <Palette className="w-12 h-12 text-slate-300" />
                      <span className="text-slate-400 font-medium">Live Editor Undangan Digital</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 6. Bullet point masalah user */}
      <div className="py-24 bg-white border-y border-slate-100" id="fitur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Mengapa memilih platform kami?</h2>
            <p className="text-lg text-slate-600">Solusi modern untuk setiap hambatan dalam persiapan acara Anda.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -5 }} className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Desain Undangan Pasaran?</h3>
              <p className="text-slate-600 mb-4">Dapatkan akses ke ratusan template premium yang elegan, modern, dan bebas dikustomisasi sesuai tema acara Anda.</p>
              <div className="flex items-center gap-2 text-indigo-600 font-medium">
                <CheckCircle2 className="w-5 h-5" /> 100+ Premium Templates
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Ribet Sebar Satu-Satu?</h3>
              <p className="text-slate-600 mb-4">Cukup upload nama tamu, sistem kami akan menyebar undangan otomatis via WhatsApp dan Email secara masal.</p>
              <div className="flex items-center gap-2 text-indigo-600 font-medium">
                <CheckCircle2 className="w-5 h-5" /> Blast WhatsApp & Email
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Sulit Rekap Tamu (RSVP)?</h3>
              <p className="text-slate-600 mb-4">Pantau siapa yang hadir secara real-time. Data kehadiran tamu tersimpan rapi dan siap diekspor kapan saja.</p>
              <div className="flex items-center gap-2 text-indigo-600 font-medium">
                <CheckCircle2 className="w-5 h-5" /> Live RSVP Tracking
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 8. Fitur Grid */}
      <div className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-slate-900 to-slate-900" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Cocok untuk EO & Pengguna Pribadi</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Fitur kelas profesional yang dikemas dalam antarmuka yang sangat mudah digunakan.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-10">
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Manajemen Multi-Event</h3>
                  <p className="text-slate-400">Bagi Event Organizer (EO), Anda bisa mengelola undangan pernikahan Klien A dan acara ulang tahun Klien B di workspace terpisah tanpa khawatir data tercampur.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Ekspor Buku Tamu Digital</h3>
                  <p className="text-slate-400">Setelah acara selesai, cukup satu klik untuk mengunduh seluruh daftar kehadiran dan ucapan dari tamu dalam format PDF atau Excel yang rapi.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MessageSquareHeart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Ucapan & Amplop Digital</h3>
                  <p className="text-slate-400">Sediakan kolom ucapan interaktif dan fasilitasi pemberian hadiah / angpao secara cashless langsung dari undangan.</p>
                </div>
              </div>
            </div>
            
            {/* 7. Interactive Dashboard Preview */}
            <div className="relative h-[400px] w-full rounded-2xl bg-gradient-to-br from-indigo-900/50 to-slate-800/50 border border-slate-700/50 p-2 overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
               <div className="w-full h-full bg-slate-900 rounded-xl shadow-2xl relative overflow-hidden border border-slate-800 p-6 flex flex-col gap-4">
                  {/* Mock UI */}
                  <div className="h-8 w-1/3 bg-slate-800 rounded-lg"></div>
                  <div className="flex gap-4">
                    <div className="h-24 flex-1 bg-slate-800 rounded-lg animate-pulse border border-slate-700"></div>
                    <div className="h-24 flex-1 bg-slate-800 rounded-lg animate-pulse delay-75 border border-slate-700"></div>
                    <div className="h-24 flex-1 bg-slate-800 rounded-lg animate-pulse delay-150 border border-slate-700"></div>
                  </div>
                  <div className="flex-1 bg-slate-800 rounded-lg border border-slate-700 relative overflow-hidden flex items-center justify-center">
                     <p className="text-slate-500 font-medium">Buku Tamu Real-time Sync</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 9. Testimoni (Masonry Style Grid) */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Dipercaya oleh Ratusan WO & Personal</h2>
            <p className="text-lg text-slate-600">Lihat apa kata mereka setelah menggunakan BuatUndangan.</p>
          </div>
          
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[
              { text: "Luar biasa! Dulu bikin link undangan satu-satu bisa seharian, sekarang ada fitur broadcast WA langsung beres dalam hitungan menit.", name: "Budi Santoso", role: "Wedding Organizer" },
              { text: "Desain undangannya sangat premium dan elegan. Calon mertua saya sampai kagum melihat hasilnya. Terima kasih!", name: "Siti Rahma", role: "Calon Pengantin" },
              { text: "Fitur multi-workspacenya sangat membantu WO kami. Kami bisa handle puluhan klien berbarengan tanpa takut data undangannya tertukar.", name: "Andi Wijaya", role: "Event Organizer" },
              { text: "Fitur RSVP-nya juara. Saya bisa tau persis berapa porsi catering yang harus disiapkan berdasarkan tamu yang konfirmasi hadir.", name: "Diana Putri", role: "Event Planner" },
              { text: "Dari sisi harga sangat masuk akal karena bayar sekali (lifetime). Cocok banget buat bisnis vendor undangan seperti saya.", name: "Reza Pahlevi", role: "Pemilik Vendor Undangan" },
            ].map((review, i) => (
              <div key={i} className="break-inside-avoid bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex text-amber-400 mb-4">{"★".repeat(5)}</div>
                <p className="text-slate-700 mb-6 font-medium">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                    <p className="text-xs text-slate-500">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 10. Pricing */}
      <div className="py-24 bg-white" id="harga">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Bayar Sekali, Buat Undangan Selamanya</h2>
            <p className="text-xl text-slate-600 mb-8">Tidak ada biaya bulanan. Dapatkan akses selamanya dengan harga spesial hari ini.</p>
            
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-full">
              <button 
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${!isAnnual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Personal
              </button>
              <button 
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${isAnnual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Pro (WO/EO)
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Starter Plan */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Paket Personal</h3>
              <p className="text-slate-500 mb-6">Cocok untuk pasangan yang ingin mengelola undangannya sendiri.</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-slate-900">Rp 199.000</span>
                <span className="text-slate-500"> / selamanya</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Akses ke semua template undangan', 'Tamu tidak dibatasi (Unlimited)', 'Fitur RSVP & Ucapan', 'Broadcast WhatsApp (Manual)'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors">
                Pilih Personal
              </button>
            </div>

            {/* Pro Plan */}
            <div className="rounded-3xl border-2 border-indigo-600 bg-slate-900 text-white p-8 shadow-xl flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                Paling Laris
              </div>
              <h3 className="text-2xl font-bold mb-2">Paket Pro (Agency)</h3>
              <p className="text-slate-400 mb-6">Untuk Wedding Organizer & Vendor Undangan Digital.</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-white">Rp 899.000</span>
                <span className="text-slate-400"> / selamanya</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Semua fitur Paket Personal', 'Sistem Multi-Workspace (Banyak Klien)', 'Ekspor Buku Tamu ke Excel & PDF', 'Otomatisasi Blast WA & Email', 'Hapus Watermark (White-label)'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-600/30">
                Ambil Pro Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 11. FAQ */}
      <div className="py-24 bg-slate-50" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Pertanyaan yang Sering Diajukan</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Apakah saya perlu bisa coding untuk bikin undangan?", a: "Sama sekali tidak. Kami menyediakan editor visual yang sangat mudah (drag-and-drop) dan ratusan template siap pakai." },
              { q: "Apakah ada batasan jumlah tamu yang bisa diundang?", a: "Tidak ada! Anda bisa mengundang berapapun tamu yang Anda inginkan (Unlimited Guests) tanpa biaya tambahan." },
              { q: "Bisa untuk acara selain pernikahan?", a: "Tentu. Platform kami didesain fleksibel untuk berbagai acara seperti Ulang Tahun, Tasyakuran, Seminar, hingga event Perusahaan." },
              { q: "Bagaimana cara kerja fitur RSVP?", a: "Tamu yang menerima link akan mengisi form kehadiran. Datanya otomatis masuk ke dashboard Anda secara real-time, sehingga Anda tahu persis berapa yang hadir." },
              { q: "Apakah buku tamu bisa dicetak / diekspor?", a: "Ya, pengguna paket Pro dapat mengekspor seluruh data kehadiran dan ucapan ke format PDF atau Excel dengan satu klik." },
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-slate-200 shadow-sm [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-bold text-slate-900">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* 12. Final CTA */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-900" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Mulai buat undangan serumu hari ini.</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Bergabunglah dengan ratusan WO dan calon pengantin lainnya yang telah menciptakan momen tak terlupakan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-900 px-8 py-4 rounded-full font-bold text-lg transition-transform transform hover:scale-105 shadow-xl">
              Buat Undangan Gratis
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <MessageSquareHeart className="w-5 h-5 text-indigo-500" />
            <span className="font-bold text-white tracking-tight">BuatUndangan</span>
          </div>
          <p className="text-sm">© 2026 BuatUndangan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
