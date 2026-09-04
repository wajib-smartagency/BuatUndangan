"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Save, Users, Heart, Calendar, Palette, Upload, Trash2, Smartphone, Music, Gift, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { WeddingData } from "@/types/invitation";
import ElegantWedding from "@/components/templates/wedding/ElegantWedding";
import MinimalistWedding from "@/components/templates/wedding/MinimalistWedding";
import RusticWedding from "@/components/templates/wedding/RusticWedding";
import FunBirthday from "@/components/templates/birthday/FunBirthday";
import ModernEvent from "@/components/templates/general/ModernEvent";
import imageCompression from 'browser-image-compression';

export default function LiveEditorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("mempelai");
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    eventType: "wedding",
    host: { name: "Penyelenggara", description: "Acara Ulang Tahun", photo: "" },
    birthday: { nickname: "", fullName: "", age: "", photo: "", dresscode: "" },
    eventDetail: { eventName: "", hostName: "", description: "", logo: "" },
    title: "Pernikahan Romeo & Juliet",
    slug: "pernikahan-romeo-juliet",
    theme: "elegant",
    coverImage: "",
    greeting: "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.",
    groom: {
      nickname: "Romeo",
      fullName: "Romeo Montague",
      parents: "Putra dari Bpk. Montague & Ibu Montague",
      ig: "@romeo",
      photo: ""
    },
    bride: {
      nickname: "Juliet",
      fullName: "Juliet Capulet",
      parents: "Putri dari Bpk. Capulet & Ibu Capulet",
      ig: "@juliet",
      photo: ""
    },
    events: [
      {
        id: "1",
        type: "Akad Nikah",
        date: "2026-12-25",
        startTime: "08:00",
        endTime: "10:00",
        venue: "Masjid Agung Jakarta",
        address: "Jl. Sudirman No. 1, Jakarta Pusat",
        mapsUrl: ""
      },
      {
        id: "2",
        type: "Resepsi",
        date: "2026-12-25",
        startTime: "11:00",
        endTime: "14:00",
        venue: "Grand Ballroom Kempinski",
        address: "Jl. MH Thamrin, Jakarta Pusat",
        mapsUrl: ""
      }
    ],
    gifts: [
      { id: "1", bank: "BCA", accNumber: "1234567890", accName: "Romeo Montague" }
    ],
    gallery: [] as string[],
    musicUrl: ""
  });

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validasi 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("⚠️ File musik terlalu besar! Maksimal 5MB.");
      return;
    }

    try {
      setIsLoading(true);
      
      const ext = file.name.split('.').pop() || 'mp3';
      const fileName = `music/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

      const { error } = await supabase.storage
        .from('invitations')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('invitations')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, musicUrl: publicUrl }));
    } catch (err) {
      console.error(err);
      alert("Gagal mengupload musik. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, pathName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validasi 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("⚠️ Foto terlalu besar! Maksimal 5MB. Silakan pilih foto lain yang lebih kecil.");
      return;
    }

    try {
      setIsLoading(true);
      
      // Kompres file hingga maksimal 250KB dan dimensi lebar/tinggi maksimal 1200px
      const options = {
        maxSizeMB: 0.25,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      
      // Generate nama unik
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const filePath = `uploads/${fileName}`;

      const { error } = await supabase.storage
        .from('invitations')
        .upload(filePath, compressedFile);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('invitations')
        .getPublicUrl(filePath);

      // Update state
      if (pathName === 'coverImage') {
        setFormData(prev => ({ ...prev, coverImage: publicUrl }));
      } else if (pathName === 'groomPhoto') {
        setFormData(prev => ({ ...prev, groom: { ...prev.groom, photo: publicUrl } }));
      } else if (pathName === 'bridePhoto') {
        setFormData(prev => ({ ...prev, bride: { ...prev.bride, photo: publicUrl } }));
      } else if (pathName === 'host') {
        setFormData(prev => ({ ...prev, host: { ...prev.host, photo: publicUrl } }));
      } else if (pathName === 'birthdayPhoto') {
        setFormData(prev => ({ ...prev, birthday: { ...prev.birthday, photo: publicUrl } }));
      } else if (pathName === 'eventLogo') {
        setFormData(prev => ({ ...prev, eventDetail: { ...prev.eventDetail, logo: publicUrl } }));
      }

    } catch (err) {
      console.error(err);
      alert("Gagal mengupload gambar. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < Math.min(files.length, 6); i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) continue;

        const options = {
          maxSizeMB: 0.25,
          maxWidthOrHeight: 1280,
          useWebWorker: true
        };
        const compressedFile = await imageCompression(file, options);
        
        const ext = file.name.split('.').pop() || 'jpg';
        const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

        const { error } = await supabase.storage.from('invitations').upload(fileName, compressedFile);
        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage.from('invitations').getPublicUrl(fileName);
        uploadedUrls.push(publicUrl);
      }

      setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...uploadedUrls].slice(0, 6) }));
    } catch (err) {
      console.error(err);
      alert("Gagal mengupload galeri. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => {
      const newGroom = { ...prev.groom, [e.target.name]: e.target.value };
      const newTitle = prev.eventType === 'wedding' 
        ? `Pernikahan ${newGroom.nickname || 'Pria'} & ${prev.bride.nickname || 'Wanita'}`
        : prev.title;
      return { ...prev, groom: newGroom, title: newTitle };
    });
  };

  const handleBrideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => {
      const newBride = { ...prev.bride, [e.target.name]: e.target.value };
      const newTitle = prev.eventType === 'wedding' 
        ? `Pernikahan ${prev.groom.nickname || 'Pria'} & ${newBride.nickname || 'Wanita'}`
        : prev.title;
      return { ...prev, bride: newBride, title: newTitle };
    });
  };

  const handleEventChange = (id: string, field: string, value: string) => {
    setFormData({
      ...formData,
      events: formData.events.map(ev => ev.id === id ? { ...ev, [field]: value } : ev)
    });
  };

  const handleGiftChange = (id: string, field: string, value: string) => {
    setFormData({
      ...formData,
      gifts: formData.gifts.map(gf => gf.id === id ? { ...gf, [field]: value } : gf)
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Silakan login terlebih dahulu untuk menyimpan proyek.");
        setIsLoading(false);
        return;
      }

      const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      // Simpan ke DB dengan struktur JSON lengkap
      const { data, error } = await supabase.from('projects').insert([
        { 
          user_id: user.id,
          title: formData.title,
          event_date: formData.events[0].date,
          slug: slug,
          event_type: formData.eventType,
          is_published: true,
          content: formData // Simpan seluruh state form di JSONB
        }
      ]).select().single();
      
      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push(`/dashboard/projects/${data.id}`);
      }, 2000);
    } catch (error: any) {
      console.error("Error saving project:", error);
      alert(error.message || "Gagal menyimpan proyek.");
    } finally {
      setIsLoading(false);
    }
  };

  // Adapter untuk preview
  const previewData: any = {
    coverImage: formData.coverImage,
    pria: {
      namaLengkap: formData.groom.fullName || "Mempelai Pria",
      namaPanggilan: formData.groom.nickname || "Pria",
      namaBapak: formData.groom.parents.split("&")[0]?.replace("Putra dari Bpk. ", "").trim() || "Bapak",
      namaIbu: formData.groom.parents.split("&")[1]?.replace("Ibu ", "").trim() || "Ibu",
      instagram: formData.groom.ig.replace("@", ""),
      foto: formData.groom.photo,
    },
    wanita: {
      namaLengkap: formData.bride.fullName || "Mempelai Wanita",
      namaPanggilan: formData.bride.nickname || "Wanita",
      namaBapak: formData.bride.parents.split("&")[0]?.replace("Putri dari Bpk. ", "").trim() || "Bapak",
      namaIbu: formData.bride.parents.split("&")[1]?.replace("Ibu ", "").trim() || "Ibu",
      instagram: formData.bride.ig.replace("@", ""),
      foto: formData.bride.photo,
    },
    // For Birthday
    profil: {
      namaLengkap: formData.birthday.fullName || "Nama Lengkap",
      namaPanggilan: formData.birthday.nickname || "Panggilan",
      umur: formData.birthday.age || "17",
      foto: formData.birthday.photo,
      dresscode: formData.birthday.dresscode,
    },
    // For Corporate Event
    penyelenggara: {
      namaEvent: formData.eventDetail.eventName || "Nama Event",
      namaPenyelenggara: formData.eventDetail.hostName || "Nama Penyelenggara",
      deskripsi: formData.eventDetail.description || "Deskripsi Singkat",
      logo: formData.eventDetail.logo,
    },
    acaraAkad: {
      nama: formData.events[0]?.type || "Akad Nikah",
      tanggal: formData.events[0]?.date || new Date().toISOString(),
      waktuMulai: formData.events[0]?.startTime || "08:00",
      waktuSelesai: formData.events[0]?.endTime || "10:00",
      lokasi: formData.events[0]?.venue || "Lokasi",
      alamatLengkap: formData.events[0]?.address || "Alamat",
      linkGoogleMaps: formData.events[0]?.mapsUrl,
    },
    acaraResepsi: {
      nama: formData.events[1]?.type || "Resepsi",
      tanggal: formData.events[1]?.date || new Date().toISOString(),
      waktuMulai: formData.events[1]?.startTime || "11:00",
      waktuSelesai: formData.events[1]?.endTime || "14:00",
      lokasi: formData.events[1]?.venue || "Lokasi",
      alamatLengkap: formData.events[1]?.address || "Alamat",
      linkGoogleMaps: formData.events[1]?.mapsUrl,
    },
    // Single Event (Birthday/Corporate)
    acara: {
      nama: formData.events[0]?.type || "Acara Utama",
      tanggal: formData.events[0]?.date || new Date().toISOString(),
      waktuMulai: formData.events[0]?.startTime || "08:00",
      waktuSelesai: formData.events[0]?.endTime || "12:00",
      lokasi: formData.events[0]?.venue || "Lokasi",
      alamatLengkap: formData.events[0]?.address || "Alamat",
      linkGoogleMaps: formData.events[0]?.mapsUrl,
    },
    kutipan: formData.greeting || "Selamat datang di acara kami.",
    sumberKutipan: "",
    galeri: formData.gallery || [],
    rekening: formData.gifts.map(g => ({
      namaBank: g.bank,
      noRekening: g.accNumber,
      atasNama: g.accName
    })),
    tema: formData.theme,
    audioMusik: formData.musicUrl
  };

  const tabs = formData.eventType === "wedding" 
    ? [
        { id: "mempelai", icon: Heart, label: "Mempelai" },
        { id: "acara", icon: Calendar, label: "Acara" },
        { id: "galeri", icon: ImageIcon, label: "Galeri" },
        { id: "hadiah", icon: Gift, label: "Angpao" },
        { id: "desain", icon: Palette, label: "Desain" },
      ]
    : formData.eventType === "birthday"
    ? [
        { id: "profilUltah", icon: Heart, label: "Profil" },
        { id: "acara", icon: Calendar, label: "Acara" },
        { id: "galeri", icon: ImageIcon, label: "Galeri" },
        { id: "hadiah", icon: Gift, label: "Kado" },
        { id: "desain", icon: Palette, label: "Desain" },
      ]
    : [
        { id: "penyelenggara", icon: Users, label: "Penyelenggara" },
        { id: "acara", icon: Calendar, label: "Acara" },
        { id: "galeri", icon: ImageIcon, label: "Galeri" },
        { id: "desain", icon: Palette, label: "Desain" }, // Event has no Kado
      ];

  
  if (step === 1) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] bg-slate-50 -m-4 sm:-m-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Pilih Jenis Proyek</h2>
        <p className="text-slate-500 mb-10">Pilih kategori undangan yang ingin Anda buat.</p>
        <div className="flex flex-col md:flex-row flex-wrap justify-center gap-6">
          <button onClick={() => { setFormData({...formData, eventType: 'wedding', title: 'Pernikahan Baru'}); setActiveTab('mempelai'); setStep(2); }} className="w-64 p-8 bg-white border-2 border-indigo-100 hover:border-indigo-600 rounded-3xl text-center group transition-all hover:shadow-xl">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💍</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Pernikahan</h3>
            <p className="text-sm text-slate-500">Undangan resepsi & akad nikah.</p>
          </button>
          <button onClick={() => { setFormData({...formData, eventType: 'birthday', title: 'Ulang Tahun Baru', greeting: 'Let\'s celebrate! Aku mengundang kalian untuk hadir di hari bahagiaku.', events: [{ id: '1', type: 'Detail Acara', date: '', startTime: '', endTime: '', venue: '', address: '', mapsUrl: '' }]}); setActiveTab('profilUltah'); setStep(2); }} className="w-64 p-8 bg-white border-2 border-indigo-100 hover:border-indigo-600 rounded-3xl text-center group transition-all hover:shadow-xl">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎂</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ulang Tahun</h3>
            <p className="text-sm text-slate-500">Sweet seventeen, kids party, dll.</p>
          </button>
          <button onClick={() => { setFormData({...formData, eventType: 'event', title: 'Event Baru', greeting: 'Kami mengundang Anda untuk hadir dalam acara kami.', events: [{ id: '1', type: 'Detail Acara', date: '', startTime: '', endTime: '', venue: '', address: '', mapsUrl: '' }]}); setActiveTab('penyelenggara'); setStep(2); }} className="w-64 p-8 bg-white border-2 border-indigo-100 hover:border-indigo-600 rounded-3xl text-center group transition-all hover:shadow-xl">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎫</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Event Umum</h3>
            <p className="text-sm text-slate-500">Seminar, gathering, reuni, dll.</p>
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col -m-4 sm:-m-8">
      {/* Topbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between z-10 shrink-0 gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Link href="/dashboard/projects" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="text-lg font-bold text-slate-900 focus:outline-none focus:border-b-2 focus:border-indigo-600 bg-transparent w-full sm:w-64"
              placeholder="Judul Proyek"
            />
            {/* Input Slug URL */}
            <div className="flex items-center mt-1 text-xs text-slate-500">
              <span className="text-slate-400">buatundangan.vercel.app/</span>
              <input 
                type="text" 
                value={formData.slug} 
                onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                className="font-mono text-indigo-600 bg-transparent focus:outline-none border-b border-transparent focus:border-indigo-300 w-32 md:w-48 ml-1"
                placeholder={formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}
              />
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={isLoading} className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
          <Save className="w-4 h-4" /> {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {/* Main Layout Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {success && (
           <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
             <CheckCircle2 className="text-emerald-400 w-5 h-5" />
             Undangan Berhasil Dibuat!
           </div>
        )}

        {/* Kiri: Form Editor */}
        <div className="flex-1 max-w-xl bg-white border-r border-slate-200 flex flex-col z-20 shadow-xl">
          
          {/* Tabs Menu Horizontal */}
          <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/50 custom-scrollbar shrink-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id 
                    ? "border-indigo-600 text-indigo-600" 
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            
            
            {activeTab === "profilUltah" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 border-b pb-2">Teks Pengantar</h3>
                  <textarea 
                    value={formData.greeting} 
                    onChange={(e) => setFormData({...formData, greeting: e.target.value})}
                    rows={3} 
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-4 p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                  <h3 className="font-bold text-indigo-900 flex items-center gap-2">Profil Ultah</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Nama Panggilan</label>
                      <input type="text" value={formData.birthday.nickname} onChange={e => setFormData({...formData, birthday: {...formData.birthday, nickname: e.target.value}})} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Ultah Ke- (Umur)</label>
                      <input type="number" value={formData.birthday.age} onChange={e => setFormData({...formData, birthday: {...formData.birthday, age: e.target.value}})} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="Contoh: 17" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Nama Lengkap</label>
                    <input type="text" value={formData.birthday.fullName} onChange={e => setFormData({...formData, birthday: {...formData.birthday, fullName: e.target.value}})} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Info Dresscode (Opsional)</label>
                    <input type="text" value={formData.birthday.dresscode} onChange={e => setFormData({...formData, birthday: {...formData.birthday, dresscode: e.target.value}})} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="Contoh: Baju warna putih" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Foto Profil Ultah</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'birthdayPhoto')} className="w-full p-2 border border-slate-200 bg-white rounded-lg text-sm" />
                    {formData.birthday.photo && <p className="text-xs text-emerald-600 mt-2 font-bold">✓ Foto terupload</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "penyelenggara" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 border-b pb-2">Teks Pengantar</h3>
                  <textarea 
                    value={formData.greeting} 
                    onChange={(e) => setFormData({...formData, greeting: e.target.value})}
                    rows={3} 
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-4 p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                  <h3 className="font-bold text-indigo-900 flex items-center gap-2">Detail Penyelenggara Event</h3>
                  <div>
                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Judul / Nama Event</label>
                    <input type="text" value={formData.eventDetail.eventName} onChange={e => setFormData({...formData, eventDetail: {...formData.eventDetail, eventName: e.target.value}})} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="Contoh: Tech Summit 2026" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Nama Penyelenggara</label>
                    <input type="text" value={formData.eventDetail.hostName} onChange={e => setFormData({...formData, eventDetail: {...formData.eventDetail, hostName: e.target.value}})} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="Contoh: Budi Corporate" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Deskripsi Singkat</label>
                    <input type="text" value={formData.eventDetail.description} onChange={e => setFormData({...formData, eventDetail: {...formData.eventDetail, description: e.target.value}})} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="Contoh: Konferensi Tahunan" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Logo / Banner</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'eventLogo')} className="w-full p-2 border border-slate-200 bg-white rounded-lg text-sm" />
                    {formData.eventDetail.logo && <p className="text-xs text-emerald-600 mt-2 font-bold">✓ Logo terupload</p>}
                  </div>
                </div>
              </div>
            )}
  
            {activeTab === "mempelai" && formData.eventType === "wedding" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 border-b pb-2">Teks Pengantar</h3>
                  <textarea 
                    value={formData.greeting} 
                    onChange={(e) => setFormData({...formData, greeting: e.target.value})}
                    rows={3} 
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-4 p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                  <h3 className="font-bold text-indigo-900 flex items-center gap-2"><span className="text-xl">👨</span> Mempelai Pria</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Nama Panggilan</label>
                      <input type="text" name="nickname" value={formData.groom.nickname} onChange={handleGroomChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Username IG</label>
                      <input type="text" name="ig" value={formData.groom.ig} onChange={handleGroomChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Nama Lengkap</label>
                    <input type="text" name="fullName" value={formData.groom.fullName} onChange={handleGroomChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Nama Orang Tua</label>
                    <input type="text" name="parents" value={formData.groom.parents} onChange={handleGroomChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Foto Mempelai Pria</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'groomPhoto')} className="w-full p-2 border border-slate-200 bg-white rounded-lg text-sm" />
                    {formData.groom.photo && <p className="text-xs text-emerald-600 mt-1">✓ Foto sudah terupload</p>}
                  </div>
                </div>

                <div className="space-y-4 p-5 bg-rose-50/50 border border-rose-100 rounded-2xl">
                  <h3 className="font-bold text-rose-900 flex items-center gap-2"><span className="text-xl">👩</span> Mempelai Wanita</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Nama Panggilan</label>
                      <input type="text" name="nickname" value={formData.bride.nickname} onChange={handleBrideChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Username IG</label>
                      <input type="text" name="ig" value={formData.bride.ig} onChange={handleBrideChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Nama Lengkap</label>
                    <input type="text" name="fullName" value={formData.bride.fullName} onChange={handleBrideChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Nama Orang Tua</label>
                    <input type="text" name="parents" value={formData.bride.parents} onChange={handleBrideChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Foto Mempelai Wanita</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'bridePhoto')} className="w-full p-2 border border-slate-200 bg-white rounded-lg text-sm" />
                    {formData.bride.photo && <p className="text-xs text-emerald-600 mt-1">✓ Foto sudah terupload</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "acara" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {formData.events.map((ev, idx) => (
                  <div key={ev.id} className="p-5 border border-slate-200 rounded-2xl space-y-4 relative">
                    {formData.eventType === "wedding" && (
                      <div className="absolute top-0 right-0 bg-slate-100 px-3 py-1 text-xs font-bold rounded-bl-lg rounded-tr-xl text-slate-500">
                        Acara {idx + 1}
                      </div>
                    )}
                    <h3 className="font-bold text-slate-900 border-b pb-2">
                      {formData.eventType === "wedding" ? ev.type : "Detail Acara"}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Tanggal</label>
                        <input type="date" value={ev.date} onChange={(e) => handleEventChange(ev.id, 'date', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div className="flex gap-2">
                         <div className="flex-1">
                           <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Mulai</label>
                           <input type="time" value={ev.startTime} onChange={(e) => handleEventChange(ev.id, 'startTime', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                         </div>
                         <div className="flex-1">
                           <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Selesai</label>
                           <input type="time" value={ev.endTime} onChange={(e) => handleEventChange(ev.id, 'endTime', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                         </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Nama Tempat / Gedung</label>
                      <input type="text" value={ev.venue} onChange={(e) => handleEventChange(ev.id, 'venue', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    
                    <div>
                      <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Alamat Lengkap</label>
                      <textarea rows={2} value={ev.address} onChange={(e) => handleEventChange(ev.id, 'address', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm resize-none" />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Link Google Maps (Opsional)</label>
                      <input type="url" placeholder="https://maps.google.com/..." value={ev.mapsUrl} onChange={(e) => handleEventChange(ev.id, 'mapsUrl', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm text-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "galeri" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 py-6">
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-800 text-sm mb-4">
                  Upload maksimal 6 foto untuk ditampilkan di undangan (Maks 5MB per foto).
                </div>
                
                <div className="bg-white border-2 border-dashed border-slate-300 p-8 rounded-2xl text-center">
                   <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                   <h3 className="font-bold text-slate-700 mb-1">Pilih Foto Galeri</h3>
                   <p className="text-xs text-slate-500 mb-4">Mendukung format JPG, PNG.</p>
                   <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="w-full max-w-xs mx-auto block text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                </div>

                {formData.gallery && formData.gallery.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    {formData.gallery.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                        <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setFormData(prev => ({...prev, gallery: prev.gallery.filter((_, i) => i !== idx)}))}
                          className="absolute top-2 right-2 w-8 h-8 bg-white/90 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "hadiah" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm mb-4">
                  Isi data rekening untuk memudahkan tamu memberikan hadiah/angpao secara digital.
                </div>
                {formData.gifts.map((gf) => (
                   <div key={gf.id} className="p-5 border border-slate-200 rounded-2xl space-y-4">
                     <h3 className="font-bold text-slate-900 border-b pb-2">Rekening Bank / e-Wallet</h3>
                     <div>
                        <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Nama Bank</label>
                        <select value={gf.bank} onChange={(e) => handleGiftChange(gf.id, 'bank', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm">
                           <option>BCA</option>
                           <option>Mandiri</option>
                           <option>BNI</option>
                           <option>BRI</option>
                           <option>BSI</option>
                           <option>GoPay</option>
                           <option>OVO</option>
                           <option>Dana</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Nomor Rekening / HP</label>
                        <input type="text" value={gf.accNumber} onChange={(e) => handleGiftChange(gf.id, 'accNumber', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm font-mono" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Atas Nama</label>
                        <input type="text" value={gf.accName} onChange={(e) => handleGiftChange(gf.id, 'accName', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                      </div>
                   </div>
                ))}
              </div>
            )}

            {activeTab === "desain" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 py-6">
                 <div className="text-center mb-6">
                   <Palette className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
                   <h3 className="text-xl font-bold text-slate-900">Tema Visual</h3>
                   <p className="text-slate-500 text-sm">Pilih tema desain undangan untuk acara Anda.</p>
                 </div>
                 
                 <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                    <label className="text-sm font-bold text-slate-900 mb-2 block flex items-center gap-2">
                       <ImageIcon className="w-4 h-4 text-indigo-600" /> Foto Background / Sampul Utama
                    </label>
                    <p className="text-xs text-slate-500 mb-3">Foto ini akan ditampilkan sebagai halaman depan undangan (Cover).</p>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'coverImage')} className="w-full p-2 border border-slate-200 bg-white rounded-lg text-sm mb-2" />
                    {formData.coverImage && <p className="text-xs text-emerald-600 font-bold">✓ Foto background sudah terupload</p>}
                 </div>

                 <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                    <label className="text-sm font-bold text-slate-900 mb-2 block flex items-center gap-2">
                       <Music className="w-4 h-4 text-indigo-600" /> Lagu Latar (Background Music)
                    </label>
                    <p className="text-xs text-slate-500 mb-3">Pilih lagu berformat MP3 (Maksimal 5MB). Musik akan otomatis berputar saat undangan dibuka.</p>
                    <input type="file" accept="audio/*" onChange={handleAudioUpload} className="w-full p-2 border border-slate-200 bg-white rounded-lg text-sm mb-2" />
                    {formData.musicUrl && (
                      <div className="mt-3">
                        <p className="text-xs text-emerald-600 font-bold mb-2">✓ Lagu siap diputar</p>
                        <audio src={formData.musicUrl} controls className="w-full h-8" />
                      </div>
                    )}
                 </div>

                 {formData.eventType === 'wedding' ? (
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {/* Elegant */}
                     <button 
                       onClick={() => setFormData({...formData, theme: 'elegant'})}
                       className={`p-4 rounded-xl border-2 text-center transition-all ${formData.theme === 'elegant' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}
                     >
                       <div className="w-full h-32 bg-[#FDFBF7] border border-slate-200 rounded-lg mb-3 flex flex-col items-center justify-center p-2">
                          <div className="text-[#2C3E2D] font-serif text-lg leading-tight">Elegant</div>
                          <div className="w-8 h-px bg-[#B89B5E] my-2"></div>
                          <div className="text-[10px] text-[#B89B5E] uppercase tracking-widest">Theme</div>
                       </div>
                       <h4 className="font-bold text-slate-900">Elegant</h4>
                     </button>
                     
                     {/* Minimalist */}
                     <button 
                       onClick={() => setFormData({...formData, theme: 'minimalist'})}
                       className={`p-4 rounded-xl border-2 text-center transition-all ${formData.theme === 'minimalist' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}
                     >
                       <div className="w-full h-32 bg-white border border-slate-200 rounded-lg mb-3 flex flex-col items-center justify-center p-2">
                          <div className="text-slate-900 font-sans font-light tracking-widest text-lg uppercase">Minimal</div>
                          <div className="text-xs text-slate-400 mt-1">Design</div>
                       </div>
                       <h4 className="font-bold text-slate-900">Minimalist</h4>
                     </button>
 
                     {/* Rustic */}
                     <button 
                       onClick={() => setFormData({...formData, theme: 'rustic'})}
                       className={`p-4 rounded-xl border-2 text-center transition-all ${formData.theme === 'rustic' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}
                     >
                       <div className="w-full h-32 bg-[#F4F1EA] border border-slate-200 rounded-lg mb-3 flex flex-col items-center justify-center p-2">
                          <div className="text-[#5C4D43] font-serif text-lg italic">Rustic</div>
                          <div className="text-xs text-[#8C7A6B] mt-1 font-serif">Romance</div>
                       </div>
                       <h4 className="font-bold text-slate-900">Rustic</h4>
                     </button>
                   </div>
                 ) : (
                   <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl text-center">
                     <p className="text-indigo-800 font-bold mb-1">Tema Default Diterapkan</p>
                     <p className="text-sm text-indigo-600">Template spesifik untuk {formData.eventType === 'birthday' ? 'Ulang Tahun' : 'Event Umum'} sudah diterapkan secara otomatis pada undangan Anda.</p>
                   </div>
                 )}
              </div>
            )}

          </div>
        </div>

        {/* Kanan: Live Preview (Smartphone Mockup) */}
        <div className="hidden lg:flex flex-1 bg-slate-100 items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
          
          <div className="relative w-[360px] h-[720px] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800 z-10 shrink-0">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20"></div>
             
             {/* Layar Undangan */}
             <div className="w-full h-full bg-white rounded-[2rem] overflow-y-auto custom-scrollbar relative flex flex-col pointer-events-none origin-top">
                <div className="scale-[0.8] origin-top w-[125%] h-[125%] relative -left-[12.5%]">
                  {formData.eventType === "wedding" ? (
                    <>
                      {formData.theme === 'elegant' && <ElegantWedding data={previewData} />}
                      {formData.theme === 'minimalist' && <MinimalistWedding data={previewData} />}
                      {formData.theme === 'rustic' && <RusticWedding data={previewData} />}
                      {!['elegant', 'minimalist', 'rustic'].includes(formData.theme) && <ElegantWedding data={previewData} />}
                    </>
                  ) : formData.eventType === "birthday" ? (
                    <FunBirthday data={previewData} />
                  ) : (
                    <ModernEvent data={previewData} />
                  )}
                </div>
             </div>
          </div>

          <div className="absolute bottom-8 right-8 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md text-slate-500 text-sm font-medium">
             <Smartphone className="w-4 h-4" /> Real-time Preview
          </div>
        </div>
      </div>
    </div>
  );
}
