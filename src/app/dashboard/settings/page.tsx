"use client";

import React, { useEffect, useState } from "react";
import { User, Mail, CreditCard, Shield, Save, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [profile, setProfile] = useState({
    full_name: "",
    role: "personal",
    plan_status: "active"
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        if (data) setProfile(data);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({ full_name: profile.full_name })
        .eq("id", user.id);

      if (error) throw error;
      alert("Profil berhasil diperbarui!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Gagal memperbarui profil.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
        <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
        <div className="h-64 bg-slate-200 rounded-2xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan Akun</h1>
        <p className="text-slate-500">Kelola informasi profil, email, dan paket langganan Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigasi Kiri */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 font-medium rounded-xl transition-colors text-left">
            <User className="w-5 h-5" /> Profil Saya
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 font-medium rounded-xl transition-colors text-left">
            <CreditCard className="w-5 h-5" /> Langganan
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 font-medium rounded-xl transition-colors text-left">
            <Shield className="w-5 h-5" /> Keamanan
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 mt-8 text-red-600 hover:bg-red-50 font-medium rounded-xl transition-colors text-left"
          >
            <LogOut className="w-5 h-5" /> Keluar (Logout)
          </button>
        </div>

        {/* Konten Kanan */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Informasi Pribadi</h2>
            
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Alamat Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Email tidak dapat diubah karena terikat dengan akun Anda.</p>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold transition-all disabled:opacity-70"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Save className="w-5 h-5" /> Simpan Perubahan</>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Paket & Langganan</h2>
            <div className="mt-4 p-4 border border-indigo-100 bg-indigo-50 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-indigo-900 uppercase">{profile.role === 'pro' ? 'Paket Pro' : 'Paket Personal'}</p>
                <p className="text-sm text-indigo-700 mt-1">Status: <span className="font-semibold capitalize">{profile.plan_status}</span></p>
              </div>
              <button className="bg-white text-indigo-600 px-4 py-2 text-sm font-bold rounded-lg shadow-sm border border-indigo-100 hover:bg-indigo-50">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
