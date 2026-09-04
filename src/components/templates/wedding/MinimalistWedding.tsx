"use client";
import React, { useState, useEffect } from 'react';
import { WeddingData, RsvpProps } from '@/types/invitation';
import {  CheckCircle2, Calendar, Copy, MessageCircle , X, ChevronLeft, ChevronRight } from 'lucide-react';

interface MinimalistWeddingProps {
  data: WeddingData;
  rsvp?: RsvpProps;
  rsvpsList?: any[];
}

export default function MinimalistWedding({ data, rsvp, rsvpsList = [] }: MinimalistWeddingProps) {
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
    const eventDate = new Date(data.acaraAkad.tanggal).getTime();
    
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
  }, [data.acaraAkad.tanggal]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Nomor Rekening berhasil disalin!');
  };

  const getCalendarLink = () => {
    const text = `Pernikahan ${data.pria.namaPanggilan} & ${data.wanita.namaPanggilan}`;
    const dates = new Date(data.acaraAkad.tanggal).toISOString().replace(/-|:|\.\d\d\d/g,"");
    const details = `Acara Akad: ${data.acaraAkad.waktuMulai}\nLokasi: ${data.acaraAkad.lokasi}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(text)}&dates=${dates}/${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(data.acaraAkad.lokasi)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        {data.coverImage && (
          <div className="absolute inset-0 opacity-10 pointer-events-none grayscale">
            <img src={data.coverImage} className="w-full h-full object-cover" alt="Background" />
          </div>
        )}
        <div className="relative z-10">
          <p className="text-sm tracking-[0.3em] uppercase mb-4 text-gray-500">The Wedding Of</p>
          <h1 className="text-5xl md:text-7xl font-light tracking-wider mb-8 text-gray-900">
            {data.pria.namaPanggilan} <span className="font-serif italic mx-2 text-gray-400">&</span> {data.wanita.namaPanggilan}
          </h1>
          <p className="text-sm md:text-lg text-gray-500 tracking-widest uppercase mb-12">
            {new Date(data.acaraAkad.tanggal).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          
          {/* Countdown */}
          <div className="flex justify-center gap-6 text-gray-600 mb-8 border-y border-gray-200 py-6">
            <div className="text-center"><div className="text-3xl font-light">{timeLeft.days}</div><div className="text-xs uppercase tracking-widest mt-1">Hari</div></div>
            <div className="text-center"><div className="text-3xl font-light">{timeLeft.hours}</div><div className="text-xs uppercase tracking-widest mt-1">Jam</div></div>
            <div className="text-center"><div className="text-3xl font-light">{timeLeft.minutes}</div><div className="text-xs uppercase tracking-widest mt-1">Mnt</div></div>
            <div className="text-center"><div className="text-3xl font-light">{timeLeft.seconds}</div><div className="text-xs uppercase tracking-widest mt-1">Dtk</div></div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      {data.kutipan && (
        <section className="py-20 px-4 max-w-2xl mx-auto text-center">
          <p className="text-xl italic font-serif text-gray-600 leading-relaxed mb-4">
            &quot;{data.kutipan}&quot;
          </p>
          {data.sumberKutipan && (
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
              - {data.sumberKutipan} -
            </p>
          )}
        </section>
      )}

      {/* Couple Section */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-16">
          <div className="text-center flex-1">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 bg-gray-100">
              {data.pria.foto ? (
                <img src={data.pria.foto} alt={data.pria.namaLengkap} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">Foto Pria</div>
              )}
            </div>
            <h2 className="text-2xl font-light mb-2">{data.pria.namaLengkap}</h2>
            <p className="text-gray-400 text-sm tracking-widest uppercase mb-1">Putra dari</p>
            <p className="text-gray-600">Bapak {data.pria.namaBapak} & Ibu {data.pria.namaIbu}</p>
          </div>
          
          <div className="text-4xl text-gray-300 font-serif italic">&</div>

          <div className="text-center flex-1">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 bg-gray-100">
              {data.wanita.foto ? (
                <img src={data.wanita.foto} alt={data.wanita.namaLengkap} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">Foto Wanita</div>
              )}
            </div>
            <h2 className="text-2xl font-light mb-2">{data.wanita.namaLengkap}</h2>
            <p className="text-gray-400 text-sm tracking-widest uppercase mb-1">Putri dari</p>
            <p className="text-gray-600">Bapak {data.wanita.namaBapak} & Ibu {data.wanita.namaIbu}</p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-12">Detail Acara</h2>
          
          <a href={getCalendarLink()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors mb-16">
            <Calendar className="w-4 h-4" /> Simpan ke Kalender
          </a>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 shadow-sm border border-gray-100">
              <h3 className="text-xl font-light mb-4 uppercase tracking-widest">{data.acaraAkad.nama}</h3>
              <p className="text-gray-500 mb-2">
                {new Date(data.acaraAkad.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-gray-800 mb-6 font-medium">{data.acaraAkad.waktuMulai} - {data.acaraAkad.waktuSelesai}</p>
              <p className="font-semibold mb-2">{data.acaraAkad.lokasi}</p>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">{data.acaraAkad.alamatLengkap}</p>
              {data.acaraAkad.linkGoogleMaps && (
                <a href={data.acaraAkad.linkGoogleMaps} target="_blank" rel="noreferrer" className="inline-block border border-gray-900 text-gray-900 px-6 py-2 tracking-widest uppercase text-xs hover:bg-gray-900 hover:text-white transition-colors">
                  Peta Lokasi
                </a>
              )}
            </div>

            <div className="bg-white p-10 shadow-sm border border-gray-100">
              <h3 className="text-xl font-light mb-4 uppercase tracking-widest">{data.acaraResepsi.nama}</h3>
              <p className="text-gray-500 mb-2">
                {new Date(data.acaraResepsi.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-gray-800 mb-6 font-medium">{data.acaraResepsi.waktuMulai} - {data.acaraResepsi.waktuSelesai}</p>
              <p className="font-semibold mb-2">{data.acaraResepsi.lokasi}</p>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">{data.acaraResepsi.alamatLengkap}</p>
              {data.acaraResepsi.linkGoogleMaps && (
                <a href={data.acaraResepsi.linkGoogleMaps} target="_blank" rel="noreferrer" className="inline-block border border-gray-900 text-gray-900 px-6 py-2 tracking-widest uppercase text-xs hover:bg-gray-900 hover:text-white transition-colors">
                  Peta Lokasi
                </a>
              )}
            </div>
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
        <section className="py-24 px-4 bg-gray-900 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-8">Kado Pernikahan</h2>
            <p className="text-gray-400 text-sm mb-12 leading-relaxed">Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih dapat melalui:</p>
            
            <div className="space-y-6">
              {data.rekening.map((rek, i) => (
                <div key={i} className="bg-gray-800 p-8 inline-block w-full max-w-sm">
                  <h3 className="font-bold text-lg mb-2">{rek.namaBank}</h3>
                  <p className="text-2xl tracking-widest mb-1 font-light">{rek.noRekening}</p>
                  <p className="text-gray-400 text-xs uppercase tracking-widest mt-3 mb-6">A.N {rek.atasNama}</p>
                  <button onClick={() => copyToClipboard(rek.noRekening)} className="flex items-center justify-center gap-2 w-full border border-gray-600 text-gray-300 py-3 tracking-widest uppercase text-xs hover:bg-white hover:text-gray-900 transition-colors">
                    <Copy className="w-3 h-3" /> Salin Rekening
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-12">Buku Tamu</h2>
          
          {rsvp?.hasSubmitted ? (
            <div className="bg-gray-50 p-10 text-center mb-12">
               <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
               <h3 className="text-xl mb-2">Terima Kasih</h3>
               <p className="text-sm text-gray-500">Konfirmasi Anda telah kami terima.</p>
            </div>
          ) : (
            <form className="space-y-6 mb-16 text-left" onSubmit={rsvp?.onSubmit || ((e) => e.preventDefault())}>
              <div>
                <input required type="text" value={rsvp?.name || ''} onChange={e => rsvp?.onNameChange(e.target.value)} className="w-full border-b border-gray-300 py-3 bg-transparent focus:outline-none focus:border-gray-900 transition-colors text-sm" placeholder="Nama Lengkap" />
              </div>
              <div>
                <select value={rsvp?.status || 'hadir'} onChange={e => rsvp?.onStatusChange(e.target.value)} className="w-full border-b border-gray-300 py-3 bg-transparent focus:outline-none focus:border-gray-900 transition-colors text-sm text-gray-600">
                  <option value="hadir">Bersedia Hadir</option>
                  <option value="tidak_hadir">Maaf, Tidak Bisa Hadir</option>
                </select>
              </div>
              <div>
                <textarea required value={rsvp?.message || ''} onChange={e => rsvp?.onMessageChange(e.target.value)} rows={3} className="w-full border-b border-gray-300 py-3 bg-transparent focus:outline-none focus:border-gray-900 transition-colors text-sm resize-none" placeholder="Pesan & Doa Restu"></textarea>
              </div>
              <button disabled={rsvp?.isSubmitting} type="submit" className="w-full bg-gray-900 text-white py-4 tracking-widest uppercase text-xs hover:bg-gray-800 transition-colors mt-4 disabled:opacity-50">
                {rsvp?.isSubmitting ? 'MENGIRIM...' : 'KIRIM PESAN'}
              </button>
            </form>
          )}

          {/* Guestbook List */}
          {rsvpsList && rsvpsList.length > 0 && (
            <div className="bg-gray-50 p-6 h-[400px] overflow-y-auto custom-scrollbar text-left">
               <div className="space-y-6">
                 {rsvpsList.map((msg, idx) => (
                   <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
                     <div className="flex justify-between items-start mb-2">
                       <h4 className="font-semibold text-gray-900 text-sm">{msg.guests?.name || "Tamu"}</h4>
                       <span className="text-[10px] text-gray-400">{new Date(msg.created_at).toLocaleDateString('id-ID')}</span>
                     </div>
                     <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-widest mb-2 ${msg.status === 'hadir' ? 'text-green-600' : 'text-gray-400'}`}>
                       {msg.status === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                     </span>
                     <p className="text-gray-600 text-sm">"{msg.message}"</p>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 text-gray-400 text-center text-xs tracking-[0.2em] uppercase">
        <p>BUATUNDANGAN DIGITAL</p>
      </footer>
    </div>
  );
}
