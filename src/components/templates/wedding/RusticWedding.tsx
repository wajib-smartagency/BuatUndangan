import React from 'react';
import { WeddingData, RsvpProps } from '@/types/invitation';

interface RusticWeddingProps {
  data: WeddingData;
  rsvp?: RsvpProps;
  rsvpsList?: any[];
}

export default function RusticWedding({ data, rsvp, rsvpsList }: RusticWeddingProps) {
  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#5C4A3D] font-serif">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-[#E3DAC9] rounded-b-[50%] opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-full h-32 bg-[#D1C7B7] rounded-t-[50%] opacity-50"></div>
        
        <div className="z-10 bg-white/60 p-12 rounded-3xl backdrop-blur-sm border border-[#E3DAC9] max-w-2xl w-full mx-4 shadow-sm">
          <p className="text-sm tracking-[0.3em] uppercase mb-6 text-[#8B7355]">Pernikahan</p>
          <h1 className="text-5xl md:text-7xl text-[#4A3B2C] mb-4 font-medium">
            {data.pria.namaPanggilan} <br/> <span className="text-[#8B7355] text-4xl block my-2">&amp;</span> {data.wanita.namaPanggilan}
          </h1>
          <p className="text-lg text-[#5C4A3D] mt-8 font-sans font-medium">
            {new Date(data.acaraAkad.tanggal).toLocaleDateString('id-ID', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
      </section>

      {/* Quote Section */}
      {data.kutipan && (
        <section className="py-20 px-4 bg-[#8B7355] text-[#F4F1EA] text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-xl italic leading-loose mb-6">
              &quot;{data.kutipan}&quot;
            </p>
            {data.sumberKutipan && (
              <p className="text-sm tracking-widest font-sans uppercase text-[#D1C7B7]">
                - {data.sumberKutipan} -
              </p>
            )}
          </div>
        </section>
      )}

      {/* Couple Section */}
      <section className="py-24 px-4 bg-[#F4F1EA]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-16">
          {/* Pria */}
          <div className="text-center flex-1 bg-white p-8 rounded-2xl shadow-sm border border-[#E3DAC9]">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 border-4 border-[#F4F1EA]">
              {data.pria.foto ? (
                <img src={data.pria.foto} alt={data.pria.namaLengkap} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#E3DAC9] flex items-center justify-center text-[#8B7355]">Foto Pria</div>
              )}
            </div>
            <h2 className="text-2xl text-[#4A3B2C] mb-2 font-medium">{data.pria.namaLengkap}</h2>
            <p className="text-[#8B7355] font-sans text-sm mb-1">Putra dari</p>
            <p className="text-[#5C4A3D] font-sans text-sm">Bpk. {data.pria.namaBapak} & Ibu {data.pria.namaIbu}</p>
          </div>
          
          <div className="text-5xl text-[#8B7355] italic">~</div>

          {/* Wanita */}
          <div className="text-center flex-1 bg-white p-8 rounded-2xl shadow-sm border border-[#E3DAC9]">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 border-4 border-[#F4F1EA]">
              {data.wanita.foto ? (
                <img src={data.wanita.foto} alt={data.wanita.namaLengkap} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#E3DAC9] flex items-center justify-center text-[#8B7355]">Foto Wanita</div>
              )}
            </div>
            <h2 className="text-2xl text-[#4A3B2C] mb-2 font-medium">{data.wanita.namaLengkap}</h2>
            <p className="text-[#8B7355] font-sans text-sm mb-1">Putri dari</p>
            <p className="text-[#5C4A3D] font-sans text-sm">Bpk. {data.wanita.namaBapak} & Ibu {data.wanita.namaIbu}</p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 px-4 bg-[#E8E1D5]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl text-[#4A3B2C] mb-12">Waktu & Tempat</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Akad */}
            <div className="bg-[#F4F1EA] p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-[#8B7355] text-[#F4F1EA] rounded-full flex items-center justify-center mx-auto mb-6 text-xl">
                💍
              </div>
              <h3 className="text-2xl text-[#4A3B2C] mb-4">{data.acaraAkad.nama}</h3>
              <p className="text-lg mb-1">
                {new Date(data.acaraAkad.tanggal).toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
              <p className="text-[#8B7355] mb-6 font-sans font-medium">{data.acaraAkad.waktuMulai} - {data.acaraAkad.waktuSelesai}</p>
              <p className="font-semibold mb-2">{data.acaraAkad.lokasi}</p>
              <p className="text-[#5C4A3D] font-sans text-sm mb-8">{data.acaraAkad.alamatLengkap}</p>
              {data.acaraAkad.linkGoogleMaps && (
                <a href={data.acaraAkad.linkGoogleMaps} target="_blank" rel="noreferrer" className="inline-block bg-[#8B7355] text-white px-6 py-2 rounded-full font-sans text-sm hover:bg-[#6b5840] transition-colors shadow-md">
                  Lihat Lokasi
                </a>
              )}
            </div>

            {/* Resepsi */}
            <div className="bg-[#F4F1EA] p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-[#8B7355] text-[#F4F1EA] rounded-full flex items-center justify-center mx-auto mb-6 text-xl">
                🥂
              </div>
              <h3 className="text-2xl text-[#4A3B2C] mb-4">{data.acaraResepsi.nama}</h3>
              <p className="text-lg mb-1">
                {new Date(data.acaraResepsi.tanggal).toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
              <p className="text-[#8B7355] mb-6 font-sans font-medium">{data.acaraResepsi.waktuMulai} - {data.acaraResepsi.waktuSelesai}</p>
              <p className="font-semibold mb-2">{data.acaraResepsi.lokasi}</p>
              <p className="text-[#5C4A3D] font-sans text-sm mb-8">{data.acaraResepsi.alamatLengkap}</p>
              {data.acaraResepsi.linkGoogleMaps && (
                <a href={data.acaraResepsi.linkGoogleMaps} target="_blank" rel="noreferrer" className="inline-block bg-[#8B7355] text-white px-6 py-2 rounded-full font-sans text-sm hover:bg-[#6b5840] transition-colors shadow-md">
                  Lihat Lokasi
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Digital Envelope */}
      {data.rekening && data.rekening.length > 0 && (
        <section className="py-24 px-4 bg-[#F4F1EA] text-center">
          <div className="max-w-xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-[#E3DAC9]">
            <div className="text-4xl mb-4">🎁</div>
            <h2 className="text-3xl text-[#4A3B2C] mb-4">Wedding Gift</h2>
            <p className="text-[#8B7355] font-sans text-sm mb-8">Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih dapat melalui virtual account / transfer di bawah ini.</p>
            
            <div className="space-y-4">
              {data.rekening.map((rek, i) => (
                <div key={i} className="bg-[#F4F1EA] p-6 rounded-xl text-left border border-[#E3DAC9]">
                  <h3 className="font-bold text-lg text-[#4A3B2C]">{rek.namaBank}</h3>
                  <div className="flex justify-between items-center my-2">
                    <p className="text-xl font-mono text-[#5C4A3D]">{rek.noRekening}</p>
                    <button className="bg-white px-3 py-1 rounded text-xs font-sans text-[#8B7355] border border-[#E3DAC9] shadow-sm">Salin</button>
                  </div>
                  <p className="text-[#8B7355] font-sans text-sm">a.n {rek.atasNama}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RSVP & Wishes */}
      <section className="py-24 px-4 bg-[#E8E1D5]">
        <div className="max-w-xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-[#E3DAC9]">
          <h2 className="text-3xl text-[#4A3B2C] mb-8 text-center">RSVP & Ucapan</h2>
          
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block font-sans text-sm font-medium text-[#5C4A3D] mb-2">Nama Anda</label>
              <input type="text" className="w-full bg-[#F4F1EA] border border-[#E3DAC9] rounded-xl py-3 px-4 focus:outline-none focus:border-[#8B7355] transition-colors font-sans" placeholder="Tuliskan nama" />
            </div>
            <div>
              <label className="block font-sans text-sm font-medium text-[#5C4A3D] mb-2">Konfirmasi Kehadiran</label>
              <select className="w-full bg-[#F4F1EA] border border-[#E3DAC9] rounded-xl py-3 px-4 focus:outline-none focus:border-[#8B7355] transition-colors font-sans">
                <option value="hadir">Ya, saya akan hadir</option>
                <option value="tidak">Maaf, saya berhalangan</option>
              </select>
            </div>
            <div>
              <label className="block font-sans text-sm font-medium text-[#5C4A3D] mb-2">Ucapan & Doa</label>
              <textarea rows={4} className="w-full bg-[#F4F1EA] border border-[#E3DAC9] rounded-xl py-3 px-4 focus:outline-none focus:border-[#8B7355] transition-colors font-sans" placeholder="Tuliskan harapan untuk mempelai..."></textarea>
            </div>
            <button type="submit" className="w-full bg-[#8B7355] text-white py-4 rounded-xl font-sans font-medium hover:bg-[#6b5840] transition-colors shadow-md mt-4">
              Kirim Ucapan
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#4A3B2C] text-[#D1C7B7] text-center text-sm font-sans">
        <p>© {new Date().getFullYear()} BuatUndangan</p>
      </footer>
    </div>
  );
}
