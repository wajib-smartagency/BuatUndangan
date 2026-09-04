"use client";
import React, { useState, useEffect } from 'react';
import { BirthdayData, RsvpProps } from '@/types/invitation';
import {  CheckCircle2, Calendar, MapPin, Copy, MessageCircle, PartyPopper, Cake, Gift , X, ChevronLeft, ChevronRight } from 'lucide-react';

interface FunBirthdayProps {
  data: BirthdayData;
  rsvp?: RsvpProps;
  rsvpsList?: any[];
}

export default function FunBirthday({ data, rsvp, rsvpsList = [] }: FunBirthdayProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Informasi berhasil disalin!');
  };

  const getCalendarLink = () => {
    const text = `Ulang Tahun: ${data.profil.namaPanggilan}`;
    const dates = new Date(data.acara.tanggal).toISOString().replace(/-|:|\.\d\d\d/g,"");
    const details = `Acara: ${data.acara.waktuMulai}\nLokasi: ${data.acara.lokasi}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(text)}&dates=${dates}/${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(data.acara.lokasi)}`;
  };

  return (
    <div className="min-h-screen bg-pink-50 text-slate-800 font-sans selection:bg-pink-300 selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-pink-400 via-rose-300 to-amber-300">
        <div className="absolute inset-0">
          <img 
            src={data.coverImage || "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80"} 
            alt="Event Cover" 
            className="w-full h-full object-cover mix-blend-overlay opacity-50"
          />
        </div>
        
        <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-8 border border-white/40 shadow-xl shadow-pink-500/20">
            <Cake className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider mb-2 drop-shadow-lg">
            Let&apos;s Celebrate
          </h2>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 drop-shadow-xl font-bubbly" style={{ fontFamily: 'var(--font-bubbly, system-ui, sans-serif)' }}>
            {data.profil.namaPanggilan}&apos;s {data.profil.umur}th
          </h1>
          <p className="text-xl md:text-2xl font-bold text-white/90 bg-black/10 backdrop-blur-md py-3 px-8 rounded-full border border-white/20">
            BIRTHDAY PARTY!
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 px-4 text-center relative -mt-10">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-2xl relative">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-8 border-4 border-pink-400 shadow-xl -mt-24 bg-white">
            {data.profil.foto ? (
              <img src={data.profil.foto} alt={data.profil.namaLengkap} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-pink-100 flex items-center justify-center text-pink-400">
                <PartyPopper className="w-12 h-12" />
              </div>
            )}
          </div>
          
          <h3 className="text-3xl font-black text-pink-500 mb-6 uppercase tracking-wider">Hello Everyone!</h3>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            {data.kutipan || "Aku sangat bahagia bisa merayakan hari spesialku bersama orang-orang tersayang. Kehadiran kalian akan membuat pestaku semakin meriah!"}
          </p>

          {/* Countdown */}
          <div className="flex justify-center gap-4 text-pink-500 bg-pink-50 py-6 rounded-2xl border border-pink-100">
            <div className="text-center w-16"><div className="text-3xl font-black">{timeLeft.days}</div><div className="text-[10px] font-bold uppercase tracking-wider mt-1 text-pink-400">Hari</div></div>
            <div className="text-2xl font-black opacity-30 mt-1">:</div>
            <div className="text-center w-16"><div className="text-3xl font-black">{timeLeft.hours}</div><div className="text-[10px] font-bold uppercase tracking-wider mt-1 text-pink-400">Jam</div></div>
            <div className="text-2xl font-black opacity-30 mt-1">:</div>
            <div className="text-center w-16"><div className="text-3xl font-black">{timeLeft.minutes}</div><div className="text-[10px] font-bold uppercase tracking-wider mt-1 text-pink-400">Mnt</div></div>
            <div className="text-2xl font-black opacity-30 mt-1">:</div>
            <div className="text-center w-16"><div className="text-3xl font-black">{timeLeft.seconds}</div><div className="text-[10px] font-bold uppercase tracking-wider mt-1 text-pink-400">Dtk</div></div>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-12">
            <Calendar className="w-8 h-8 text-pink-500" />
            <h2 className="text-4xl font-black text-pink-500 uppercase tracking-widest">Detail Pesta</h2>
          </div>
          
          <div className="bg-gradient-to-br from-white to-pink-50 p-10 shadow-xl rounded-[2.5rem] relative overflow-hidden border-2 border-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400 rounded-bl-full opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400 rounded-tr-full opacity-10"></div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-6 relative z-10">{data.acara.nama}</h3>
            
            <div className="inline-block bg-white px-8 py-4 rounded-2xl shadow-sm border border-pink-100 mb-8 relative z-10">
              <p className="text-xl font-bold text-pink-500 mb-1">
                {new Date(data.acara.tanggal).toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
              <p className="font-medium text-slate-500">{data.acara.waktuMulai} - {data.acara.waktuSelesai}</p>
            </div>
            
            <div className="mb-8 relative z-10">
              <p className="font-black text-2xl text-slate-800 mb-2">{data.acara.lokasi}</p>
              <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">{data.acara.alamatLengkap}</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {data.acara.linkGoogleMaps && (
                  <a href={data.acara.linkGoogleMaps} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-pink-500 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/30">
                    <MapPin className="w-5 h-5" /> Buka Google Maps
                  </a>
                )}
                <a href={getCalendarLink()} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-white text-pink-500 px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-pink-50 transition-colors shadow-lg border border-pink-100">
                  <Calendar className="w-5 h-5" /> Save The Date
                </a>
              </div>
            </div>

            {data.profil.dresscode && (
              <div className="mt-12 pt-8 border-t border-pink-200/50 relative z-10">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Dresscode Pesta</p>
                <p className="text-xl font-bold text-pink-600 bg-pink-100/50 py-3 px-6 rounded-full inline-block">
                  👕 {data.profil.dresscode}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {data.galeri && (data.galeri?.length || 0) > 0 && (
        <section className="py-24 px-4 bg-transparent relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-slate-800 mb-4" style={{ fontFamily: 'var(--font-serif, serif)' }}>Galeri Momen</h2>
              <div className="w-16 h-px bg-slate-400 mx-auto mb-4"></div>
              <p className="text-slate-500 tracking-widest uppercase text-xs">Our Beautiful Memories</p>
            </div>
            
            {/* Elegant Masonry Grid */}
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {(data.galeri || []).map((url, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {setCurrentSlide(idx); setSelectedImage(url);}}
                  className="relative overflow-hidden cursor-zoom-in group break-inside-avoid rounded-lg shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <img 
                    src={url} 
                    alt={`Gallery ${idx}`} 
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                     <div className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-75 group-hover:scale-100">
                        <span className="text-white text-xl font-light">+</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Premium Fullscreen Lightbox Slider */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300"
        >
          {/* Header Controls */}
          <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-[110] bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
             <div className="text-white/70 font-mono text-sm tracking-widest pointer-events-auto">
               {currentSlide + 1} / {data.galeri?.length || 0}
             </div>
             <button 
               className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors pointer-events-auto backdrop-blur-md"
               onClick={() => setSelectedImage(null)}
             >
               <X className="w-5 h-5 md:w-6 md:h-6" />
             </button>
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrevSlide(); }} 
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-[110] hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); handleNextSlide(); }} 
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-[110] hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          {/* Main Slider Track */}
          <div 
            className="w-full h-full flex items-center transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onClick={() => setSelectedImage(null)}
          >
            {(data.galeri || []).map((url, idx) => (
              <div key={idx} className="w-full h-full shrink-0 flex items-center justify-center p-4 md:p-16">
                <img 
                  src={url} 
                  alt={`Zoomed ${idx}`} 
                  className={`max-w-full max-h-full object-contain drop-shadow-2xl transition-all duration-700 pointer-events-auto ${currentSlide === idx ? 'scale-100 opacity-100' : 'scale-90 opacity-50'}`} 
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gift Section */}
      {data.rekening && data.rekening.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-b from-pink-400 to-rose-400 text-white text-center rounded-t-[3rem] mt-20">
          <div className="max-w-4xl mx-auto relative -mt-32 mb-12">
             <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-2xl border-4 border-pink-400">
               <Gift className="w-10 h-10 text-pink-500" />
             </div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-black mb-6 uppercase tracking-widest text-white drop-shadow-md">Kado Ulang Tahun</h2>
            <p className="text-white/90 mb-12 text-lg font-medium">Buat kalian yang ingin memberikan hadiah, bisa melalui kado digital di bawah ini. Thank you! 🎁</p>
            
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {data.rekening.map((rek, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-xl hover:bg-white/20 transition-colors">
                  <h3 className="font-black text-2xl text-white mb-2">{rek.namaBank}</h3>
                  <p className="text-xl font-medium tracking-widest mb-1">{rek.noRekening}</p>
                  <p className="text-pink-100 uppercase text-sm font-bold mb-6">A.N {rek.atasNama}</p>
                  <button onClick={() => copyToClipboard(rek.noRekening)} className="flex items-center justify-center gap-2 w-full bg-white text-pink-500 py-3 rounded-xl font-black uppercase text-sm hover:bg-pink-50 transition-colors">
                    <Copy className="w-4 h-4" /> Salin Info
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <section className="py-20 px-4 bg-white relative">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-pink-500 uppercase tracking-widest">RSVP & Ucapan</h2>
            <p className="text-slate-500 mt-4 font-medium">Konfirmasi kehadiranmu dan berikan ucapan spesial!</p>
          </div>
          
          {rsvp?.hasSubmitted ? (
            <div className="bg-green-50 p-12 text-center rounded-3xl border-2 border-green-200">
               <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
               <h3 className="text-3xl font-black text-green-700 mb-2 uppercase">Thank You!</h3>
               <p className="text-green-600 font-medium">Kehadiran dan ucapanmu sangat berarti buatku.</p>
            </div>
          ) : (
            <form className="mb-16 bg-pink-50 p-8 md:p-12 rounded-[2.5rem] border-2 border-pink-100 shadow-xl" onSubmit={rsvp?.onSubmit || ((e) => e.preventDefault())}>
              <div className="space-y-6">
                <div>
                  <label className="block font-black text-sm uppercase text-pink-500 mb-2 pl-4">Nama Panggilan</label>
                  <input required type="text" value={rsvp?.name || ''} onChange={e => rsvp?.onNameChange(e.target.value)} className="w-full bg-white border-2 border-pink-100 py-4 px-6 rounded-2xl focus:outline-none focus:border-pink-400 transition-colors font-medium text-slate-700" placeholder="Namamu siapa?" />
                </div>
                <div>
                  <label className="block font-black text-sm uppercase text-pink-500 mb-2 pl-4">Bisa Datang?</label>
                  <select value={rsvp?.status || 'hadir'} onChange={e => rsvp?.onStatusChange(e.target.value)} className="w-full bg-white border-2 border-pink-100 py-4 px-6 rounded-2xl focus:outline-none focus:border-pink-400 transition-colors font-medium text-slate-700 cursor-pointer">
                    <option value="hadir">Pasti Datang Dong! 🥳</option>
                    <option value="tidak_hadir">Yah, Gak Bisa Ikut 😢</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black text-sm uppercase text-pink-500 mb-2 pl-4">Ucapan Buatku</label>
                  <textarea required value={rsvp?.message || ''} onChange={e => rsvp?.onMessageChange(e.target.value)} rows={4} className="w-full bg-white border-2 border-pink-100 py-4 px-6 rounded-2xl focus:outline-none focus:border-pink-400 transition-colors font-medium text-slate-700 resize-none" placeholder="Tulis harapan dan doamu di sini..."></textarea>
                </div>
                <button disabled={rsvp?.isSubmitting} type="submit" className="w-full bg-pink-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-lg hover:bg-pink-600 transition-colors disabled:opacity-50 shadow-lg shadow-pink-500/30 mt-4">
                  {rsvp?.isSubmitting ? 'MENGIRIM...' : 'KIRIM RSVP & UCAPAN'}
                </button>
              </div>
            </form>
          )}

          {/* Guestbook List */}
          {rsvpsList && rsvpsList.length > 0 && (
            <div className="mt-16">
               <h3 className="font-black text-xl text-slate-800 mb-8 flex items-center gap-3">
                 <MessageCircle className="w-6 h-6 text-pink-500" /> {rsvpsList.length} Teman Sudah Konfirmasi
               </h3>
               <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                 {rsvpsList.map((msg, idx) => (
                   <div key={idx} className="bg-white border-2 border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                     <div className="flex justify-between items-start mb-3">
                       <h4 className="font-black text-pink-600 text-lg">{msg.guests?.name || "Teman"}</h4>
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${msg.status === 'hadir' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
                         {msg.status === 'hadir' ? 'Hadir' : 'Absen'}
                       </span>
                     </div>
                     <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl rounded-tl-none">
                       {msg.message}
                     </p>
                     <span className="text-[10px] text-slate-400 font-bold uppercase mt-3 block">
                       {new Date(msg.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                     </span>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400 text-center text-sm font-bold uppercase tracking-widest">
        <p>Created with BuatUndangan</p>
      </footer>
    </div>
  );
}
