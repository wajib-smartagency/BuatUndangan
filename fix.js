const fs = require('fs');
let f1 = fs.readFileSync('src/app/dashboard/projects/new/page.tsx', 'utf8');
f1 = f1.replace(/\\`/g, '`');
f1 = f1.replace(/\\\$/g, '$');
fs.writeFileSync('src/app/dashboard/projects/new/page.tsx', f1);

let f2 = fs.readFileSync('src/app/[slug]/page.tsx', 'utf8');
f2 = f2.replace(/\\`/g, '`');
f2 = f2.replace(/\\\$/g, '$');
fs.writeFileSync('src/app/[slug]/page.tsx', f2);
