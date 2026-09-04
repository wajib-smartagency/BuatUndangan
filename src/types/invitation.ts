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

export interface RsvpProps {
  name: string;
  status: string;
  message: string;
  isSubmitting: boolean;
  hasSubmitted: boolean;
  onNameChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onMessageChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
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
  coverImage?: string;
}

export interface Host {
  namaLengkap: string;
  namaPanggilan: string;
  deskripsi?: string; // e.g., "Ulang Tahun ke-21" or "CEO Perusahaan"
  foto?: string;
  instagram?: string;
}

export interface GeneralEventData {
  host: Host;
  acara: Acara;
  kutipan?: string;
  sumberKutipan?: string;
  galeri?: string[];
  rekening?: Rekening[];
  audioMusik?: string;
  tema?: string;
  coverImage?: string;
}
