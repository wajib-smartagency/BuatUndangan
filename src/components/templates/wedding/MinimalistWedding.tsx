import React, { useState, useEffect } from 'react';
import { WeddingData, RsvpProps } from '@/types/invitation';
import { CheckCircle2, Calendar, Copy, MessageCircle } from 'lucide-react';

interface MinimalistWeddingProps {
  data: WeddingData;
  rsvp?: RsvpProps;
  rsvpsList?: any[];
}

export default function MinimalistWedding({ data, rsvp, rsvpsList = [] }: MinimalistWeddingProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
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
      {data.galeri && data.galeri.length > 0 && (
        <section className="py-24 bg-white px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.galeri.map((img, i) => (
                <div key={i} className="aspect-square bg-gray-100 overflow-hidden">
                  <img src={img} alt={`Gallery ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Digital Envelope */}
      {data.rekening && data.rekening.length > 0 && (
        <section className="py-24 px-4 bg-gray-50 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl tracking-[0.2em] uppercase mb-6">Kado Digital</h2>
            <p className="text-gray-500 mb-12">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan tanda kasih, kami menyediakan fitur Kado Digital di bawah ini.</p>
            
            <div className="space-y-6">
              {data.rekening.map((rek, i) => (
                <div key={i} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 inline-block w-full max-w-sm">
                  <h3 className="font-semibold text-lg mb-2">{rek.namaBank}</h3>
                  <p className="text-2xl tracking-widest mb-2 font-mono">{rek.noRekening}</p>
                  <p className="text-gray-500 uppercase text-sm">a.n {rek.atasNama}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RSVP & Wishes Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl tracking-[0.2em] uppercase mb-12 text-center">RSVP & Ucapan</h2>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm text-gray-500 mb-2">Nama Anda</label>
              <input type="text" className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none focus:border-gray-800 transition-colors" placeholder="Masukkan nama" />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">Konfirmasi Kehadiran</label>
              <select className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none focus:border-gray-800 transition-colors">
                <option value="hadir">Ya, saya akan hadir</option>
                <option value="tidak">Maaf, saya tidak bisa hadir</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">Ucapan & Doa</label>
              <textarea rows={4} className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none focus:border-gray-800 transition-colors" placeholder="Berikan ucapan untuk kedua mempelai"></textarea>
            </div>
            <button type="submit" className="w-full bg-gray-800 text-white py-4 tracking-widest uppercase text-sm hover:bg-black transition-colors">
              Kirim Ucapan
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white text-center text-gray-400 text-sm">
        <p>Created with BuatUndangan</p>
      </footer>
    </div>
  );
}
