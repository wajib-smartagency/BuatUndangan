const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/projects/new/page.tsx', 'utf-8');

// 1. Update initial state
const statePattern = /const \[formData, setFormData\] = useState\(\{([\s\S]*?)events: \[\] as any\[\],/m;
const newState = `const [formData, setFormData] = useState({
    eventType: "wedding",
    host: { name: "Penyelenggara", description: "Acara Ulang Tahun", photo: "" },
    birthday: { nickname: "", fullName: "", age: "", photo: "", dresscode: "" },
    eventDetail: { eventName: "", hostName: "", description: "", logo: "" },
    title: "Pernikahan Romeo & Juliet",
    slug: "pernikahan-romeo-juliet",
    theme: "elegant",
    coverImage: "",
    greeting: "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.",
    groom: { nickname: "", fullName: "", parents: "", ig: "", photo: "" },
    bride: { nickname: "", fullName: "", parents: "", ig: "", photo: "" },
    events: [] as any[],`;
content = content.replace(statePattern, newState);

// 2. Update handleImageUpload to handle birthday and eventDetail
const imageUploadTarget = `} else if (pathName === 'host') {
        setFormData(prev => ({ ...prev, host: { ...prev.host, photo: publicUrl } }));
      }`;
const newImageUpload = `} else if (pathName === 'host') {
        setFormData(prev => ({ ...prev, host: { ...prev.host, photo: publicUrl } }));
      } else if (pathName === 'birthdayPhoto') {
        setFormData(prev => ({ ...prev, birthday: { ...prev.birthday, photo: publicUrl } }));
      } else if (pathName === 'eventLogo') {
        setFormData(prev => ({ ...prev, eventDetail: { ...prev.eventDetail, logo: publicUrl } }));
      }`;
content = content.replace(imageUploadTarget, newImageUpload);

// 3. Update previewData adapter
const previewAdapterTarget = /\/\/ Adapter untuk preview([\s\S]*?)const tabs = formData\.eventType/m;
const newPreviewAdapter = `// Adapter untuk preview
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
    profilUltah: {
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
`;
content = content.replace(previewAdapterTarget, newPreviewAdapter);

// 4. Update Tabs Definition
const tabsTarget = /const tabs = formData\.eventType === "wedding"([\s\S]*?)\];/m;
const newTabs = `const tabs = formData.eventType === "wedding" 
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
      ];`;
content = content.replace(tabsTarget, newTabs);

// 5. Update Step 1 Options
const step1Target = /<div className="flex flex-col sm:flex-row gap-6">([\s\S]*?)<\/div>[\s]*<\/div>[\s]*\);[\s]*}/m;
const newStep1 = `<div className="flex flex-col md:flex-row flex-wrap justify-center gap-6">
          <button onClick={() => { setFormData({...formData, eventType: 'wedding', title: 'Pernikahan Baru'}); setActiveTab('mempelai'); setStep(2); }} className="w-64 p-8 bg-white border-2 border-indigo-100 hover:border-indigo-600 rounded-3xl text-center group transition-all hover:shadow-xl">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💍</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Pernikahan</h3>
            <p className="text-sm text-slate-500">Undangan resepsi & akad nikah.</p>
          </button>
          <button onClick={() => { setFormData({...formData, eventType: 'birthday', title: 'Ulang Tahun Baru', greeting: 'Let\\'s celebrate! Aku mengundang kalian untuk hadir di hari bahagiaku.', events: [{ id: '1', type: 'Detail Acara', date: '', startTime: '', endTime: '', venue: '', address: '', mapsUrl: '' }]}); setActiveTab('profilUltah'); setStep(2); }} className="w-64 p-8 bg-white border-2 border-indigo-100 hover:border-indigo-600 rounded-3xl text-center group transition-all hover:shadow-xl">
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
  }`;
content = content.replace(step1Target, newStep1);

// 6. Update Form Content rendering
const formContentTarget = /\{activeTab === "host" && \([\s\S]*?\{activeTab === "mempelai"/m;
const newFormContent = `{activeTab === "profilUltah" && (
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
  
            {activeTab === "mempelai"`;
content = content.replace(formContentTarget, newFormContent);

fs.writeFileSync('src/app/dashboard/projects/new/page.tsx', content, 'utf-8');
