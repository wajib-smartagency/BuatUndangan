"use client";
import React, { useState, useEffect } from 'react';
import { CorporateEventData, RsvpProps } from '@/types/invitation';
import {  CheckCircle2, Calendar, MapPin, Building2, Ticket, Users, ArrowRight , X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ModernEventProps {
  data: CorporateEventData;
  rsvp?: RsvpProps;
  rsvpsList?: any[];
}

export default function ModernEvent({ data, rsvp, rsvpsList = [] }: ModernEventProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!data.galeri || data.galeri.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === data.galeri!.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [data.galeri]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? data.galeri!.length - 1 : prev - 1));
  };
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === data.galeri!.length - 1 ? 0 : prev + 1));
  };

  
  useEffect(() => {
    const eventDate = new Date(data.acara.tanggal).getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate - now;
      
      if (distance < 0) {
        clearInterval(timer);
        return;
      }
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [data.acara.tanggal]);

  const getCalendarLink = () => {
    const text = data.penyelenggara.namaEvent;
    const dates = new Date(data.acara.tanggal).toISOString().replace(/-|:|\.\d\d\d/g,"");
    const details = `Acara: ${data.acara.waktuMulai}\nLokasi: ${data.acara.lokasi}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(text)}&dates=${dates}/${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(data.acara.lokasi)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img 
            src={data.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"} 
            alt="Event Cover" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 mt-16">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16">
            <div className="flex-1 text-center md:text-left">
              {data.penyelenggara.logo && (
                <div className="inline-block bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 mb-8">
                  <img src={data.penyelenggara.logo} alt="Logo" className="h-12 object-contain" />
                </div>
              )}
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                 <span className="w-12 h-[2px] bg-blue-500"></span>
                 <span className="text-blue-400 font-bold uppercase tracking-widest text-sm">
                   Event Invitation
                 </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                {data.penyelenggara.namaEvent}
              </h1>
              <p className="text-xl text-slate-300 font-light max-w-2xl leading-relaxed mb-10">
                {data.penyelenggara.deskripsi}
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="bg-blue-600 text-white px-6 py-4 rounded-xl font-bold flex items-center gap-3">
                  <Calendar className="w-5 h-5 opacity-70" />
                  {new Date(data.acara.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-4 rounded-xl font-bold flex items-center gap-3">
                  <MapPin className="w-5 h-5 opacity-70" />
                  {data.acara.lokasi}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Bar */}
      <div className="bg-blue-600 text-white py-8 border-y border-blue-500">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-center md:justify-between gap-8">
           <div className="font-bold uppercase tracking-widest text-sm flex items-center gap-2 opacity-80">
             <Building2 className="w-4 h-4" /> Organized by {data.penyelenggara.namaPenyelenggara}
           </div>
           <div className="flex items-center gap-6 font-black text-2xl md:text-3xl">
             <div className="flex items-baseline gap-2"><span className="text-4xl">{timeLeft.days}</span><span className="text-sm opacity-70 font-medium uppercase tracking-wider">Days</span></div>
             <span className="opacity-30">:</span>
             <div className="flex items-baseline gap-2"><span className="text-4xl">{timeLeft.hours}</span><span className="text-sm opacity-70 font-medium uppercase tracking-wider">Hrs</span></div>
             <span className="opacity-30">:</span>
             <div className="flex items-baseline gap-2"><span className="text-4xl">{timeLeft.minutes}</span><span className="text-sm opacity-70 font-medium uppercase tracking-wider">Min</span></div>
           </div>
        </div>
      </div>

      {/* Event Details Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <div>
               <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Detail Acara</h2>
               <div className="w-20 h-2 bg-blue-600 mb-10"></div>
               
               {data.kutipan && (
                 <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-blue-200 pl-6 mb-10 italic">
                   "{data.kutipan}"
                 </p>
               )}

               <div className="space-y-8">
                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                     <Calendar className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-900 text-lg mb-1">Waktu Pelaksanaan</h3>
                     <p className="text-slate-600">
                       {new Date(data.acara.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}<br/>
                       Pukul {data.acara.waktuMulai} - {data.acara.waktuSelesai}
                     </p>
                     <a href={getCalendarLink()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-600 font-bold mt-3 hover:text-blue-700">
                       Add to Calendar <ArrowRight className="w-4 h-4" />
                     </a>
                   </div>
                 </div>

                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                     <MapPin className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-900 text-lg mb-1">{data.acara.lokasi}</h3>
                     <p className="text-slate-600 mb-3">{data.acara.alamatLengkap}</p>
                     {data.acara.linkGoogleMaps && (
                       <a href={data.acara.linkGoogleMaps} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700">
                         View on Google Maps <ArrowRight className="w-4 h-4" />
                       </a>
                     )}
                   </div>
                 </div>
               </div>
             </div>
             
             {/* Map Placeholder or Cover image */}
             <div className="rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5] bg-slate-100">
                <img src={data.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"} alt="Event" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {data.galeri && data.galeri.length > 0 && (
        <section className="py-20 px-4 bg-black/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif text-amber-900 mb-4">Momen Indah</h2>
              <p className="text-slate-500">Galeri foto kebahagiaan kami</p>
            </div>
            
            {/* Auto-Slide Carousel Featured */}
            <div className="relative w-full aspect-[4/3] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl mb-6 group bg-slate-200">
              <div 
                className="flex transition-transform duration-1000 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {data.galeri.map((url, idx) => (
                  <div key={idx} className="w-full shrink-0 h-full relative cursor-zoom-in" onClick={() => setSelectedImage(url)}>
                    <img src={url} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                  </div>
                ))}
              </div>
              
              {/* Carousel Controls */}
              <button onClick={handlePrevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={handleNextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg">
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {data.galeri.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${currentSlide === idx ? 'bg-white w-6' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-4">
              {data.galeri.map((url, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {setCurrentSlide(idx); setSelectedImage(url);}}
                  className={`aspect-square rounded-xl overflow-hidden cursor-zoom-in transition-all ${currentSlide === idx ? 'ring-4 ring-amber-400 scale-95 opacity-100' : 'opacity-70 hover:opacity-100'}`}
                >
                  <img src={url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox / Zoom Overlay */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          >
            <X className="w-6 h-6" />
          </button>
          
          <img 
            src={selectedImage} 
            alt="Zoomed" 
            className="max-w-full max-h-[90vh] object-contain animate-in zoom-in-95 duration-300 shadow-2xl rounded-lg" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* RSVP Section (Registration) */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[120px] opacity-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16">
            
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 mb-8">
                <Ticket className="w-8 h-8" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Registrasi Kehadiran</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                Silakan isi form registrasi berikut untuk mengamankan kursi Anda. Kami sarankan untuk datang 30 menit sebelum acara dimulai.
              </p>
              
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                 <Users className="w-8 h-8 text-blue-400" />
                 <div>
                   <p className="font-bold text-xl">{rsvpsList.length} Peserta</p>
                   <p className="text-slate-400 text-sm">Telah Terdaftar</p>
                 </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 md:p-12 text-slate-900 shadow-2xl">
              {rsvp?.hasSubmitted ? (
                <div className="text-center py-12">
                   <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                     <CheckCircle2 className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 mb-3">Registrasi Berhasil!</h3>
                   <p className="text-slate-600">Terima kasih, data Anda telah tercatat. Sampai jumpa di acara!</p>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={rsvp?.onSubmit || ((e) => e.preventDefault())}>
                  <div>
                    <label className="block font-bold text-sm text-slate-700 mb-2">Nama Lengkap / Instansi</label>
                    <input required type="text" value={rsvp?.name || ''} onChange={e => rsvp?.onNameChange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 py-3 px-5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-900" placeholder="Masukkan nama..." />
                  </div>
                  <div>
                    <label className="block font-bold text-sm text-slate-700 mb-2">Konfirmasi Kehadiran</label>
                    <select value={rsvp?.status || 'hadir'} onChange={e => rsvp?.onStatusChange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 py-3 px-5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-900 cursor-pointer">
                      <option value="hadir">Bersedia Hadir</option>
                      <option value="tidak_hadir">Berhalangan Hadir</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-sm text-slate-700 mb-2">Pesan atau Pertanyaan (Opsional)</label>
                    <textarea required value={rsvp?.message || ''} onChange={e => rsvp?.onMessageChange(e.target.value)} rows={3} className="w-full bg-slate-50 border border-slate-200 py-3 px-5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-900 resize-none" placeholder="Tulis catatan..."></textarea>
                  </div>
                  <button disabled={rsvp?.isSubmitting} type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors disabled:opacity-50 mt-2 shadow-lg shadow-blue-600/30">
                    {rsvp?.isSubmitting ? 'MENYIMPAN DATA...' : 'SUBMIT REGISTRASI'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 text-slate-500 text-center text-sm font-medium">
        <p>Managed via BuatUndangan</p>
      </footer>
    </div>
  );
}
