"use client";
import React, { useState, useEffect } from 'react';
import { WeddingData, RsvpProps } from '@/types/invitation';
import {  CheckCircle2, Calendar, MapPin, Copy, MessageCircle , X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ElegantWeddingProps {
  data: WeddingData;
  rsvp?: RsvpProps;
  rsvpsList?: any[];
}

export default function ElegantWedding({ data, rsvp, rsvpsList = [] }: ElegantWeddingProps) {
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
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A4A4A] font-serif">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={data.coverImage || "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"} 
            alt="Wedding Cover" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/40 via-transparent to-[#FDFBF7]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-[#888] mb-6">The Wedding Of</p>
          <h1 className="text-6xl md:text-8xl text-[#2C3E2D] mb-4">
            {data.pria.namaPanggilan} <span className="text-[#B89B5E] text-5xl md:text-7xl">&</span> {data.wanita.namaPanggilan}
          </h1>
          <p className="font-sans text-sm tracking-widest text-[#666] uppercase mt-8 border-y border-[#B89B5E] py-4 w-max mx-auto px-8 mb-8">
            {new Date(data.acaraAkad.tanggal).toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
          
          {/* Countdown */}
          <div className="flex justify-center gap-4 text-[#2C3E2D] font-sans">
            <div className="text-center"><div className="text-2xl font-bold">{timeLeft.days}</div><div className="text-[10px] uppercase tracking-wider">Hari</div></div>
            <div className="text-xl">:</div>
            <div className="text-center"><div className="text-2xl font-bold">{timeLeft.hours}</div><div className="text-[10px] uppercase tracking-wider">Jam</div></div>
            <div className="text-xl">:</div>
            <div className="text-center"><div className="text-2xl font-bold">{timeLeft.minutes}</div><div className="text-[10px] uppercase tracking-wider">Menit</div></div>
            <div className="text-xl">:</div>
            <div className="text-center"><div className="text-2xl font-bold">{timeLeft.seconds}</div><div className="text-[10px] uppercase tracking-wider">Detik</div></div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      {data.kutipan && (
        <section className="py-24 px-4 max-w-3xl mx-auto text-center relative">
          <div className="text-6xl text-[#E8E1D5] absolute top-10 left-1/2 transform -translate-x-1/2 -z-10">&quot;</div>
          <p className="text-2xl italic text-[#4A4A4A] leading-loose mb-6">
            {data.kutipan}
          </p>
          {data.sumberKutipan && (
            <p className="text-sm tracking-widest text-[#B89B5E] uppercase">
              {data.sumberKutipan}
            </p>
          )}
        </section>
      )}

      {/* Couple Section */}
      <section className="py-24 bg-white px-4 border-y border-[#F2EFE9]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-20">
          {/* Pria */}
          <div className="text-center flex-1">
            <div className="w-56 h-72 mx-auto rounded-t-full overflow-hidden mb-8 border-4 border-[#F2EFE9] p-2">
              {data.pria.foto ? (
                <img src={data.pria.foto} alt={data.pria.namaLengkap} className="w-full h-full object-cover rounded-t-full" />
              ) : (
                <div className="w-full h-full bg-[#FDFBF7] rounded-t-full flex items-center justify-center text-gray-400">Foto Pria</div>
              )}
            </div>
            <h2 className="text-3xl text-[#2C3E2D] mb-3">{data.pria.namaLengkap}</h2>
            <p className="text-[#888] italic mb-1">Putra dari</p>
            <p className="text-[#4A4A4A]">Bapak {data.pria.namaBapak} & Ibu {data.pria.namaIbu}</p>
          </div>
          
          <div className="text-6xl text-[#B89B5E] italic font-light">&</div>

          {/* Wanita */}
          <div className="text-center flex-1">
            <div className="w-56 h-72 mx-auto rounded-t-full overflow-hidden mb-8 border-4 border-[#F2EFE9] p-2">
              {data.wanita.foto ? (
                <img src={data.wanita.foto} alt={data.wanita.namaLengkap} className="w-full h-full object-cover rounded-t-full" />
              ) : (
                <div className="w-full h-full bg-[#FDFBF7] rounded-t-full flex items-center justify-center text-gray-400">Foto Wanita</div>
              )}
            </div>
            <h2 className="text-3xl text-[#2C3E2D] mb-3">{data.wanita.namaLengkap}</h2>
            <p className="text-[#888] italic mb-1">Putri dari</p>
            <p className="text-[#4A4A4A]">Bapak {data.wanita.namaBapak} & Ibu {data.wanita.namaIbu}</p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 px-4 bg-[#FDFBF7]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl text-[#2C3E2D] mb-4">Rangkaian Acara</h2>
          <div className="w-16 h-[2px] bg-[#B89B5E] mx-auto mb-12"></div>
          
          <a href={getCalendarLink()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#2C3E2D] text-[#FDFBF7] px-6 py-3 rounded-full text-sm font-sans tracking-widest uppercase hover:bg-[#1a261a] transition-colors mb-16">
            <Calendar className="w-4 h-4" /> Save The Date
          </a>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Akad */}
            <div className="bg-white p-12 shadow-sm border border-[#F2EFE9] rounded-sm relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FDFBF7] px-4 text-[#B89B5E]">
                ✧
              </div>
              <h3 className="text-2xl text-[#2C3E2D] mb-6">{data.acaraAkad.nama}</h3>
              <p className="text-lg mb-2">
                {new Date(data.acaraAkad.tanggal).toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
              <p className="text-[#B89B5E] mb-6">{data.acaraAkad.waktuMulai} - {data.acaraAkad.waktuSelesai}</p>
              <div className="w-12 h-[1px] bg-gray-200 mx-auto mb-6"></div>
              <p className="font-semibold mb-2">{data.acaraAkad.lokasi}</p>
              <p className="text-[#888] mb-8 leading-relaxed">{data.acaraAkad.alamatLengkap}</p>
              {data.acaraAkad.linkGoogleMaps && (
                <a href={data.acaraAkad.linkGoogleMaps} target="_blank" rel="noreferrer" className="inline-block border border-[#B89B5E] text-[#B89B5E] px-8 py-3 tracking-[0.1em] uppercase text-sm hover:bg-[#B89B5E] hover:text-white transition-colors">
                  Buka Peta
                </a>
              )}
            </div>

            {/* Resepsi */}
            <div className="bg-white p-12 shadow-sm border border-[#F2EFE9] rounded-sm relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FDFBF7] px-4 text-[#B89B5E]">
                ✧
              </div>
              <h3 className="text-2xl text-[#2C3E2D] mb-6">{data.acaraResepsi.nama}</h3>
              <p className="text-lg mb-2">
                {new Date(data.acaraResepsi.tanggal).toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
              <p className="text-[#B89B5E] mb-6">{data.acaraResepsi.waktuMulai} - {data.acaraResepsi.waktuSelesai}</p>
              <div className="w-12 h-[1px] bg-gray-200 mx-auto mb-6"></div>
              <p className="font-semibold mb-2">{data.acaraResepsi.lokasi}</p>
              <p className="text-[#888] mb-8 leading-relaxed">{data.acaraResepsi.alamatLengkap}</p>
              {data.acaraResepsi.linkGoogleMaps && (
                <a href={data.acaraResepsi.linkGoogleMaps} target="_blank" rel="noreferrer" className="inline-block border border-[#B89B5E] text-[#B89B5E] px-8 py-3 tracking-[0.1em] uppercase text-sm hover:bg-[#B89B5E] hover:text-white transition-colors">
                  Buka Peta
                </a>
              )}
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

      {/* Gift Section */}
      {data.rekening && data.rekening.length > 0 && (
        <section className="py-24 px-4 bg-[#2C3E2D] text-[#E8E1D5] text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl mb-4">Kado Pernikahan</h2>
            <div className="w-16 h-[2px] bg-[#B89B5E] mx-auto mb-8"></div>
            <p className="text-[#b2b5a5] mb-12 leading-relaxed">Kehadiran dan doa restu Anda merupakan kado terindah bagi kami. Namun, apabila Anda hendak memberikan tanda kasih, dapat melalui fitur kado digital berikut:</p>
            
            <div className="space-y-6">
              {data.rekening.map((rek, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm p-8 rounded-sm border border-white/10 inline-block w-full max-w-sm">
                  <h3 className="font-bold text-xl text-white mb-3">{rek.namaBank}</h3>
                  <p className="text-3xl tracking-wider mb-2 font-sans font-light">{rek.noRekening}</p>
                  <p className="text-[#B89B5E] uppercase tracking-widest text-sm mt-4 mb-6">A.N {rek.atasNama}</p>
                  <button onClick={() => copyToClipboard(rek.noRekening)} className="flex items-center justify-center gap-2 w-full border border-[#B89B5E] text-[#B89B5E] py-3 font-sans tracking-widest uppercase text-xs hover:bg-[#B89B5E] hover:text-white transition-colors">
                    <Copy className="w-4 h-4" /> Salin Rekening
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RSVP & Wishes */}
      <section className="py-24 px-4 bg-[#FDFBF7]">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-[#2C3E2D] mb-4">Kehadiran & Ucapan</h2>
            <div className="w-16 h-[2px] bg-[#B89B5E] mx-auto"></div>
          </div>
          
          {rsvp?.hasSubmitted ? (
            <div className="bg-white p-12 text-center border border-[#F2EFE9] mb-12">
               <CheckCircle2 className="w-16 h-16 text-[#B89B5E] mx-auto mb-4" />
               <h3 className="text-2xl text-[#2C3E2D] mb-2">Terima Kasih</h3>
               <p className="text-[#888]">Pesan dan konfirmasi kehadiran Anda telah kami terima.</p>
            </div>
          ) : (
            <form className="space-y-8 mb-16 bg-white p-8 border border-[#F2EFE9]" onSubmit={rsvp?.onSubmit || ((e) => e.preventDefault())}>
              <div>
                <label className="block font-sans text-sm tracking-widest uppercase text-[#888] mb-2">Nama Lengkap</label>
                <input required type="text" value={rsvp?.name || ''} onChange={e => rsvp?.onNameChange(e.target.value)} className="w-full border-b border-[#B89B5E] py-3 bg-transparent focus:outline-none focus:border-[#2C3E2D] transition-colors font-sans" placeholder="Nama Anda" />
              </div>
              <div>
                <label className="block font-sans text-sm tracking-widest uppercase text-[#888] mb-2">Kehadiran</label>
                <select value={rsvp?.status || 'hadir'} onChange={e => rsvp?.onStatusChange(e.target.value)} className="w-full border-b border-[#B89B5E] py-3 bg-transparent focus:outline-none focus:border-[#2C3E2D] transition-colors font-sans text-[#4A4A4A]">
                  <option value="hadir">Bersedia Hadir</option>
                  <option value="tidak_hadir">Maaf, Tidak Bisa Hadir</option>
                </select>
              </div>
              <div>
                <label className="block font-sans text-sm tracking-widest uppercase text-[#888] mb-2">Pesan Untuk Mempelai</label>
                <textarea required value={rsvp?.message || ''} onChange={e => rsvp?.onMessageChange(e.target.value)} rows={4} className="w-full border-b border-[#B89B5E] py-3 bg-transparent focus:outline-none focus:border-[#2C3E2D] transition-colors font-sans" placeholder="Tulis doa dan harapan Anda..."></textarea>
              </div>
              <button disabled={rsvp?.isSubmitting} type="submit" className="w-full bg-[#2C3E2D] text-[#E8E1D5] py-4 font-sans tracking-[0.1em] uppercase text-sm hover:bg-[#1a251b] transition-colors disabled:opacity-50">
                {rsvp?.isSubmitting ? 'MENGIRIM...' : 'KIRIM PESAN'}
              </button>
            </form>
          )}

          {/* Guestbook List */}
          {rsvpsList && rsvpsList.length > 0 && (
            <div className="bg-white p-6 border border-[#F2EFE9] h-[500px] overflow-y-auto custom-scrollbar">
               <h3 className="font-sans text-sm tracking-widest uppercase text-[#2C3E2D] mb-6 border-b border-[#F2EFE9] pb-4 flex items-center gap-2">
                 <MessageCircle className="w-4 h-4" /> {rsvpsList.length} Pesan
               </h3>
               <div className="space-y-6">
                 {rsvpsList.map((msg, idx) => (
                   <div key={idx} className="border-b border-gray-100 pb-4 last:border-0">
                     <div className="flex justify-between items-start mb-1">
                       <h4 className="font-bold text-[#2C3E2D] font-sans">{msg.guests?.name || "Tamu"}</h4>
                       <span className="text-[10px] text-gray-400 font-sans">{new Date(msg.created_at).toLocaleDateString('id-ID')}</span>
                     </div>
                     <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-sans uppercase mb-2 ${msg.status === 'hadir' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                       {msg.status === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                     </span>
                     <p className="text-gray-600 text-sm italic">"{msg.message}"</p>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#1a251b] text-[#E8E1D5] text-center text-sm font-sans tracking-widest">
        <p>BUATUNDANGAN DIGITAL</p>
      </footer>
    </div>
  );
}
