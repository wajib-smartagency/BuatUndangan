"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, Smartphone, CheckCircle2, Heart, Calendar, Image as ImageIcon, Gift, Palette } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";

export default function EditLiveEditorPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("mempelai");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    theme: "modern",
    greeting: "",
    groom: { nickname: "", fullName: "", parents: "", ig: "" },
    bride: { nickname: "", fullName: "", parents: "", ig: "" },
    events: [] as any[],
    gifts: [] as any[]
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single();
        if (error) throw error;
        if (data && data.content) {
          setFormData({
            title: data.content.title || "",
            theme: data.content.theme || "modern",
            greeting: data.content.greeting || "",
            groom: data.content.groom || { nickname: "", fullName: "", parents: "", ig: "" },
            bride: data.content.bride || { nickname: "", fullName: "", parents: "", ig: "" },
            events: Array.isArray(data.content.events) ? data.content.events : [{ id: '1', type: 'Akad Nikah', date: '', startTime: '', endTime: '', venue: '', address: '', mapsUrl: '' }],
            gifts: Array.isArray(data.content.gifts) ? data.content.gifts : []
          });
        } else if (data) {
          setFormData(prev => ({...prev, title: data.title}));
        }
      } catch (err) {
        console.error(err);
        alert("Gagal memuat proyek.");
        router.push('/dashboard/projects');
      } finally {
        setIsFetching(false);
      }
    };
    if (projectId) fetchProject();
  }, [projectId, router]);

  const handleGroomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, groom: { ...formData.groom, [e.target.name]: e.target.value } });
  };

  const handleBrideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, bride: { ...formData.bride, [e.target.name]: e.target.value } });
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

      const { error } = await supabase.from('projects').update({ 
        title: formData.title,
        event_date: formData.events[0]?.date || null,
        slug: slug,
        is_published: true,
        content: formData
      }).eq('id', projectId);
      
      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push(`/dashboard/projects/${projectId}`);
      }, 2000);
    } catch (error: any) {
      console.error("Error saving project:", error);
      alert(error.message || "Gagal menyimpan proyek.");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "mempelai", label: "Mempelai", icon: Heart },
    { id: "acara", label: "Acara", icon: Calendar },
    { id: "hadiah", label: "Hadiah", icon: Gift },
    { id: "desain", label: "Desain", icon: Palette },
  ];

  if (isFetching) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  // The rest is identical to the render block from `new/page.tsx`
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col -m-4 sm:-m-8">
      {/* Topbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/projects/${projectId}`} className="text-slate-400 hover:text-slate-600 transition-colors">
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
            Simpan Perubahan
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
            
            {activeTab === "mempelai" && (
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
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-center py-12">
                 <Palette className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                 <h3 className="text-lg font-bold text-slate-900">Tema Visual</h3>
                 <p className="text-slate-500 text-sm max-w-xs mx-auto">Fitur pemilihan tema (Floral, Elegan, Minimalis) dan kustomisasi warna akan tersedia di update berikutnya.</p>
                 <div className="mt-8 flex justify-center gap-4">
                   <div className="w-16 h-16 rounded-full bg-rose-100 ring-4 ring-rose-500 ring-offset-2"></div>
                   <div className="w-16 h-16 rounded-full bg-slate-800"></div>
                   <div className="w-16 h-16 rounded-full bg-emerald-100"></div>
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
             <div className="w-full h-full bg-white rounded-[2rem] overflow-y-auto custom-scrollbar relative flex flex-col font-serif">
                
                {/* Hero Section */}
                <div className="relative min-h-[60%] w-full bg-slate-200 flex flex-col items-center justify-center overflow-hidden pt-8">
                   <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-orange-50"></div>
                   <div className="relative z-10 text-center px-4 w-full">
                     <p className="text-[10px] tracking-widest text-slate-500 uppercase font-sans mb-4">The Wedding Of</p>
                     <h2 className="text-4xl font-bold text-amber-900 leading-none mb-2">
                       {formData.groom.nickname}
                     </h2>
                     <h2 className="text-3xl text-amber-700 leading-none mb-2">&</h2>
                     <h2 className="text-4xl font-bold text-amber-900 leading-none mb-6">
                       {formData.bride.nickname}
                     </h2>
                     {formData.events[0]?.date && (
                       <p className="text-xs text-slate-600 font-sans font-medium uppercase tracking-widest bg-white/50 backdrop-blur-sm py-2 rounded-full w-max mx-auto px-6 border border-amber-100">
                         {new Date(formData.events[0].date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'})}
                       </p>
                     )}
                   </div>
                </div>

                {/* Profile Section */}
                <div className="py-10 px-6 text-center bg-white">
                   <p className="text-xs text-slate-500 font-sans leading-relaxed mb-8">
                     {formData.greeting}
                   </p>
                   
                   <div className="space-y-8">
                     {/* Groom */}
                     <div>
                       <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-3 border-2 border-amber-200 overflow-hidden">
                         <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80" alt="Groom" className="w-full h-full object-cover opacity-80" />
                       </div>
                       <h3 className="font-bold text-lg text-slate-800">{formData.groom.fullName}</h3>
                       <p className="text-[10px] text-slate-500 font-sans mt-1">{formData.groom.parents}</p>
                       <p className="text-[10px] text-indigo-500 font-sans mt-1">{formData.groom.ig}</p>
                     </div>

                     <div className="text-2xl text-amber-300">♥</div>

                     {/* Bride */}
                     <div>
                       <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-3 border-2 border-amber-200 overflow-hidden">
                         <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80" alt="Bride" className="w-full h-full object-cover opacity-80" />
                       </div>
                       <h3 className="font-bold text-lg text-slate-800">{formData.bride.fullName}</h3>
                       <p className="text-[10px] text-slate-500 font-sans mt-1">{formData.bride.parents}</p>
                       <p className="text-[10px] text-indigo-500 font-sans mt-1">{formData.bride.ig}</p>
                     </div>
                   </div>
                </div>

                {/* Events Section */}
                <div className="py-10 px-6 bg-amber-50 border-t border-amber-100">
                  <h3 className="text-center font-bold text-xl text-amber-900 mb-6">Acara Pernikahan</h3>
                  <div className="space-y-6">
                    {formData.events.map(ev => (
                      <div key={ev.id} className="bg-white p-5 rounded-2xl border border-amber-200 text-center shadow-sm">
                        <h4 className="font-bold text-amber-800 mb-2">{ev.type}</h4>
                        {ev.date && (
                          <div className="text-xs font-sans text-slate-600 space-y-1 mb-4">
                            <p className="font-bold">{new Date(ev.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}</p>
                            <p>{ev.startTime} - {ev.endTime}</p>
                          </div>
                        )}
                        <div className="text-xs font-sans text-slate-500 mb-4">
                          <p className="font-bold text-slate-700">{ev.venue}</p>
                          <p>{ev.address}</p>
                        </div>
                        <button className="text-[10px] uppercase tracking-wider bg-slate-900 text-white px-4 py-2 rounded-full font-sans font-bold w-full">
                          Buka Google Maps
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gift Section */}
                <div className="py-10 px-6 bg-white border-t border-slate-100 text-center pb-24">
                  <h3 className="font-bold text-xl text-slate-800 mb-3">Wedding Gift</h3>
                  <p className="text-xs text-slate-500 font-sans mb-6">Tanpa mengurangi rasa hormat, bagi Anda yang ingin memberikan tanda kasih dapat melalui:</p>
                  
                  {formData.gifts.map(gf => (
                    <div key={gf.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-3">
                      <p className="font-bold text-slate-700 text-sm">{gf.bank}</p>
                      <p className="font-mono text-lg text-slate-900 my-1">{gf.accNumber}</p>
                      <p className="text-xs text-slate-500 uppercase">{gf.accName}</p>
                    </div>
                  ))}
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
