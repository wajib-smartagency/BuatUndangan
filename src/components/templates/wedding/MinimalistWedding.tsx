import React from 'react';
import { WeddingData } from '@/types/invitation';

interface MinimalistWeddingProps {
  data: WeddingData;
}

export default function MinimalistWedding({ data }: MinimalistWeddingProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="text-sm tracking-[0.3em] uppercase mb-4 text-gray-500">The Wedding Of</p>
        <h1 className="text-5xl md:text-7xl font-light tracking-wider mb-8">
          {data.pria.namaPanggilan} <span className="font-serif italic mx-2">&</span> {data.wanita.namaPanggilan}
        </h1>
        <p className="text-lg text-gray-500 tracking-widest uppercase">
          {new Date(data.acaraAkad.tanggal).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
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
          {/* Pria */}
          <div className="text-center flex-1">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 bg-gray-200">
              {data.pria.foto ? (
                <img src={data.pria.foto} alt={data.pria.namaLengkap} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Foto</div>
              )}
            </div>
            <h2 className="text-2xl font-medium mb-2">{data.pria.namaLengkap}</h2>
            <p className="text-sm text-gray-500 mb-1">Putra dari</p>
            <p className="text-sm text-gray-600">Bpk. {data.pria.namaBapak} & Ibu {data.pria.namaIbu}</p>
            {data.pria.instagram && (
              <a href={`https://instagram.com/${data.pria.instagram}`} target="_blank" rel="noreferrer" className="inline-block mt-4 text-xs tracking-widest uppercase text-gray-400 hover:text-gray-800 transition-colors">
                @{data.pria.instagram}
              </a>
            )}
          </div>
          
          <div className="text-4xl font-serif italic text-gray-300">&</div>

          {/* Wanita */}
          <div className="text-center flex-1">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 bg-gray-200">
              {data.wanita.foto ? (
                <img src={data.wanita.foto} alt={data.wanita.namaLengkap} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Foto</div>
              )}
            </div>
            <h2 className="text-2xl font-medium mb-2">{data.wanita.namaLengkap}</h2>
            <p className="text-sm text-gray-500 mb-1">Putri dari</p>
            <p className="text-sm text-gray-600">Bpk. {data.wanita.namaBapak} & Ibu {data.wanita.namaIbu}</p>
            {data.wanita.instagram && (
              <a href={`https://instagram.com/${data.wanita.instagram}`} target="_blank" rel="noreferrer" className="inline-block mt-4 text-xs tracking-widest uppercase text-gray-400 hover:text-gray-800 transition-colors">
                @{data.wanita.instagram}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl tracking-[0.2em] uppercase mb-16">Acara</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Akad */}
            <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium mb-4">{data.acaraAkad.nama}</h3>
              <p className="text-gray-600 mb-2">
                {new Date(data.acaraAkad.tanggal).toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
              <p className="text-gray-500 mb-6">{data.acaraAkad.waktuMulai} - {data.acaraAkad.waktuSelesai}</p>
              <p className="font-medium mb-1">{data.acaraAkad.lokasi}</p>
              <p className="text-sm text-gray-500 mb-6">{data.acaraAkad.alamatLengkap}</p>
              {data.acaraAkad.linkGoogleMaps && (
                <a href={data.acaraAkad.linkGoogleMaps} target="_blank" rel="noreferrer" className="inline-block border border-gray-800 text-gray-800 px-6 py-2 text-sm tracking-widest uppercase hover:bg-gray-800 hover:text-white transition-colors">
                  Google Maps
                </a>
              )}
            </div>

            {/* Resepsi */}
            <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium mb-4">{data.acaraResepsi.nama}</h3>
              <p className="text-gray-600 mb-2">
                {new Date(data.acaraResepsi.tanggal).toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
              <p className="text-gray-500 mb-6">{data.acaraResepsi.waktuMulai} - {data.acaraResepsi.waktuSelesai}</p>
              <p className="font-medium mb-1">{data.acaraResepsi.lokasi}</p>
              <p className="text-sm text-gray-500 mb-6">{data.acaraResepsi.alamatLengkap}</p>
              {data.acaraResepsi.linkGoogleMaps && (
                <a href={data.acaraResepsi.linkGoogleMaps} target="_blank" rel="noreferrer" className="inline-block border border-gray-800 text-gray-800 px-6 py-2 text-sm tracking-widest uppercase hover:bg-gray-800 hover:text-white transition-colors">
                  Google Maps
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {data.galeri && data.galeri.length > 0 && (
        <section className="py-24 bg-white px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl tracking-[0.2em] uppercase mb-16 text-center">Galeri</h2>
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
