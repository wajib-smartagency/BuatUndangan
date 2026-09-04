"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Music, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { WeddingData, BirthdayData, CorporateEventData, RsvpProps } from "@/types/invitation";
import ElegantWedding from "@/components/templates/wedding/ElegantWedding";
import MinimalistWedding from "@/components/templates/wedding/MinimalistWedding";
import RusticWedding from "@/components/templates/wedding/RusticWedding";
import CinematicWedding from "@/components/templates/wedding/CinematicWedding";
import FunBirthday from "@/components/templates/birthday/FunBirthday";
import ModernEvent from "@/components/templates/general/ModernEvent";

function InvitationContent() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const guestToken = searchParams.get("to");

  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // RSVP State
  const [rsvpForm, setRsvpForm] = useState({ name: "", status: "hadir", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Project & Guest Data
  const [project, setProject] = useState<any>(null);
  const [guest, setGuest] = useState<any>(null);
  const [rsvpsList, setRsvpsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio Autoplay Blocked:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: projData, error: projErr } = await supabase
          .from("projects")
          .select("*")
          .eq("slug", slug)
          .single();
        
        if (projErr) throw projErr;
        setProject(projData);

        if (guestToken) {
          const { data: guestData } = await supabase
            .from("guests")
            .select("*")
            .eq("project_id", projData.id)
            .or(`unique_token.eq.${guestToken},name.ilike.${guestToken}`)
            .limit(1)
            .single();
          
          if (guestData) {
            setGuest(guestData);
            setRsvpForm(prev => ({ ...prev, name: guestData.name }));

            const { data: existingRsvp } = await supabase
              .from('rsvps')
              .select('*')
              .eq('guest_id', guestData.id)
              .single();
            
            if (existingRsvp) {
              setHasSubmitted(true);
            }
          } else {
            setRsvpForm(prev => ({ ...prev, name: guestToken }));
          }
        }

        const { data: rsvpsData } = await supabase
          .from("rsvps")
          .select("*, guests(name)")
          .eq("project_id", projData.id)
          .order("created_at", { ascending: false });

        if (rsvpsData) setRsvpsList(rsvpsData);

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug, guestToken]);

  const handleOpen = () => {
    setIsOpened(true);
    setIsPlaying(true);
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let guestId = guest?.id;
      
      if (!guestId) {
        const uniqueToken = Math.random().toString(36).substring(2, 10);
        const { data: newGuest, error: guestError } = await supabase
          .from('guests')
          .insert([
            { project_id: project.id, name: rsvpForm.name, unique_token: uniqueToken }
          ])
          .select()
          .single();
          
        if (guestError) throw guestError;
        guestId = newGuest.id;
      } else {
        if (rsvpForm.name !== guest.name) {
           await supabase.from('guests').update({ name: rsvpForm.name }).eq('id', guestId);
        }
      }

      const { error: rsvpError } = await supabase.from('rsvps').insert([
        {
          project_id: project.id,
          guest_id: guestId,
          status: rsvpForm.status,
          message: rsvpForm.message
        }
      ]);
      
      if (rsvpError) throw rsvpError;
      setHasSubmitted(true);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      alert("Gagal mengirim RSVP. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-amber-900 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Undangan tidak ditemukan.</div>;
  }

  const rsvpProps: RsvpProps = {
    name: rsvpForm.name,
    status: rsvpForm.status,
    message: rsvpForm.message,
    isSubmitting,
    hasSubmitted,
    onNameChange: (val) => setRsvpForm({ ...rsvpForm, name: val }),
    onStatusChange: (val) => setRsvpForm({ ...rsvpForm, status: val }),
    onMessageChange: (val) => setRsvpForm({ ...rsvpForm, message: val }),
    onSubmit: handleRsvpSubmit,
  };

  const content = project.content || {};
  const eventType = project.event_type || "wedding";

  const weddingData: WeddingData = {
    coverImage: content?.coverImage,
    pria: {
      namaLengkap: content?.groom?.fullName || "Mempelai Pria",
      namaPanggilan: content?.groom?.nickname || "Pria",
      namaBapak: content?.groom?.parents?.split("&")[0]?.replace("Putra dari Bpk. ", "").trim() || "Bapak",
      namaIbu: content?.groom?.parents?.split("&")[1]?.replace("Ibu ", "").trim() || "Ibu",
      instagram: content?.groom?.ig?.replace("@", "") || "",
      foto: content?.groom?.photo,
    },
    wanita: {
      namaLengkap: content?.bride?.fullName || "Mempelai Wanita",
      namaPanggilan: content?.bride?.nickname || "Wanita",
      namaBapak: content?.bride?.parents?.split("&")[0]?.replace("Putri dari Bpk. ", "").trim() || "Bapak",
      namaIbu: content?.bride?.parents?.split("&")[1]?.replace("Ibu ", "").trim() || "Ibu",
      instagram: content?.bride?.ig?.replace("@", "") || "",
      foto: content?.bride?.photo,
    },
    acaraAkad: {
      nama: content?.events?.[0]?.type || "Akad Nikah",
      tanggal: content?.events?.[0]?.date || new Date().toISOString(),
      waktuMulai: content?.events?.[0]?.startTime || "08:00",
      waktuSelesai: content?.events?.[0]?.endTime || "10:00",
      lokasi: content?.events?.[0]?.venue || "Lokasi Akad",
      alamatLengkap: content?.events?.[0]?.address || "Alamat Akad",
      linkGoogleMaps: content?.events?.[0]?.mapsUrl,
    },
    acaraResepsi: {
      nama: content?.events?.[1]?.type || "Resepsi",
      tanggal: content?.events?.[1]?.date || new Date().toISOString(),
      waktuMulai: content?.events?.[1]?.startTime || "11:00",
      waktuSelesai: content?.events?.[1]?.endTime || "13:00",
      lokasi: content?.events?.[1]?.venue || "Lokasi Resepsi",
      alamatLengkap: content?.events?.[1]?.address || "Alamat Resepsi",
      linkGoogleMaps: content?.events?.[1]?.mapsUrl,
    },
    kutipan: content?.greeting || "Dengan memohon rahmat dan ridho Allah SWT...",
    sumberKutipan: "",
    galeri: content?.gallery || [],
    rekening: content?.gifts?.map((g: any) => ({
      namaBank: g.bank,
      noRekening: g.accNumber,
      atasNama: g.accName
    })) || [],
    tema: content?.theme || "elegant"
  };

  const birthdayData: BirthdayData = {
    profil: {
      namaLengkap: content?.birthday?.fullName || "Nama Lengkap",
      namaPanggilan: content?.birthday?.nickname || "Panggilan",
      umur: content?.birthday?.age || "17",
      foto: content?.birthday?.photo,
      dresscode: content?.birthday?.dresscode,
    },
    acara: {
      nama: content?.events?.[0]?.type || "Acara Ulang Tahun",
      tanggal: content?.events?.[0]?.date || new Date().toISOString(),
      waktuMulai: content?.events?.[0]?.startTime || "08:00",
      waktuSelesai: content?.events?.[0]?.endTime || "12:00",
      lokasi: content?.events?.[0]?.venue || "Lokasi",
      alamatLengkap: content?.events?.[0]?.address || "Alamat",
      linkGoogleMaps: content?.events?.[0]?.mapsUrl,
    },
    kutipan: content?.greeting || "Let's celebrate!",
    sumberKutipan: "",
    galeri: content?.gallery || [],
    rekening: content?.gifts?.map((g: any) => ({
      namaBank: g.bank,
      noRekening: g.accNumber,
      atasNama: g.accName
    })) || [],
    tema: content?.theme || "elegant",
    coverImage: content?.coverImage,
    audioMusik: content?.musicUrl
  };

  const eventData: CorporateEventData = {
    penyelenggara: {
      namaEvent: content?.eventDetail?.eventName || "Event Umum",
      namaPenyelenggara: content?.eventDetail?.hostName || "Penyelenggara",
      deskripsi: content?.eventDetail?.description || "",
      logo: content?.eventDetail?.logo,
    },
    acara: {
      nama: content?.events?.[0]?.type || "Detail Acara",
      tanggal: content?.events?.[0]?.date || new Date().toISOString(),
      waktuMulai: content?.events?.[0]?.startTime || "08:00",
      waktuSelesai: content?.events?.[0]?.endTime || "12:00",
      lokasi: content?.events?.[0]?.venue || "Lokasi",
      alamatLengkap: content?.events?.[0]?.address || "Alamat",
      linkGoogleMaps: content?.events?.[0]?.mapsUrl,
    },
    kutipan: content?.greeting || "Kami mengundang Anda untuk hadir.",
    sumberKutipan: "",
    galeri: content?.gallery || [],
    tema: content?.theme || "elegant",
    coverImage: content?.coverImage,
    audioMusik: content?.musicUrl
  };

  const selectedTheme = content?.theme || "elegant";

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-800 selection:bg-amber-100">
      
      {/* Cover / Welcome Screen */}
      <div className={`fixed inset-0 z-50 bg-slate-50 flex flex-col items-center justify-center transition-transform duration-1000 ${isOpened ? '-translate-y-full' : 'translate-y-0'}`}>
         <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-orange-50"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
         
         <div className="relative z-10 text-center px-6 max-w-md w-full">
           <p className="text-xs tracking-widest text-slate-500 uppercase font-sans mb-8">
             {eventType === "wedding" ? "The Wedding Of" : eventType === "birthday" ? "You're Invited to Birthday Party" : "Event Invitation"}
           </p>
           <div className="w-40 h-40 mx-auto rounded-full bg-slate-200 mb-8 border-4 border-white shadow-xl overflow-hidden">
             <img src={content?.coverImage || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80"} alt="Cover" className="w-full h-full object-cover opacity-90" />
           </div>
           <h1 className="text-5xl font-serif font-bold text-amber-900 leading-none mb-3">
             {eventType === "wedding" 
               ? `${weddingData.pria.namaPanggilan} & ${weddingData.wanita.namaPanggilan}`
               : eventType === "birthday"
               ? `${birthdayData.profil.namaPanggilan}'s ${birthdayData.profil.umur}th`
               : eventData.penyelenggara.namaEvent
             }
           </h1>
           <p className="text-sm text-slate-600 font-medium uppercase tracking-widest bg-white/50 backdrop-blur-sm py-2 rounded-full w-max mx-auto px-6 border border-amber-100 mb-12">
             {new Date(
               eventType === "wedding" ? weddingData.acaraAkad.tanggal : 
               eventType === "birthday" ? birthdayData.acara.tanggal : 
               eventData.acara.tanggal
             ).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'})}
           </p>

           <div className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white shadow-sm mb-8">
             <p className="text-xs text-slate-500 mb-1">Kepada Yth.</p>
             <p className="font-bold text-slate-800">{guest?.name || "Tamu Undangan"}</p>
           </div>

           <button 
            onClick={handleOpen}
            className="w-full bg-slate-900 text-white py-4 rounded-full font-bold shadow-lg hover:bg-slate-800 transition-all hover:-translate-y-1"
           >
             Buka Undangan
           </button>
         </div>
      </div>

      {/* Main Content */}
      <div className={`mx-auto bg-white min-h-screen relative overflow-hidden ${!isOpened ? 'h-screen overflow-hidden' : ''}`}>
         
         {/* Hidden Audio Element */}
         {content?.musicUrl && (
           <audio ref={audioRef} src={content.musicUrl} loop playsInline preload="auto" />
         )}

         {/* Floating Music Button */}
         {isOpened && content?.musicUrl && (
           <button 
             onClick={() => setIsPlaying(!isPlaying)}
             className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
           >
             <Music className={`w-5 h-5 ${isPlaying ? 'animate-spin-slow' : ''}`} />
           </button>
         )}

         <div className="relative z-0">
            {eventType === "wedding" && (
               <>
                 {selectedTheme === 'elegant' && <ElegantWedding data={weddingData} rsvp={rsvpProps} rsvpsList={rsvpsList} />}
                 {selectedTheme === 'minimalist' && <MinimalistWedding data={weddingData} rsvp={rsvpProps} rsvpsList={rsvpsList} />}
                 {selectedTheme === 'rustic' && <RusticWedding data={weddingData} rsvp={rsvpProps} rsvpsList={rsvpsList} />}
                 {selectedTheme === 'cinematic' && <CinematicWedding data={weddingData} rsvp={rsvpProps} rsvpsList={rsvpsList} />}
                 {!['elegant', 'minimalist', 'rustic', 'cinematic'].includes(selectedTheme) && <ElegantWedding data={weddingData} rsvp={rsvpProps} rsvpsList={rsvpsList} />}
               </>
            )}
            {eventType === "birthday" && (
               <FunBirthday data={birthdayData} rsvp={rsvpProps} rsvpsList={rsvpsList} />
            )}
            {eventType === "event" && (
               <ModernEvent data={eventData} rsvp={rsvpProps} rsvpsList={rsvpsList} />
            )}
         </div>
      </div>
    </div>
  );
}

export default function InvitationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-amber-900 border-t-transparent rounded-full animate-spin"></div></div>}>
      <InvitationContent />
    </Suspense>
  );
}
