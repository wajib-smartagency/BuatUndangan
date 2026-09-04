import { WeddingData } from '@/types/invitation';

export const mockWeddingData: WeddingData = {
  pria: {
    namaLengkap: 'Rizky Pratama',
    namaPanggilan: 'Rizky',
    namaBapak: 'Budi Santoso',
    namaIbu: 'Siti Aminah',
    instagram: 'rizkypratama',
    foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop'
  },
  wanita: {
    namaLengkap: 'Anisa Larasati',
    namaPanggilan: 'Anisa',
    namaBapak: 'Haryanto',
    namaIbu: 'Dewi Lestari',
    instagram: 'anisalarasati',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'
  },
  acaraAkad: {
    nama: 'Akad Nikah',
    tanggal: '2026-10-15',
    waktuMulai: '08:00',
    waktuSelesai: '10:00',
    lokasi: 'Masjid Agung Trans Studio',
    alamatLengkap: 'Jl. Gatot Subroto No.289, Cibangkong, Batununggal, Kota Bandung',
    linkGoogleMaps: 'https://maps.google.com'
  },
  acaraResepsi: {
    nama: 'Resepsi Pernikahan',
    tanggal: '2026-10-15',
    waktuMulai: '11:00',
    waktuSelesai: '14:00',
    lokasi: 'Trans Studio Mall Bandung',
    alamatLengkap: 'Jl. Gatot Subroto No.289, Cibangkong, Batununggal, Kota Bandung',
    linkGoogleMaps: 'https://maps.google.com'
  },
  kutipan: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
  sumberKutipan: 'QS. Ar-Rum: 21',
  galeri: [
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop'
  ],
  rekening: [
    {
      namaBank: 'BCA',
      noRekening: '1234567890',
      atasNama: 'Rizky Pratama'
    },
    {
      namaBank: 'Mandiri',
      noRekening: '0987654321',
      atasNama: 'Anisa Larasati'
    }
  ]
};
