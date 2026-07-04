const fs = require('fs');
const path = require('path');

const srcThemesDir = path.join(__dirname, 'src', 'Vitrine', 'themes', 'boulangerie');
const destThemesDir = path.join(__dirname, 'src', 'Vitrine', 'themes', 'vetements');

if (!fs.existsSync(destThemesDir)) fs.mkdirSync(destThemesDir, { recursive: true });

const themes = [
    { name: 'Eco', prefix: 'eco', iconOld: 'Wheat', iconNew: 'Shirt', words: [
        ["Au levain naturel", "Matières naturelles"],
        ["Pétri avec soin, cuit avec passion.", "Coupé avec soin, cousu avec passion."],
        ["L'artisanat boulanger", "La mode éthique"],
        ["Notre Fournil", "Notre Boutique"],
        ["Farines locales • Levain naturel • Tradition", "Tissus locaux • Coton bio • Style intemporel"]
    ]},
    { name: 'Luxe', prefix: 'luxe', iconOld: '', iconNew: '', words: [
        ["MAISON DE HAUTE PÂTISSERIE", "MAISON DE HAUTE COUTURE"],
        ["L'Artisanat <br />Boulanger", "L'Art de <br />S'habiller"],
        ["Une exigence de chaque instant pour des pains et pâtisseries d'exception.", "Une exigence de chaque instant pour des pièces uniques et d'exception."]
    ]},
    { name: 'Minimal', prefix: 'minimal', iconOld: '', iconNew: '', words: [
        ["L'Essentiel du Pain", "L'Essentiel du Style"]
    ]},
    { name: 'Moderne', prefix: 'moderne', iconOld: '', iconNew: '', words: [
        ['BAKERY <span className="m-accent-blue">FRESH</span>', 'FASHION <span className="m-accent-blue">TREND</span>']
    ]},
    { name: 'Vintage', prefix: 'vintage', iconOld: '', iconNew: '', words: [
        ["Fournée & Tradition", "Vintage & Authentique"],
        ["~ Nos Pains & Spécialités ~", "~ Notre Collection Rétro ~"],
        ["L'ALMANACH DU FOURNIL", "LE JOURNAL DE LA MODE"]
    ]}
];

for (const t of themes) {
    // React Component
    const srcComponentPath = path.join(srcThemesDir, `ThemeBoulangerie${t.name}.jsx`);
    const destComponentPath = path.join(destThemesDir, `ThemeVetement${t.name}.jsx`);
    
    let compContent = fs.readFileSync(srcComponentPath, 'utf8');
    
    // Change ThemeName
    compContent = compContent.replace(`ThemeBoulangerie${t.name}`, `ThemeVetement${t.name}`);
    
    // Change className
    compContent = compContent.replace(`theme-boulangerie-${t.prefix}`, `theme-vetement-${t.prefix}`);
    
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
    const srcScssPath = path.join(srcThemesDir, `_boulangerie-${t.prefix}.scss`);
    const destScssPath = path.join(destThemesDir, `_vetement-${t.prefix}.scss`);
    
    let scssContent = fs.readFileSync(srcScssPath, 'utf8');
    
    // Change root class
    scssContent = scssContent.replace(`.theme-boulangerie-${t.prefix} {`, `.theme-vetement-${t.prefix} {`);
    
    fs.writeFileSync(destScssPath, scssContent);
    console.log(`Created ${destScssPath}`);
}

// Update main.scss
const mainScssPath = path.join(__dirname, 'src', 'Vitrine', 'styles', 'main.scss');
let mainScssContent = fs.readFileSync(mainScssPath, 'utf8');
const imports = themes.map(t => `@use '../themes/vetements/vetement-${t.prefix}';`).join('\n');
if (!mainScssContent.includes('vetement-eco')) {
    mainScssContent = mainScssContent.replace('// Add more theme imports here as they are created', `${imports}\n// Add more theme imports here as they are created`);
    fs.writeFileSync(mainScssPath, mainScssContent);
    console.log('Updated main.scss');
}

console.log('Done!');
