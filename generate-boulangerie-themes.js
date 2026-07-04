const fs = require('fs');
const path = require('path');

const srcThemesDir = path.join(__dirname, 'src', 'Vitrine', 'themes');
const srcStylesDir = path.join(__dirname, 'src', 'Vitrine', 'styles', 'themes');

const destThemesDir = path.join(srcThemesDir, 'boulangerie');
const destStylesDir = path.join(srcStylesDir, 'boulangerie');

if (!fs.existsSync(destThemesDir)) fs.mkdirSync(destThemesDir, { recursive: true });
if (!fs.existsSync(destStylesDir)) fs.mkdirSync(destStylesDir, { recursive: true });

const themes = [
    { name: 'Eco', prefix: 'eco', iconOld: 'Leaf', iconNew: 'Wheat', words: [
        ["Naturellement", "Au levain naturel"],
        ["Cultivé avec soin, partagé avec passion.", "Pétri avec soin, cuit avec passion."],
        ["Engagement {siteData.metier}", "L'artisanat boulanger"],
        ["Notre Écrin", "Notre Fournil"],
        ["Respect de la terre • Engagement quotidien", "Farines locales • Levain naturel • Tradition"]
    ]},
    { name: 'Luxe', prefix: 'luxe', iconOld: '', iconNew: '', words: [
        ["MAISON ARTISANALE", "MAISON DE HAUTE PÂTISSERIE"],
        ["L'Art de <br />{siteData.metier}", "L'Artisanat <br />Boulanger"],
        ["Une exigence de chaque instant pour des créations d'exception.", "Une exigence de chaque instant pour des pains et pâtisseries d'exception."]
    ]},
    { name: 'Minimal', prefix: 'minimal', iconOld: '', iconNew: '', words: [
        ["Une Approche Pure", "L'Essentiel du Pain"]
    ]},
    { name: 'Moderne', prefix: 'moderne', iconOld: '', iconNew: '', words: [
        ['DESIGN <span className="m-accent-blue">STRIKE</span>', 'BAKERY <span className="m-accent-blue">FRESH</span>']
    ]},
    { name: 'Vintage', prefix: 'vintage', iconOld: '', iconNew: '', words: [
        ["Authenticité & Savoir-faire", "Fournée & Tradition"],
        ["~ Nos Articles de Référence ~", "~ Nos Pains & Spécialités ~"],
        ["L'ALMANACH DE LA BOUTIQUE", "L'ALMANACH DU FOURNIL"]
    ]}
];

for (const t of themes) {
    // React Component
    const srcComponentPath = path.join(srcThemesDir, `Theme${t.name}.jsx`);
    const destComponentPath = path.join(destThemesDir, `ThemeBoulangerie${t.name}.jsx`);
    
    let compContent = fs.readFileSync(srcComponentPath, 'utf8');
    
    // Change ThemeName
    compContent = compContent.replace(`Theme${t.name}`, `ThemeBoulangerie${t.name}`);
    
    // Change className from theme-xxx to theme-boulangerie-xxx
    compContent = compContent.replace(`theme-${t.prefix}`, `theme-boulangerie-${t.prefix}`);
    
    // Fix FavoriteButton import path
    compContent = compContent.replace(`'../components/common/FavoriteButton'`, `'../../components/common/FavoriteButton'`);
    
    // Replace icons
    if (t.iconOld && t.iconNew) {
        compContent = compContent.replace(new RegExp(t.iconOld, 'g'), t.iconNew);
    }
    
    // Replace specific words
    for (const [oldWord, newWord] of t.words) {
        compContent = compContent.replace(new RegExp(oldWord, 'g'), newWord);
    }
    
    fs.writeFileSync(destComponentPath, compContent);
    console.log(`Created ${destComponentPath}`);
    
    // SCSS File
    const srcScssPath = path.join(srcStylesDir, `_${t.prefix}.scss`);
    const destScssPath = path.join(destStylesDir, `_boulangerie-${t.prefix}.scss`);
    
    let scssContent = fs.readFileSync(srcScssPath, 'utf8');
    
    // Change root class
    scssContent = scssContent.replace(`.theme-${t.prefix} {`, `.theme-boulangerie-${t.prefix} {`);
    
    fs.writeFileSync(destScssPath, scssContent);
    console.log(`Created ${destScssPath}`);
}

// Update main.scss
const mainScssPath = path.join(__dirname, 'src', 'Vitrine', 'styles', 'main.scss');
let mainScssContent = fs.readFileSync(mainScssPath, 'utf8');
const imports = themes.map(t => `@use './themes/boulangerie/boulangerie-${t.prefix}';`).join('\n');
if (!mainScssContent.includes('boulangerie-eco')) {
    mainScssContent = mainScssContent.replace('// Add more theme imports here as they are created', `${imports}\n// Add more theme imports here as they are created`);
    fs.writeFileSync(mainScssPath, mainScssContent);
    console.log('Updated main.scss');
}

console.log('Done!');
