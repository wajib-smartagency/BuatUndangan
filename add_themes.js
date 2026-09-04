const fs = require('fs');

// 1. Update [slug]/page.tsx
let slugPath = 'src/app/[slug]/page.tsx';
let slugContent = fs.readFileSync(slugPath, 'utf-8');

if (!slugContent.includes('EditorialWedding')) {
  // Add imports
  slugContent = slugContent.replace(
    /import CinematicWedding from "@\/components\/templates\/wedding\/CinematicWedding";/,
    'import CinematicWedding from "@/components/templates/wedding/CinematicWedding";\nimport EditorialWedding from "@/components/templates/wedding/EditorialWedding";\nimport TwilightWedding from "@/components/templates/wedding/TwilightWedding";'
  );

  // Add renders
  slugContent = slugContent.replace(
    /\{selectedTheme === 'cinematic' && <CinematicWedding data=\{weddingData\} rsvp=\{rsvpProps\} rsvpsList=\{rsvpsList\} \/>\}/,
    `{selectedTheme === 'cinematic' && <CinematicWedding data={weddingData} rsvp={rsvpProps} rsvpsList={rsvpsList} />}
                 {selectedTheme === 'editorial' && <EditorialWedding data={weddingData} rsvp={rsvpProps} rsvpsList={rsvpsList} />}
                 {selectedTheme === 'twilight' && <TwilightWedding data={weddingData} rsvp={rsvpProps} rsvpsList={rsvpsList} />}`
  );
  
  // Update fallback
  slugContent = slugContent.replace(
    /!\['elegant', 'minimalist', 'rustic', 'cinematic'\]\.includes/,
    `!['elegant', 'minimalist', 'rustic', 'cinematic', 'editorial', 'twilight'].includes`
  );

  fs.writeFileSync(slugPath, slugContent, 'utf-8');
}

// 2. Update new/page.tsx
let newPath = 'src/app/dashboard/projects/new/page.tsx';
let newContent = fs.readFileSync(newPath, 'utf-8');

if (!newContent.includes('EditorialWedding')) {
  // Add imports
  newContent = newContent.replace(
    /import CinematicWedding from "@\/components\/templates\/wedding\/CinematicWedding";/,
    'import CinematicWedding from "@/components/templates/wedding/CinematicWedding";\nimport EditorialWedding from "@/components/templates/wedding/EditorialWedding";\nimport TwilightWedding from "@/components/templates/wedding/TwilightWedding";'
  );

  // Add renders
  newContent = newContent.replace(
    /\{formData\.theme === 'cinematic' && <CinematicWedding data=\{previewData\} \/>\}/,
    `{formData.theme === 'cinematic' && <CinematicWedding data={previewData} />}
                      {formData.theme === 'editorial' && <EditorialWedding data={previewData} />}
                      {formData.theme === 'twilight' && <TwilightWedding data={previewData} />}`
  );
  
  // Update fallback
  newContent = newContent.replace(
    /!\['elegant', 'minimalist', 'rustic', 'cinematic'\]\.includes/,
    `!['elegant', 'minimalist', 'rustic', 'cinematic', 'editorial', 'twilight'].includes`
  );

  // Replace grid cols to 2 or 3 appropriately for 6 items
  newContent = newContent.replace(/className="grid grid-cols-2 md:grid-cols-4 gap-4"/, 'className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"');

  // Add button options
  const cinematicButtonRegex = /\{\/\*\s*Cinematic\s*\*\/\}([\s\S]*?)<\/button>/;
  const cinematicButtonMatch = newContent.match(cinematicButtonRegex);
  
  if (cinematicButtonMatch) {
    const newButtons = `
                     {/* Editorial */}
                     <button 
                       onClick={() => setFormData({...formData, theme: 'editorial'})}
                       className={\`p-4 rounded-xl border-2 text-center transition-all \${formData.theme === 'editorial' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}\`}
                     >
                       <div className="w-full h-32 bg-[#f2eee7] border border-slate-200 rounded-lg mb-3 flex flex-col items-center justify-center p-2">
                          <div className="text-[#17140f] font-serif text-lg">Editorial</div>
                          <div className="text-xs text-[#9c4b2e] mt-1 font-serif tracking-widest">MAGAZINE</div>
                       </div>
                       <h4 className="font-bold text-slate-900">Editorial</h4>
                     </button>
                     
                     {/* Twilight */}
                     <button 
                       onClick={() => setFormData({...formData, theme: 'twilight'})}
                       className={\`p-4 rounded-xl border-2 text-center transition-all \${formData.theme === 'twilight' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}\`}
                     >
                       <div className="w-full h-32 bg-[#221c39] border border-slate-200 rounded-lg mb-3 flex flex-col items-center justify-center p-2">
                          <div className="text-[#faf3ee] font-serif text-lg italic">Twilight</div>
                          <div className="text-xs text-[#c98fa0] mt-1 font-serif tracking-widest">PARALLAX</div>
                       </div>
                       <h4 className="font-bold text-slate-900">Twilight</h4>
                     </button>`;
                     
    newContent = newContent.replace(cinematicButtonRegex, match => match + newButtons);
  }

  fs.writeFileSync(newPath, newContent, 'utf-8');
}

console.log('Editorial and Twilight themes added!');
