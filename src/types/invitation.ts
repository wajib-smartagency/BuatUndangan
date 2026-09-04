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

export interface ProfilUltah {
  namaLengkap: string;
  namaPanggilan: string;
  umur: string;
  foto?: string;
  dresscode?: string;
}

export interface BirthdayData {
  profil: ProfilUltah;
  acara: Acara;
  kutipan?: string;
  sumberKutipan?: string;
  galeri?: string[];
  rekening?: Rekening[];
  audioMusik?: string;
  tema?: string;
  coverImage?: string;
}

export interface PenyelenggaraEvent {
  namaEvent: string;
  namaPenyelenggara: string;
  deskripsi?: string;
  logo?: string;
}

export interface CorporateEventData {
  penyelenggara: PenyelenggaraEvent;
  acara: Acara;
  kutipan?: string;
  sumberKutipan?: string;
  galeri?: string[];
  audioMusik?: string;
  tema?: string;
  coverImage?: string;
}
