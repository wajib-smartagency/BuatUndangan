"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Users, MessageSquareHeart, Send, Download, Plus, Search, 
  ArrowLeft, ExternalLink, Edit, CheckCircle2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProjectManagementPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [guests, setGuests] = useState<any[]>([]);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("guests");
  const [search, setSearch] = useState("");

  const [newGuestName, setNewGuestName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      const { data: pData, error: pError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      if (pError) throw pError;
      setProject(pData);

      const { data: gData, error: gError } = await supabase
        .from('guests')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      if (gError) throw gError;
      setGuests(gData || []);

      const { data: rData, error: rError } = await supabase
        .from('rsvps')
        .select('*, guests(name)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      if (rError) throw rError;
      setRsvps(rData || []);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat data proyek.");
      router.push('/dashboard/projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    setIsAdding(true);
    try {
      const token = Math.random().toString(36).substring(2, 10);
      const { data, error } = await supabase.from('guests').insert([{
        project_id: projectId,
        name: newGuestName,
        unique_token: token
      }]).select().single();
      if (error) throw error;
      setGuests([data, ...guests]);
      setNewGuestName("");
    } catch (err) {
      console.error(err);
      alert("Gagal menambah tamu");
    } finally {
      setIsAdding(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Link disalin!");
  };

  const handleBlastWa = async (guest: any) => {
    const guestNameParam = encodeURIComponent(guest.name);
    const link = `${window.location.origin}/${project.slug}?to=${guestNameParam}`;
    const text = `Kepada Yth. ${guest.name},\n\nTanpa mengurangi rasa hormat, kami bermaksud mengundang Anda untuk menghadiri acara pernikahan kami.\n\nDetail undangan dapat dilihat melalui tautan berikut:\n${link}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.\n\nTerima kasih.`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    
    // update blast status
    await supabase.from('guests').update({ is_blast_sent: true }).eq('id', guest.id);
    setGuests(guests.map(g => g.id === guest.id ? { ...g, is_blast_sent: true } : g));
  };

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const filteredGuests = guests.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/projects" className="text-slate-400 hover:text-slate-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="text-sm font-medium text-slate-500">Kembali ke Proyek</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
          <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
             <a href={`/${project.slug}`} target="_blank" className="text-indigo-600 hover:underline flex items-center gap-1">
               {window.location.host}/{project.slug} <ExternalLink className="w-3 h-3" />
             </a>
          </p>
        </div>
        <div className="flex gap-2">
           <Link href={`/dashboard/projects/${projectId}/edit`} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-slate-50">
             <Edit className="w-4 h-4" /> Edit Desain
           </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
             <Users className="w-6 h-6" />
           </div>
           <div>
             <p className="text-sm text-slate-500 font-medium">Total Tamu</p>
             <p className="text-2xl font-bold text-slate-900">{guests.length}</p>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
             <Send className="w-6 h-6" />
           </div>
           <div>
             <p className="text-sm text-slate-500 font-medium">Telah Diundang</p>
             <p className="text-2xl font-bold text-slate-900">{guests.filter(g => g.is_blast_sent).length}</p>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
             <MessageSquareHeart className="w-6 h-6" />
           </div>
           <div>
             <p className="text-sm text-slate-500 font-medium">RSVP Masuk</p>
             <p className="text-2xl font-bold text-slate-900">{rsvps.length}</p>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
             <Users className="w-6 h-6" />
           </div>
           <div>
             <p className="text-sm text-slate-500 font-medium">RSVP Hadir</p>
             <p className="text-2xl font-bold text-slate-900">{rsvps.filter(r => r.status === 'Hadir' || r.status === 'hadir').length}</p>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button 
            onClick={() => setActiveTab('guests')}
            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'guests' ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Daftar Tamu
          </button>
          <button 
            onClick={() => setActiveTab('rsvps')}
            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'rsvps' ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Log RSVP & Ucapan
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'guests' ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                 <form onSubmit={handleAddGuest} className="flex flex-1 max-w-md gap-2">
                   <input type="text" value={newGuestName} onChange={(e) => setNewGuestName(e.target.value)} placeholder="Nama Tamu Baru..." className="flex-1 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                   <button disabled={isAdding} type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-70 flex items-center gap-2">
                     <Plus className="w-4 h-4" /> {isAdding ? 'Loading' : 'Tambah'}
                   </button>
                 </form>
                 
                 <div className="relative">
                   <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                   <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama tamu..." className="w-full md:w-64 bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                 </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-500 bg-slate-50 border-y border-slate-200 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 font-bold">Nama Tamu</th>
                      <th className="px-4 py-3 font-bold">Status Blast</th>
                      <th className="px-4 py-3 font-bold">Link Unik</th>
                      <th className="px-4 py-3 font-bold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredGuests.map(g => (
                      <tr key={g.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-900">{g.name}</td>
                        <td className="px-4 py-3">
                          {g.is_blast_sent ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full text-xs font-medium">
                              <CheckCircle2 className="w-3 h-3" /> Terkirim
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 px-2 py-1 rounded-full text-xs font-medium">
                              Belum Dikirim
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                          {window.location.host}/{project.slug}?to={encodeURIComponent(g.name)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button onClick={() => copyToClipboard(`${window.location.origin}/${project.slug}?to=${encodeURIComponent(g.name)}`)} className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                               Copy Link
                             </button>
                             <button onClick={() => handleBlastWa(g)} className="text-white bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                               <Send className="w-3 h-3" /> WA
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredGuests.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500">Belum ada data tamu.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Rekap RSVP Masuk</h3>
                <button className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {rsvps.map(r => {
                  const guestName = Array.isArray(r.guests) ? r.guests[0]?.name : (r.guests as any)?.name;
                  return (
                  <div key={r.id} className="p-4 border border-slate-200 rounded-xl flex flex-col gap-2 bg-slate-50">
                     <div className="flex items-start justify-between">
                       <div>
                         <span className="font-bold text-slate-900">{guestName || 'Tamu'}</span>
                         <p className="text-xs text-slate-400 mt-1">{new Date(r.created_at).toLocaleString('id-ID')}</p>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                         r.status.toLowerCase() === 'hadir' ? 'bg-emerald-100 text-emerald-700' :
                         r.status.toLowerCase() === 'tidak hadir' ? 'bg-rose-100 text-rose-700' :
                         'bg-slate-200 text-slate-700'
                       }`}>
                         {r.status}
                       </span>
                     </div>
                     {r.message && (
                       <div className="mt-2 bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-600 italic">
                         "{r.message}"
                       </div>
                     )}
                  </div>
                )})}
                {rsvps.length === 0 && (
                  <div className="col-span-2 py-8 text-center text-slate-500">Belum ada RSVP masuk.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
