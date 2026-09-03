"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Music, Calendar, MapPin, Gift, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function InvitationPage() {
  const { slug } = useParams();
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // RSVP State
  const [rsvpForm, setRsvpForm] = useState({ name: "", status: "Hadir", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Project Data
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("slug", slug)
          .single();
        
        if (error) throw error;
        setProject(data);
      } catch (err) {
        console.error("Error fetching invitation:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchProject();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Undangan Tidak Ditemukan</h1>
        <p className="text-slate-500">Mohon periksa kembali link undangan yang Anda terima.</p>
      </div>
    );
  }

  const { content } = project;
  // Fallbacks if content is empty (for old projects without content JSONB)
  const groom = content?.groom || { nickname: "Pria", fullName: "Mempelai Pria", parents: "-", ig: "-" };
  const bride = content?.bride || { nickname: "Wanita", fullName: "Mempelai Wanita", parents: "-", ig: "-" };
  const events = content?.events || [];
  const gifts = content?.gifts || [];
  const greeting = content?.greeting || "Dengan memohon rahmat dan ridho Allah SWT...";

  const handleOpen = () => {
    setIsOpened(true);
    setIsPlaying(true);
    // Ideally, we'd play audio here: new Audio('/music.mp3').play()
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Buat data tamu (Guest) terlebih dahulu
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .insert([
          { project_id: project.id, name: rsvpForm.name }
        ])
        .select()
        .single();
        
      if (guestError) throw guestError;

      // 2. Simpan RSVP dengan guest_id yang baru dibuat
      const { error: rsvpError } = await supabase.from('rsvps').insert([
        {
          project_id: project.id,
          guest_id: guestData.id,
          status: rsvpForm.status,
          message: rsvpForm.message
        }
      ]);
      
      if (rsvpError) throw rsvpError;
      
      setHasSubmitted(true);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      alert("Gagal mengirim RSVP. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-800 selection:bg-amber-100">
      
      {/* Cover / Welcome Screen */}
      <div className={`fixed inset-0 z-50 bg-slate-50 flex flex-col items-center justify-center transition-transform duration-1000 ${isOpened ? '-translate-y-full' : 'translate-y-0'}`}>
         <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-orange-50"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
         
         <div className="relative z-10 text-center px-6 max-w-md w-full">
           <p className="text-xs tracking-widest text-slate-500 uppercase font-sans mb-8">The Wedding Of</p>
           
           <div className="w-40 h-40 mx-auto rounded-full bg-slate-200 mb-8 border-4 border-white shadow-xl overflow-hidden">
             <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80" alt="Cover" className="w-full h-full object-cover opacity-90" />
           </div>

           <h1 className="text-5xl font-serif font-bold text-amber-900 leading-none mb-3">
             {groom.nickname} & {bride.nickname}
           </h1>
           
           <p className="text-sm text-slate-600 font-medium uppercase tracking-widest bg-white/50 backdrop-blur-sm py-2 rounded-full w-max mx-auto px-6 border border-amber-100 mb-12">
             {events[0] ? new Date(events[0].date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'}) : "Segera"}
           </p>

           <div className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white shadow-sm mb-8">
             <p className="text-xs text-slate-500 mb-1">Kepada Yth.</p>
             <p className="font-bold text-slate-800">Tamu Undangan</p>
           </div>

           <button 
            onClick={handleOpen}
            className="w-full bg-slate-900 text-white py-4 rounded-full font-bold shadow-lg hover:bg-slate-800 transition-all hover:-translate-y-1"
           >
             Buka Undangan
           </button>
         </div>
      </div>

      {/* Main Content (Only scrollable after opened) */}
      <div className={`max-w-md mx-auto bg-white min-h-screen relative overflow-hidden font-serif ${!isOpened ? 'h-screen overflow-hidden' : ''}`}>
         
         {/* Floating Music Button */}
         {isOpened && (
           <button 
             onClick={() => setIsPlaying(!isPlaying)}
             className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
           >
             <Music className={`w-5 h-5 ${isPlaying ? 'animate-spin-slow' : ''}`} />
           </button>
         )}

         {/* Hero Section */}
         <div className="relative min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-slate-100">
             <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-orange-50"></div>
             <div className="relative z-10 w-full">
                <p className="text-xs tracking-widest text-slate-500 uppercase font-sans mb-4">The Wedding Of</p>
                <h2 className="text-5xl font-bold text-amber-900 leading-none mb-2">{groom.nickname}</h2>
                <h2 className="text-4xl text-amber-700 leading-none mb-2">&</h2>
                <h2 className="text-5xl font-bold text-amber-900 leading-none mb-8">{bride.nickname}</h2>
             </div>
         </div>

         {/* Profile Section */}
         <div className="py-16 px-6 text-center">
             <img src="https://cdn-icons-png.flaticon.com/512/3058/3058867.png" className="w-12 mx-auto mb-6 opacity-30" alt="Bismillah" />
             <p className="text-sm text-slate-600 font-sans leading-relaxed mb-12">
               {greeting}
             </p>
             
             <div className="space-y-12">
               {/* Groom */}
               <div>
                 <div className="w-32 h-32 bg-slate-100 rounded-full mx-auto mb-4 border-4 border-amber-50 shadow-lg overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80" alt="Groom" className="w-full h-full object-cover opacity-80" />
                 </div>
                 <h3 className="font-bold text-2xl text-slate-800 mb-1">{groom.fullName}</h3>
                 <p className="text-xs text-slate-500 font-sans mb-2">{groom.parents}</p>
                 <a href={`https://instagram.com/${groom.ig.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 font-sans font-medium">{groom.ig}</a>
               </div>

               <div className="text-4xl text-amber-300">♥</div>

               {/* Bride */}
               <div>
                 <div className="w-32 h-32 bg-slate-100 rounded-full mx-auto mb-4 border-4 border-amber-50 shadow-lg overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80" alt="Bride" className="w-full h-full object-cover opacity-80" />
                 </div>
                 <h3 className="font-bold text-2xl text-slate-800 mb-1">{bride.fullName}</h3>
                 <p className="text-xs text-slate-500 font-sans mb-2">{bride.parents}</p>
                 <a href={`https://instagram.com/${bride.ig.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 font-sans font-medium">{bride.ig}</a>
               </div>
             </div>
         </div>

         {/* Events Section */}
         <div className="py-16 px-6 bg-amber-50 border-y border-amber-100">
            <div className="text-center mb-10">
              <Calendar className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <h3 className="font-bold text-2xl text-amber-900">Jadwal Acara</h3>
            </div>
            
            <div className="space-y-6">
              {events.map((ev: any) => (
                <div key={ev.id} className="bg-white p-6 rounded-3xl border border-amber-200 text-center shadow-sm">
                  <h4 className="font-bold text-xl text-amber-800 mb-4">{ev.type}</h4>
                  
                  <div className="flex justify-center items-center gap-4 mb-6">
                    <div className="text-right">
                      <p className="text-xs font-sans text-slate-500 uppercase">{new Date(ev.date).toLocaleDateString('id-ID', { weekday: 'long' })}</p>
                      <p className="text-2xl font-bold text-slate-800 leading-none my-1">{new Date(ev.date).getDate()}</p>
                      <p className="text-xs font-sans text-slate-500 uppercase">{new Date(ev.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="w-px h-12 bg-amber-200"></div>
                    <div className="text-left font-sans text-sm font-bold text-slate-700">
                      <p>{ev.startTime} -</p>
                      <p>{ev.endTime}</p>
                    </div>
                  </div>

                  <div className="text-sm font-sans text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl">
                    <p className="font-bold text-slate-800 mb-1">{ev.venue}</p>
                    <p className="text-xs leading-relaxed">{ev.address}</p>
                  </div>
                  
                  {ev.mapsUrl && (
                    <a href={ev.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-full font-sans font-bold text-sm transition-colors w-full">
                      <MapPin className="w-4 h-4" /> Buka Google Maps
                    </a>
                  )}
                </div>
              ))}
            </div>
         </div>

         {/* Gift Section */}
         {gifts.length > 0 && (
           <div className="py-16 px-6 bg-white text-center">
             <Gift className="w-8 h-8 text-slate-400 mx-auto mb-3" />
             <h3 className="font-bold text-2xl text-slate-800 mb-3">Kado Digital</h3>
             <p className="text-sm text-slate-500 font-sans mb-8">Bagi Anda yang ingin memberikan tanda kasih, dapat mengirimkan melalui fitur di bawah ini:</p>
             
             <div className="space-y-4">
               {gifts.map((gf: any) => (
                 <div key={gf.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                   <p className="font-bold text-slate-800 text-lg mb-2">{gf.bank}</p>
                   <p className="font-mono text-2xl text-slate-900 mb-2">{gf.accNumber}</p>
                   <p className="text-sm text-slate-500 uppercase font-sans mb-4">a.n {gf.accName}</p>
                   <button 
                     onClick={() => {
                       navigator.clipboard.writeText(gf.accNumber);
                       alert("Nomor rekening disalin!");
                     }}
                     className="text-xs font-bold font-sans uppercase tracking-widest bg-white border border-slate-300 text-slate-700 px-6 py-2.5 rounded-full hover:bg-slate-100"
                   >
                     Salin Rekening
                   </button>
                 </div>
               ))}
             </div>
           </div>
         )}

         {/* RSVP Section */}
         <div className="py-16 px-6 bg-slate-900 text-white text-center">
            <h3 className="font-bold text-2xl text-white mb-3">RSVP & Ucapan</h3>
            <p className="text-sm text-slate-400 font-sans mb-8">Mohon konfirmasi kehadiran Anda melalui form di bawah ini.</p>

            {hasSubmitted ? (
               <div className="bg-white/10 p-8 rounded-2xl border border-white/20 backdrop-blur-sm">
                 <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                 <h4 className="font-bold text-lg mb-2">Terima Kasih!</h4>
                 <p className="text-sm font-sans text-slate-300">Konfirmasi kehadiran & ucapan Anda telah kami terima.</p>
               </div>
            ) : (
               <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left font-sans">
                 <div>
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Nama Anda</label>
                   <input 
                     required
                     type="text" 
                     value={rsvpForm.name}
                     onChange={e => setRsvpForm({...rsvpForm, name: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500" 
                     placeholder="Contoh: Budi Santoso"
                   />
                 </div>
                 
                 <div>
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Kehadiran</label>
                   <div className="grid grid-cols-2 gap-3">
                     <button 
                       type="button"
                       onClick={() => setRsvpForm({...rsvpForm, status: 'Hadir'})}
                       className={`p-3 rounded-xl text-sm font-bold border ${rsvpForm.status === 'Hadir' ? 'bg-amber-500 border-amber-500 text-slate-900' : 'bg-transparent border-white/20 text-slate-300'}`}
                     >
                       Hadir
                     </button>
                     <button 
                       type="button"
                       onClick={() => setRsvpForm({...rsvpForm, status: 'Tidak Hadir'})}
                       className={`p-3 rounded-xl text-sm font-bold border ${rsvpForm.status === 'Tidak Hadir' ? 'bg-red-500 border-red-500 text-white' : 'bg-transparent border-white/20 text-slate-300'}`}
                     >
                       Tidak Hadir
                     </button>
                   </div>
                 </div>

                 <div>
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Ucapan & Doa</label>
                   <textarea 
                     required
                     rows={3}
                     value={rsvpForm.message}
                     onChange={e => setRsvpForm({...rsvpForm, message: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none" 
                     placeholder="Tulis ucapan selamat..."
                   />
                 </div>

                 <button 
                   disabled={isSubmitting}
                   type="submit" 
                   className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 py-4 rounded-xl font-bold transition-colors disabled:opacity-70 mt-4"
                 >
                   {isSubmitting ? 'Mengirim...' : 'Kirim RSVP'}
                 </button>
               </form>
            )}
         </div>

         {/* Footer */}
         <div className="py-8 text-center bg-slate-950">
           <p className="text-xs font-sans text-slate-500">Made with ❤️ using</p>
           <p className="font-bold text-slate-400">BuatUndangan</p>
         </div>

      </div>
    </div>
  );
}
