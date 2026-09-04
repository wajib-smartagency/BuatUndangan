const fs = require('fs');

let file = 'src/components/templates/wedding/CinematicWedding.tsx';
let content = fs.readFileSync(file, 'utf-8');

content = content.replace(/\{data\.galeri\.map/g, '{(data.galeri || []).map');
content = content.replace(/\{data\.rekening\.map/g, '{(data.rekening || []).map');

fs.writeFileSync(file, content, 'utf-8');

console.log("Map issues fixed!");
