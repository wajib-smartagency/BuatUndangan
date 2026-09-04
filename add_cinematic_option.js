const fs = require('fs');

// 1. Update [slug]/page.tsx
let slugPath = 'src/app/[slug]/page.tsx';
let slugContent = fs.readFileSync(slugPath, 'utf-8');

if (!slugContent.includes('CinematicWedding')) {
  // Add import
  slugContent = slugContent.replace(
    /import RusticWedding from "@\/components\/templates\/wedding\/RusticWedding";/,
    'import RusticWedding from "@/components/templates/wedding/RusticWedding";\nimport CinematicWedding from "@/components/templates/wedding/CinematicWedding";'
  );

  // Add render
  slugContent = slugContent.replace(
    /\{selectedTheme === 'rustic' && <RusticWedding data=\{weddingData\} rsvp=\{rsvpProps\} rsvpsList=\{rsvpsList\} \/>\}/,
    `{selectedTheme === 'rustic' && <RusticWedding data={weddingData} rsvp={rsvpProps} rsvpsList={rsvpsList} />}
                 {selectedTheme === 'cinematic' && <CinematicWedding data={weddingData} rsvp={rsvpProps} rsvpsList={rsvpsList} />}`
  );
  
  // Update fallback to include cinematic
  slugContent = slugContent.replace(
    /!\['elegant', 'minimalist', 'rustic'\]\.includes/,
    `!['elegant', 'minimalist', 'rustic', 'cinematic'].includes`
  );

  fs.writeFileSync(slugPath, slugContent, 'utf-8');
}

// 2. Update new/page.tsx
let newPath = 'src/app/dashboard/projects/new/page.tsx';
let newContent = fs.readFileSync(newPath, 'utf-8');

if (!newContent.includes('CinematicWedding')) {
  // Add import
  newContent = newContent.replace(
    /import RusticWedding from "@\/components\/templates\/wedding\/RusticWedding";/,
    'import RusticWedding from "@/components/templates/wedding/RusticWedding";\nimport CinematicWedding from "@/components/templates/wedding/CinematicWedding";'
  );

  // Add render
  newContent = newContent.replace(
    /\{formData\.theme === 'rustic' && <RusticWedding data=\{previewData\} \/>\}/,
    `{formData.theme === 'rustic' && <RusticWedding data={previewData} />}
                      {formData.theme === 'cinematic' && <CinematicWedding data={previewData} />}`
  );
  
  // Update fallback to include cinematic
  newContent = newContent.replace(
    /!\['elegant', 'minimalist', 'rustic'\]\.includes/,
    `!['elegant', 'minimalist', 'rustic', 'cinematic'].includes`
  );

  // Add button option
  const rusticButtonRegex = /\{\/\*\s*Rustic\s*\*\/\}([\s\S]*?)<\/button>/;
  const rusticButtonMatch = newContent.match(rusticButtonRegex);
  
  if (rusticButtonMatch) {
    const cinematicButton = `
                     {/* Cinematic */}
                     <button 
                       onClick={() => setFormData({...formData, theme: 'cinematic'})}
                       className={\`p-4 rounded-xl border-2 text-center transition-all \${formData.theme === 'cinematic' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}\`}
                     >
                       <div className="w-full h-32 bg-[#1d2e24] border border-slate-200 rounded-lg mb-3 flex flex-col items-center justify-center p-2">
                          <div className="text-[#e6d6c6] font-serif text-lg">Cinematic</div>
                          <div className="text-xs text-[#a9834f] mt-1 font-serif tracking-widest">SCROLL</div>
                       </div>
                       <h4 className="font-bold text-slate-900">Cinematic</h4>
                     </button>`;
                     
    // Change grid-cols-3 to grid-cols-2 md:grid-cols-4
    newContent = newContent.replace(/className="grid grid-cols-1 md:grid-cols-3 gap-4"/, 'className="grid grid-cols-2 md:grid-cols-4 gap-4"');
    
    newContent = newContent.replace(rusticButtonRegex, match => match + cinematicButton);
  }

  fs.writeFileSync(newPath, newContent, 'utf-8');
}

console.log('Cinematic option added to project!');
