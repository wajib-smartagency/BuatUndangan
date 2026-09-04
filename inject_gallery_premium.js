const fs = require('fs');

const templates = [
  'src/components/templates/wedding/ElegantWedding.tsx',
  'src/components/templates/wedding/MinimalistWedding.tsx',
  'src/components/templates/wedding/RusticWedding.tsx',
  'src/components/templates/birthday/FunBirthday.tsx',
  'src/components/templates/general/ModernEvent.tsx'
];

templates.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');
  
  // 1. Remove the old setInterval logic to avoid random jumps in Lightbox
  content = content.replace(/useEffect\(\(\) => \{\s*if \(!data\.galeri \|\| data\.galeri\.length === 0\) return;\s*const timer = setInterval\(\(\) => \{\s*setCurrentSlide\(\(prev\) => \(prev === data\.galeri!\.length - 1 \? 0 : prev \+ 1\)\);\s*\}, 3000\);\s*return \(\) => clearInterval\(timer\);\s*\}, \[data\.galeri\]\);/, '');

  // 2. Replace the Gallery Section entirely
  const galleryRegex = /\{\/\*\s*Gallery Section\s*\*\/\}([\s\S]*?)\{\/\*\s*(Gift|RSVP|Info)\s*Section/i;
  
  const newGalleryCode = `{/* Gallery Section */}
      {data.galeri && data.galeri.length > 0 && (
        <section className="py-24 px-4 bg-transparent relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-slate-800 mb-4" style={{ fontFamily: 'var(--font-serif, serif)' }}>Galeri Momen</h2>
              <div className="w-16 h-px bg-slate-400 mx-auto mb-4"></div>
              <p className="text-slate-500 tracking-widest uppercase text-xs">Our Beautiful Memories</p>
            </div>
            
            {/* Elegant Masonry Grid */}
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {data.galeri.map((url, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {setCurrentSlide(idx); setSelectedImage(url);}}
                  className="relative overflow-hidden cursor-zoom-in group break-inside-avoid rounded-lg shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <img 
                    src={url} 
                    alt={\`Gallery \${idx}\`} 
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                     <div className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-75 group-hover:scale-100">
                        <span className="text-white text-xl font-light">+</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Premium Fullscreen Lightbox Slider */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300"
        >
          {/* Header Controls */}
          <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-[110] bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
             <div className="text-white/70 font-mono text-sm tracking-widest pointer-events-auto">
               {currentSlide + 1} / {data.galeri.length}
             </div>
             <button 
               className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors pointer-events-auto backdrop-blur-md"
               onClick={() => setSelectedImage(null)}
             >
               <X className="w-5 h-5 md:w-6 md:h-6" />
             </button>
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrevSlide(); }} 
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-[110] hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); handleNextSlide(); }} 
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-[110] hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          {/* Main Slider Track */}
          <div 
            className="w-full h-full flex items-center transition-transform duration-700 ease-out"
            style={{ transform: \`translateX(-\${currentSlide * 100}%)\` }}
            onClick={() => setSelectedImage(null)}
          >
            {data.galeri.map((url, idx) => (
              <div key={idx} className="w-full h-full shrink-0 flex items-center justify-center p-4 md:p-16">
                <img 
                  src={url} 
                  alt={\`Zoomed \${idx}\`} 
                  className={\`max-w-full max-h-full object-contain drop-shadow-2xl transition-all duration-700 pointer-events-auto \${currentSlide === idx ? 'scale-100 opacity-100' : 'scale-90 opacity-50'}\`} 
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* `;
  
  content = content.replace(galleryRegex, (match, p1, p2) => {
    return newGalleryCode + p2 + " Section";
  });

  fs.writeFileSync(file, content, 'utf-8');
});

console.log("Premium gallery overhaul applied!");
