"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock, Heart, Send, CheckCircle2, Music } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PublicInvitationPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [rsvpForm, setRsvpForm] = useState({ name: "", status: "hadir", pax: "1", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Simulasi data dari Database berdasarkan Slug
  const eventData = {
    groom: "Budi Santoso",
    bride: "Sarah Wijaya",
    date: "Sabtu, 25 Desember 2026",
    time: "09:00 WIB - Selesai",
    location: "Gedung Pernikahan Megah, Jakarta Selatan",
    greeting: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai."
  };

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Menyimpan data ke tabel 'rsvps'
      // Catatan: project_id & guest_id dikosongkan/dummy sementara sampai ada integrasi params
      const { error } = await supabase.from('rsvps').insert([
        { 
          status: rsvpForm.status,
          pax: parseInt(rsvpForm.pax),
          message: rsvpForm.message || "Nama: " + rsvpForm.name
        }
      ]);
      
      if (error) throw error;
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      alert("Gagal mengirim RSVP. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cover Screen (Sebelum dibuka)
  if (!isOpened) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex justify-center items-center overflow-hidden font-serif">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        
        <div className="relative z-10 text-center px-6 max-w-md w-full flex flex-col items-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-amber-200 tracking-[0.3em] text-sm uppercase mb-6">
            The Wedding Of
          </motion.p>
          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 1 }} className="text-5xl md:text-6xl text-white mb-8 font-bold leading-tight drop-shadow-lg">
            {eventData.groom} <br/> <span className="text-3xl text-amber-400 italic font-light">&</span> <br/> {eventData.bride}
          </motion.h1>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mb-12">
            <p className="text-slate-300 text-sm mb-2">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-2 rounded-lg text-white font-bold text-lg font-sans">
              Tamu Spesial
            </div>
          </motion.div>

          <motion.button 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
            onClick={() => setIsOpened(true)}
            className="bg-amber-600 hover:bg-amber-500 text-white font-sans font-bold px-8 py-4 rounded-full shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all flex items-center gap-2"
          >
            <Heart className="w-5 h-5 fill-current" /> Buka Undangan
          </motion.button>
        </div>
      </div>
    );
  }

  // Inside Invitation (Setelah dibuka)
  return (
    <div className="min-h-screen bg-slate-50 font-serif pb-20 relative max-w-md mx-auto shadow-2xl border-x border-slate-200 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]">
      
      {/* Floating Music Button */}
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="fixed bottom-6 right-6 lg:right-[calc(50%-13rem)] z-50 w-12 h-12 bg-amber-800 text-white rounded-full flex items-center justify-center shadow-lg"
      >
        <Music className={`w-5 h-5 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
      </button>

      {/* Hero Header */}
      <div className="relative h-96 flex flex-col items-center justify-center text-center p-6 overflow-hidden bg-slate-900 rounded-b-[3rem]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        
        <div className="relative z-10">
          <h2 className="text-4xl text-white font-bold mb-2">{eventData.groom}</h2>
          <span className="text-2xl text-amber-400 italic">&</span>
          <h2 className="text-4xl text-white font-bold mt-2">{eventData.bride}</h2>
        </div>
      </div>

      {/* Greeting Section */}
      <div className="px-8 py-12 text-center relative">
        <div className="text-amber-800 mb-6 flex justify-center"><Heart className="w-8 h-8 opacity-50" /></div>
        <p className="text-slate-600 leading-relaxed font-sans text-sm">
          {eventData.greeting}
        </p>
      </div>

      {/* Event Details Card */}
      <div className="px-6 mb-12">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-amber-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200"></div>
          
          <h3 className="text-2xl font-bold text-amber-900 mb-8">Resepsi Pernikahan</h3>
          
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mb-3 text-amber-700">
                <Calendar className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-800 font-sans">{eventData.date}</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mb-3 text-amber-700">
                <Clock className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-800 font-sans">{eventData.time}</p>
            </div>

            <div className="flex flex-col items-center border-t border-slate-100 pt-6">
              <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mb-3 text-amber-700">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-800 font-sans mb-1">{eventData.location}</p>
              <button className="mt-3 bg-slate-900 text-white font-sans text-xs font-bold px-6 py-2.5 rounded-full hover:bg-slate-800 transition-colors">
                Buka di Google Maps
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP Form Section */}
      <div className="px-6">
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-8 opacity-10"><Send className="w-24 h-24" /></div>
           
           <div className="relative z-10">
             <h3 className="text-2xl font-bold text-amber-400 mb-2">Buku Tamu & RSVP</h3>
             <p className="text-slate-400 text-sm font-sans mb-8">Mohon konfirmasi kehadiran Anda untuk membantu kami menyiapkan hidangan dengan baik.</p>

             <AnimatePresence mode="wait">
               {!isSubmitted ? (
                 <motion.form 
                   key="form"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   onSubmit={handleRSVPSubmit} 
                   className="space-y-5 font-sans"
                 >
                   <div className="space-y-1">
                     <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Nama Anda</label>
                     <input type="text" required value={rsvpForm.name} onChange={e => setRsvpForm({...rsvpForm, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400" placeholder="Ketik nama Anda..." />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                       <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Kehadiran</label>
                       <select value={rsvpForm.status} onChange={e => setRsvpForm({...rsvpForm, status: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 appearance-none">
                         <option value="hadir">Hadir</option>
                         <option value="tidak">Tidak Hadir</option>
                         <option value="ragu">Masih Ragu</option>
                       </select>
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Jumlah Tamu</label>
                       <select disabled={rsvpForm.status === 'tidak'} value={rsvpForm.pax} onChange={e => setRsvpForm({...rsvpForm, pax: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 appearance-none disabled:opacity-50">
                         <option value="1">1 Orang</option>
                         <option value="2">2 Orang</option>
                       </select>
                     </div>
                   </div>

                   <div className="space-y-1">
                     <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ucapan & Doa</label>
                     <textarea rows={3} value={rsvpForm.message} onChange={e => setRsvpForm({...rsvpForm, message: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 resize-none" placeholder="Berikan ucapan untuk pengantin..." />
                   </div>

                   <button disabled={isSubmitting} type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2">
                     {isSubmitting ? <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <>Kirim Konfirmasi <Send className="w-4 h-4" /></>}
                   </button>
                 </motion.form>
               ) : (
                 <motion.div 
                   key="success"
                   initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                   className="py-8 text-center font-sans"
                 >
                   <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                     <CheckCircle2 className="w-8 h-8" />
                   </div>
                   <h4 className="text-xl font-bold text-white mb-2">Terima Kasih!</h4>
                   <p className="text-slate-400 text-sm">Konfirmasi kehadiran dan ucapan Anda telah kami terima.</p>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
