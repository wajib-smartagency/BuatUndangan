export interface Mempelai {
  namaLengkap: string;
  namaPanggilan: string;
  namaBapak: string;
  namaIbu: string;
  foto?: string;
  instagram?: string;
}

export interface Acara {
  nama: string;
  tanggal: string; // ISO string atau format khusus
  waktuMulai: string;
  waktuSelesai: string;
  lokasi: string;
  alamatLengkap: string;
  linkGoogleMaps?: string;
}

export interface Rekening {
  namaBank: string;
  noRekening: string;
  atasNama: string;
}

export interface WeddingData {
  pria: Mempelai;
  wanita: Mempelai;
  acaraAkad: Acara;
  acaraResepsi: Acara;
  kutipan?: string;
  sumberKutipan?: string;
  galeri?: string[]; // Array of image URLs
  rekening?: Rekening[];
  audioMusik?: string; // URL mp3
  tema?: string;
}
