import React from 'react';
import { WeddingData } from '@/types/invitation';

interface ElegantWeddingProps {
  data: WeddingData;
}

export default function ElegantWedding({ data }: ElegantWeddingProps) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A4A4A] font-serif">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden border-[16px] border-[#F2EFE9] m-4">
        {/* Decorative corner borders could go here */}
        <p className="text-sm tracking-[0.4em] uppercase mb-8 text-[#B89B5E]">Undangan Pernikahan</p>
        <h1 className="text-6xl md:text-8xl text-[#2C3E2D] mb-6">
          {data.pria.namaPanggilan} <br/><span className="text-4xl text-[#B89B5E] italic my-4 block">&</span> {data.wanita.namaPanggilan}
        </h1>
        <div className="w-24 h-[1px] bg-[#B89B5E] my-8 mx-auto"></div>
        <p className="text-lg text-[#2C3E2D] tracking-[0.2em] uppercase">
          {new Date(data.acaraAkad.tanggal).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
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
          <div className="w-16 h-[2px] bg-[#B89B5E] mx-auto mb-16"></div>
          
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

      {/* Digital Envelope */}
      {data.rekening && data.rekening.length > 0 && (
        <section className="py-24 px-4 bg-white text-center border-t border-[#F2EFE9]">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl text-[#2C3E2D] mb-4">Tanda Kasih</h2>
            <div className="w-16 h-[2px] bg-[#B89B5E] mx-auto mb-8"></div>
            <p className="text-[#888] mb-12 leading-relaxed">Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan kado terindah bagi kami. Namun, apabila Bapak/Ibu/Saudara/i hendak memberikan tanda kasih, dapat melalui fitur kado digital berikut:</p>
            
            <div className="space-y-6">
              {data.rekening.map((rek, i) => (
                <div key={i} className="bg-[#FDFBF7] p-8 rounded-sm border border-[#E8E1D5] inline-block w-full max-w-sm">
                  <h3 className="font-bold text-xl text-[#2C3E2D] mb-3">{rek.namaBank}</h3>
                  <p className="text-2xl tracking-wider mb-2 font-sans text-[#4A4A4A]">{rek.noRekening}</p>
                  <p className="text-[#B89B5E] uppercase tracking-widest text-sm mt-4">A.N {rek.atasNama}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RSVP & Wishes */}
      <section className="py-24 px-4 bg-[#FDFBF7] border-t border-[#F2EFE9]">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-[#2C3E2D] mb-4">Kehadiran & Ucapan</h2>
            <div className="w-16 h-[2px] bg-[#B89B5E] mx-auto"></div>
          </div>
          
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block font-sans text-sm tracking-widest uppercase text-[#888] mb-2">Nama Lengkap</label>
              <input type="text" className="w-full border-b border-[#B89B5E] py-3 bg-transparent focus:outline-none focus:border-[#2C3E2D] transition-colors font-sans" placeholder="Nama Anda" />
            </div>
            <div>
              <label className="block font-sans text-sm tracking-widest uppercase text-[#888] mb-2">Kehadiran</label>
              <select className="w-full border-b border-[#B89B5E] py-3 bg-transparent focus:outline-none focus:border-[#2C3E2D] transition-colors font-sans text-[#4A4A4A]">
                <option value="hadir">Bersedia Hadir</option>
                <option value="tidak">Maaf, Tidak Bisa Hadir</option>
              </select>
            </div>
            <div>
              <label className="block font-sans text-sm tracking-widest uppercase text-[#888] mb-2">Pesan Untuk Mempelai</label>
              <textarea rows={4} className="w-full border-b border-[#B89B5E] py-3 bg-transparent focus:outline-none focus:border-[#2C3E2D] transition-colors font-sans" placeholder="Tulis doa dan harapan Anda..."></textarea>
            </div>
            <button type="submit" className="w-full bg-[#2C3E2D] text-[#E8E1D5] py-4 font-sans tracking-[0.1em] uppercase text-sm hover:bg-[#1a251b] transition-colors">
              Kirim Pesan
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#2C3E2D] text-[#E8E1D5] text-center text-sm font-sans tracking-widest">
        <p>BUATUNDANGAN DIGITAL</p>
      </footer>
    </div>
  );
}
