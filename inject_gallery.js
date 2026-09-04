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
  
  // 1. Add lucide-react imports for slider/lightbox (X, ChevronLeft, ChevronRight)
  if (!content.includes('ChevronLeft')) {
    content = content.replace(/import \{([^}]+)\} from 'lucide-react';/, (match, p1) => {
      return `import { ${p1}, X, ChevronLeft, ChevronRight } from 'lucide-react';`;
    });
  }

  // 2. Add State for Lightbox & Slider
  if (!content.includes('selectedImage')) {
    const stateInjection = `const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!data.galeri || data.galeri.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === data.galeri!.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [data.galeri]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? data.galeri!.length - 1 : prev - 1));
  };
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === data.galeri!.length - 1 ? 0 : prev + 1));
  };
`;
    content = content.replace(/const \[timeLeft[\s\S]*?\] = useState\([^)]+\);/, (match) => {
      return match + '\n  ' + stateInjection;
    });
  }

  // 3. Replace the Gallery Section
  // Find the gallery section. Usually starts with {/* Gallery Section */} and ends before the next section
  const galleryRegex = /\{\/\*\s*Gallery Section\s*\*\/\}([\s\S]*?)\{\/\*\s*(Gift|RSVP|Info)\s*Section/i;
  
  const newGalleryCode = `{/* Gallery Section */}
      {data.galeri && data.galeri.length > 0 && (
        <section className="py-20 px-4 bg-black/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif text-amber-900 mb-4">Momen Indah</h2>
              <p className="text-slate-500">Galeri foto kebahagiaan kami</p>
            </div>
            
            {/* Auto-Slide Carousel Featured */}
            <div className="relative w-full aspect-[4/3] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl mb-6 group bg-slate-200">
              <div 
                className="flex transition-transform duration-1000 ease-in-out h-full"
                style={{ transform: \`translateX(-\${currentSlide * 100}%)\` }}
              >
                {data.galeri.map((url, idx) => (
                  <div key={idx} className="w-full shrink-0 h-full relative cursor-zoom-in" onClick={() => setSelectedImage(url)}>
                    <img src={url} alt={\`Slide \${idx}\`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                  </div>
                ))}
              </div>
              
              {/* Carousel Controls */}
              <button onClick={handlePrevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={handleNextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg">
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {data.galeri.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentSlide(idx)}
                    className={\`w-2 h-2 rounded-full transition-all \${currentSlide === idx ? 'bg-white w-6' : 'bg-white/50'}\`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-4">
              {data.galeri.map((url, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {setCurrentSlide(idx); setSelectedImage(url);}}
                  className={\`aspect-square rounded-xl overflow-hidden cursor-zoom-in transition-all \${currentSlide === idx ? 'ring-4 ring-amber-400 scale-95 opacity-100' : 'opacity-70 hover:opacity-100'}\`}
                >
                  <img src={url} alt={\`Thumb \${idx}\`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox / Zoom Overlay */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          >
            <X className="w-6 h-6" />
          </button>
          
          <img 
            src={selectedImage} 
            alt="Zoomed" 
            className="max-w-full max-h-[90vh] object-contain animate-in zoom-in-95 duration-300 shadow-2xl rounded-lg" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* `;
  
  content = content.replace(galleryRegex, (match, p1, p2) => {
    // Preserve the original section type name (Gift or RSVP)
    return newGalleryCode + p2 + " Section";
  });

  fs.writeFileSync(file, content, 'utf-8');
});

console.log("Gallery overhaul applied to all templates!");
