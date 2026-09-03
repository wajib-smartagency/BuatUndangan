"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, Smartphone, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LiveEditorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "Pernikahan Romeo & Juliet",
    groomName: "Romeo Montague",
    brideName: "Juliet Capulet",
    date: "2026-12-25",
    location: "Gedung Pernikahan Megah, Jakarta",
    greeting: "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami."
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Dapatkan data user yang sedang login
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Silakan login terlebih dahulu untuk menyimpan proyek.");
        setIsLoading(false);
        return;
      }

      // Menyimpan data ke tabel 'projects'
      const { error } = await supabase.from('projects').insert([
        { 
          user_id: user.id,
          title: formData.title,
          event_date: formData.date,
          slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
          is_published: false
        }
      ]);
      
      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Gagal menyimpan proyek. Pastikan struktur tabel Supabase sudah di-migrate.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col -m-4 sm:-m-8">
      {/* Editor Topbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">Editor Undangan Baru</h1>
            <p className="text-xs text-slate-500">Belum disimpan</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {success && (
             <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4" /> Tersimpan
             </span>
          )}
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-70 shadow-sm"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Proyek
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Kiri: Form Editor */}
        <div className="w-full lg:w-[45%] xl:w-[40%] bg-white border-r border-slate-200 overflow-y-auto custom-scrollbar p-6">
          
          <div className="mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-indigo-900 text-sm">Magic Live Preview</h3>
              <p className="text-xs text-indigo-700 mt-1">Setiap perubahan yang Anda ketik akan langsung terlihat di layar HP sebelah kanan secara *real-time*.</p>
            </div>
          </div>

          <form className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Informasi Dasar</h2>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Proyek / URL</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Mempelai Pria</label>
                  <input type="text" name="groomName" value={formData.groomName} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Mempelai Wanita</label>
                  <input type="text" name="brideName" value={formData.brideName} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Detail Acara</h2>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal & Waktu</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lokasi Acara</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teks Pembuka (Greeting)</label>
                <textarea rows={4} name="greeting" value={formData.greeting} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none" />
              </div>
            </div>
          </form>
        </div>

        {/* Kanan: Live Preview (Smartphone Mockup) */}
        <div className="hidden lg:flex flex-1 bg-slate-100 items-center justify-center p-8 relative overflow-hidden">
          
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
          
          {/* Mobile Phone Mockup */}
          <div className="relative w-[360px] h-[720px] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800 z-10 shrink-0">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20"></div>
             
             {/* Layar Undangan */}
             <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative flex flex-col font-serif">
                {/* Visual Template */}
                <div className="relative h-2/5 w-full bg-slate-200 flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-teal-50"></div>
                   <div className="relative z-10 text-center">
                     <div className="w-24 h-32 border border-rose-300 mx-auto rounded-t-full mb-3 bg-white/50 backdrop-blur-sm p-1">
                        <div className="w-full h-full bg-rose-50 rounded-t-full flex items-center justify-center">
                           <span className="text-2xl text-rose-300">💍</span>
                        </div>
                     </div>
                     <p className="text-[10px] tracking-widest text-slate-500 uppercase font-sans">The Wedding Of</p>
                   </div>
                </div>

                {/* Teks Dinamis dari Editor */}
                <div className="flex-1 p-6 text-center flex flex-col items-center bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]">
                   <h2 className="text-3xl font-bold text-slate-800 mt-2 font-serif text-amber-900 leading-tight">
                     {formData.groomName} <br/> <span className="text-xl">&</span> <br/> {formData.brideName}
                   </h2>
                   
                   <p className="text-xs text-slate-500 mt-6 font-sans leading-relaxed px-4">
                     {formData.greeting}
                   </p>

                   <div className="mt-8 border-y border-amber-200 py-4 w-full">
                     <p className="text-sm font-bold text-amber-900 font-sans tracking-widest">
                       {new Date(formData.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                     </p>
                     <p className="text-xs text-slate-500 mt-2 font-sans">{formData.location}</p>
                   </div>

                   <button className="mt-auto mb-4 w-full bg-amber-800 text-white text-sm font-sans font-bold py-3 rounded-full shadow-lg">
                      Buka Undangan
                   </button>
                </div>
             </div>
          </div>

          <div className="absolute bottom-8 right-8 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md text-slate-500 text-sm font-medium">
             <Smartphone className="w-4 h-4" /> Preview Mode
          </div>
        </div>
      </div>
    </div>
  );
}
