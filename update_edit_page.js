const fs = require('fs');

let content = fs.readFileSync('new_page_copy.txt', 'utf-8');

// Fix the useParams import
content = content.replace('import { useRouter } from "next/navigation";', 'import { useRouter, useParams } from "next/navigation";');
content = content.replace('import React, { useState } from "react";', 'import React, { useState, useEffect } from "react";');

// Replace export default function LiveEditorPage()
content = content.replace('export default function LiveEditorPage() {', 'export default function EditLiveEditorPage() {');

// We need to add useEffect to fetch data.
// Find the end of state declarations
const state_end = content.indexOf('const handleImageUpload');

const fetch_code = `
  const [isFetching, setIsFetching] = useState(true);
  const routerParams = useParams();
  const projectId = routerParams.id as string;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single();
        if (error) throw error;
        if (data && data.content) {
          setFormData({
            eventType: data.content.eventType || data.event_type || "wedding",
            host: data.content.host || { name: "", description: "", photo: "" },
            title: data.content.title || data.title || "",
            theme: data.content.theme || "elegant",
            greeting: data.content.greeting || "",
            groom: data.content.groom || { nickname: "", fullName: "", parents: "", ig: "", photo: "" },
            bride: data.content.bride || { nickname: "", fullName: "", parents: "", ig: "", photo: "" },
            events: Array.isArray(data.content.events) ? data.content.events : [{ id: '1', type: 'Akad Nikah', date: '', startTime: '', endTime: '', venue: '', address: '', mapsUrl: '' }],
            gifts: Array.isArray(data.content.gifts) ? data.content.gifts : [],
            gallery: data.content.gallery || [],
            musicUrl: data.content.musicUrl || "",
            coverImage: data.content.coverImage || "",
            slug: data.slug || "",
            birthday: data.content.birthday || { nickname: "", fullName: "", age: "", photo: "", dresscode: "" },
            eventDetail: data.content.eventDetail || { eventName: "", hostName: "", description: "", logo: "" }
          });
          setStep(2); // Skip step 1
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
`;

content = content.substring(0, state_end) + fetch_code + content.substring(state_end);

// Replace insert with update in handleSave
const insert_pattern = /const \{ data, error \} = await supabase\.from\('projects'\)\.insert\(\[\s*\{([\s\S]*?)\}\s*\]\)\.select\(\)\.single\(\);/;
const match = content.match(insert_pattern);

if (match) {
  const update_replacement = `      const { data, error } = await supabase.from('projects').update({\n${match[1]}      }).eq('id', projectId).select().single();`;
  content = content.replace(insert_pattern, update_replacement);
}

content = content.replace('router.push(`/dashboard/projects/${data.id}`);', 'router.push(`/dashboard/projects`);');
content = content.replace('Undangan Berhasil Dibuat!', 'Undangan Berhasil Disimpan!');

// For edit page, since we skip step 1, we also don't want to show step 1 UI at all. 
// But it's fine, step state will just be 2.
// However, the loading state while fetching is important:
content = content.replace('if (step === 1) {', 'if (isFetching) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;\n  if (step === 1) {');

fs.writeFileSync('src/app/dashboard/projects/[id]/edit/page.tsx', content, 'utf-8');
