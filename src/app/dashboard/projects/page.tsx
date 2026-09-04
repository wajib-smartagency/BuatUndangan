"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FolderOpen, Calendar, Trash2, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus proyek ini?")) return;
    
    setIsDeleting(id);
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Gagal menghapus proyek.");
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-200 rounded-2xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Proyek Saya</h1>
          <p className="text-slate-500">Kelola semua undangan yang telah Anda buat.</p>
        </div>
        <Link 
          href="/dashboard/projects/new" 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" /> Buat Proyek Baru
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Belum ada proyek</h3>
          <p className="text-slate-500 mb-6 max-w-sm">Anda belum membuat undangan apapun. Klik tombol di bawah untuk memulai proyek pertama Anda.</p>
          <Link 
            href="/dashboard/projects/new" 
            className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-6 py-2.5 rounded-xl font-bold transition-all"
          >
            <Plus className="w-5 h-5" /> Buat Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <button 
                  onClick={() => handleDelete(project.id)}
                  disabled={isDeleting === project.id}
                  className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors disabled:opacity-50"
                  title="Hapus Proyek"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1 truncate" title={project.title}>
                {project.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-4">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(project.event_date).toLocaleDateString("id-ID")}</span>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/${project.slug}`} 
                    target="_blank"
                    className="flex-1 flex justify-center items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-200"
                  >
                    <LinkIcon className="w-4 h-4" /> Buka Web
                  </Link>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/${project.slug}`);
                      alert('Link undangan disalin!');
                    }}
                    className="flex-1 flex justify-center items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-200"
                  >
                    Copy Link
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/dashboard/projects/${project.id}`} 
                    className="flex-1 flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
                  >
                    Manajemen Tamu
                  </Link>
                  <Link 
                    href={`/dashboard/projects/${project.id}/edit`} 
                    className="flex-1 flex justify-center items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    Edit Desain
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
