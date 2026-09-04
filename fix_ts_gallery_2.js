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
  
  // Fix the broken length check
  content = content.replace(/data\.galeri\?.length \|\| 0 > 0/g, '(data.galeri?.length || 0) > 0');

  fs.writeFileSync(file, content, 'utf-8');
});

console.log("Typescript undefined fix corrected!");
