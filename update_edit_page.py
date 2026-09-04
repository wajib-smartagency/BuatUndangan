import re

with open('new_page_copy.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the useParams import
content = content.replace('import { useRouter } from "next/navigation";', 'import { useRouter, useParams } from "next/navigation";')

# Replace export default function LiveEditorPage()
content = content.replace('export default function LiveEditorPage() {', 'export default function EditLiveEditorPage() {')

# We need to add useEffect to fetch data.
# Find the end of state declarations
state_end = content.find('const handleImageUpload')

fetch_code = '''
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
            slug: data.slug || ""
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
'''

content = content[:state_end] + fetch_code + content[state_end:]

# Replace insert with update in handleSave
insert_pattern = re.compile(r'const \{ data, error \} = await supabase\.from\(\'projects\'\)\.insert\(\[\s*\{(.*?)\}\s*\]\)\.select\(\)\.single\(\);', re.DOTALL)

update_replacement = r'''
      const { data, error } = await supabase.from('projects').update({
\1      }).eq('id', projectId).select().single();
'''
content = re.sub(insert_pattern, update_replacement, content)

content = content.replace('router.push(`/dashboard/projects/${data.id}`);', 'router.push(`/dashboard/projects`);')
content = content.replace('Undangan Berhasil Dibuat!', 'Undangan Berhasil Disimpan!')

with open('src/app/dashboard/projects/[id]/edit/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
