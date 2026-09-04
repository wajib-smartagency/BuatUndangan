"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Users, Sparkles, Smartphone, CheckCircle2, Heart, Calendar, Image as ImageIcon, Gift, Palette } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { WeddingData } from "@/types/invitation";
import ElegantWedding from "@/components/templates/wedding/ElegantWedding";
import MinimalistWedding from "@/components/templates/wedding/MinimalistWedding";
import RusticWedding from "@/components/templates/wedding/RusticWedding";

export default function LiveEditorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("mempelai");
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    eventType: "wedding",
    host: { name: "Budi & Friends", description: "Event Organizer", logo: "" },
    title: "Pernikahan Romeo & Juliet",
    theme: "modern",
    greeting: "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.",
    groom: {
      nickname: "Romeo",
      fullName: "Romeo Montague",
      parents: "Putra dari Bpk. Montague & Ibu Montague",
      ig: "@romeo"
    },
    bride: {
      nickname: "Juliet",
      fullName: "Juliet Capulet",
      parents: "Putri dari Bpk. Capulet & Ibu Capulet",
      ig: "@juliet"
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
    ]
  });

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

      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

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
  const previewData: WeddingData = {
    pria: {
      namaLengkap: formData.groom.fullName || "Mempelai Pria",
      namaPanggilan: formData.groom.nickname || "Pria",
      namaBapak: formData.groom.parents.split("&")[0]?.replace("Putra dari Bpk. ", "").trim() || "Bapak",
      namaIbu: formData.groom.parents.split("&")[1]?.replace("Ibu ", "").trim() || "Ibu",
      instagram: formData.groom.ig.replace("@", ""),
    },
    wanita: {
      namaLengkap: formData.bride.fullName || "Mempelai Wanita",
      namaPanggilan: formData.bride.nickname || "Wanita",
      namaBapak: formData.bride.parents.split("&")[0]?.replace("Putri dari Bpk. ", "").trim() || "Bapak",
      namaIbu: formData.bride.parents.split("&")[1]?.replace("Ibu ", "").trim() || "Ibu",
      instagram: formData.bride.ig.replace("@", ""),
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
      waktuSelesai: formData.events[1]?.endTime || "13:00",
      lokasi: formData.events[1]?.venue || "Lokasi",
      alamatLengkap: formData.events[1]?.address || "Alamat",
      linkGoogleMaps: formData.events[1]?.mapsUrl,
    },
    kutipan: formData.greeting,
    rekening: formData.gifts.map(g => ({
      namaBank: g.bank,
      noRekening: g.accNumber,
      atasNama: g.accName
    })),
    tema: formData.theme
  };

  const tabs = formData.eventType === 'wedding' ? [
    { id: "mempelai", label: "Mempelai", icon: Heart },
    { id: "acara", label: "Acara", icon: Calendar },
    { id: "hadiah", label: "Hadiah", icon: Gift },
    { id: "desain", label: "Desain", icon: Palette },
  ] : [
    { id: "host", label: "Penyelenggara", icon: Users },
    { id: "acara", label: "Acara", icon: Calendar },
    { id: "hadiah", label: "Hadiah", icon: Gift },
    { id: "desain", label: "Desain", icon: Palette },
  ];

  
  if (step === 1) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] bg-slate-50 -m-4 sm:-m-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Pilih Jenis Proyek</h2>
        <p className="text-slate-500 mb-10">Pilih kategori undangan yang ingin Anda buat.</p>
        <div className="flex flex-col sm:flex-row gap-6">
          <button onClick={() => { setFormData({...formData, eventType: 'wedding', title: 'Pernikahan Baru'}); setActiveTab('mempelai'); setStep(2); }} className="w-64 p-8 bg-white border-2 border-indigo-100 hover:border-indigo-600 rounded-3xl text-center group transition-all hover:shadow-xl">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💍</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Pernikahan</h3>
            <p className="text-sm text-slate-500">Undangan resepsi & akad nikah.</p>
          </button>
          <button onClick={() => { setFormData({...formData, eventType: 'event', title: 'Acara Baru', greeting: 'Kami mengundang Anda untuk hadir dalam acara kami.'}); setActiveTab('host'); setStep(2); }} className="w-64 p-8 bg-white border-2 border-indigo-100 hover:border-indigo-600 rounded-3xl text-center group transition-all hover:shadow-xl">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎉</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Acara Umum</h3>
            <p className="text-sm text-slate-500">Ulang tahun, seminar, reuni, dll.</p>
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col -m-4 sm:-m-8">
      {/* Topbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/projects" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="font-bold text-slate-900 leading-tight bg-transparent focus:outline-none focus:ring-0 border-none p-0 h-auto"
            />
            <p className="text-xs text-slate-500">url: /{formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {success && (
             <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4" /> Tersimpan
             </span>
          )}
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-70 shadow-sm"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Proyek
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Kiri: Form Editor dengan Tabs */}
        <div className="w-full lg:w-[45%] xl:w-[40%] bg-white border-r border-slate-200 flex flex-col h-full">
          
          {/* Tabs Nav */}
          <div className="flex border-b border-slate-200 shrink-0 overflow-x-auto no-scrollbar">
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
            
            
            {activeTab === "host" && (
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
                  <h3 className="font-bold text-indigo-900 flex items-center gap-2"><span className="text-xl">🎉</span> Penyelenggara Acara</h3>
                  <div>
                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Nama Penyelenggara / Host</label>
                    <input type="text" value={formData.host.name} onChange={e => setFormData({...formData, host: {...formData.host, name: e.target.value}})} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Deskripsi Singkat</label>
                    <input type="text" value={formData.host.description} onChange={e => setFormData({...formData, host: {...formData.host, description: e.target.value}})} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
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
                      <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Nama Instagram</label>
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
                </div>

                <div className="space-y-4 p-5 bg-pink-50/50 border border-pink-100 rounded-2xl">
                  <h3 className="font-bold text-pink-900 flex items-center gap-2"><span className="text-xl">👰</span> Mempelai Wanita</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Nama Panggilan</label>
                      <input type="text" name="nickname" value={formData.bride.nickname} onChange={handleBrideChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Nama Instagram</label>
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
                </div>
              </div>
            )}

            {activeTab === "acara" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {formData.events.map((ev, idx) => (
                  <div key={ev.id} className="p-5 border border-slate-200 rounded-2xl space-y-4 relative">
                    <div className="absolute top-0 right-0 bg-slate-100 px-3 py-1 text-xs font-bold rounded-bl-lg rounded-tr-xl text-slate-500">
                      Acara {idx + 1}
                    </div>
                    <h3 className="font-bold text-slate-900 border-b pb-2">{ev.type}</h3>
                    
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
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 py-6">
                 <div className="text-center mb-8">
                   <Palette className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
                   <h3 className="text-xl font-bold text-slate-900">Tema Visual</h3>
                   <p className="text-slate-500 text-sm">Pilih tema desain undangan untuk acara Anda.</p>
                 </div>
                 
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
                {formData.eventType === 'wedding' ? (
                   <div className="scale-[0.8] origin-top w-[125%] h-[125%] relative -left-[12.5%]">
                     {formData.theme === 'elegant' && <ElegantWedding data={previewData} />}
                     {formData.theme === 'minimalist' && <MinimalistWedding data={previewData} />}
                     {formData.theme === 'rustic' && <RusticWedding data={previewData} />}
                     {!['elegant', 'minimalist', 'rustic'].includes(formData.theme) && <ElegantWedding data={previewData} />}
                   </div>
                ) : (
                   <div className="p-8 text-center mt-20 text-slate-500 font-sans">
                     <div className="text-4xl mb-4">🎉</div>
                     <h3 className="font-bold text-lg mb-2">Acara Umum</h3>
                     <p className="text-sm">Preview untuk template Acara Umum belum tersedia saat ini.</p>
                   </div>
                )}
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
