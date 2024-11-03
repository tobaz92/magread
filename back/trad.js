const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Fonction pour extraire les chaînes de caractères
const extractStrings = (dir) => {
  const strings = {};

  // Dossiers à exclure
  const folderExclude = ["node_modules", "locales", "public", "config"];

  // Fichiers à traiter (js, ts, ejs) tout en excluant les dossiers spécifiés
  const filesSansExlude = (dir) => {
    const files = glob.sync(`${dir}/**/*.{js,ts,ejs}`, { nodir: true });

    return files.filter((file) => {
      for (const exclude of folderExclude) {
        if (file.includes(exclude)) {
          return false;
        }
      }
      return true;
    });
  };

  // Regex pour extraire uniquement les chaînes entre guillemets
  const regexString = /(?<!\\)["'`]([^"'`{}[\];\\/]*)(?<!\\)["'`]/g;

  // Liste des motifs à éliminer, élargis pour couvrir plus de cas
  const excludePatterns = [
    /%[0-9a-fA-F]{2}/, // URLs encodées
    /M[0-9]{3,4}%[0-9a-zA-Z%\- ]+/, // Codes SVG et séquences encodées
    /apple-touch|favicon|og-image|icon|logo/, // Préfixes d'assets web
    /[\n\r\t]+/, // Caractères de contrôle
    /\d{2,4}x\d{2,4}/, // Dimensions comme 180x18
    /translate|rotate|scale|skew|matrix\([0-9., ]+/, // Transformations CSS
    /<%=|{{|#{|}}/, // Balises de template (EJS, Pug, etc.)
    /accept-|content-type|host|user-agent/, // En-têtes HTTP
    /GET|POST|PUT|DELETE|PATCH/, // Méthodes HTTP
    /pload\.single\(/, // Appels comme pload.single(
    /ABCDEFGHIJKLMNOPQ/, // Chaînes longues de majuscules
    /base64/, // Chaînes encodées en base64
    /\d{4}-\d{2}-\d{2}/, // Dates au format YYYY-MM-DD
    /#username|#ffffff/, // Identifiants ou couleurs hexadécimales
    /theme-colo/, // Chaînes relatives aux thèmes
    /msapplication-TileColor/, // Métadonnées pour MS apps
    /1\.0/, // Versions de fichier
    /\d+px/, // Dimensions en pixels (10px, etc.)
    /\.domain/, // Domaines de type .domain
    / value=/, // Attributs d'entrée HTML
    /\)\.remove/, // Méthodes de manipulation du DOM
    /X-UA-Compatible/, // Métadonnées pour compatibilité navigateur
    /cookie-parser/, // Middleware cookie-parser
    /%[0-9A-Fa-f]{2}/, // Autres encodages d'URL
    /Authorization|Bearer|Token/, // En-têtes et jetons d'autorisation
    /(?:http|https):\/\/[^\s"]+/, // URLs complètes
    /\{\{[^}]+\}\}/, // Syntaxes de template comme Handlebars ({{ }})
    /\[\[.+?\]\]/, // Balises spécifiques (comme celles de Web Components)
    /debugger|console\.log/, // Déclarations de debug
    /process\.env\.[A-Z_]+/, // Variables d'environnement dans Node.js
    /path\.resolve\(.+?\)/, // Appels à des chemins comme path.resolve
    /require\(.+?\)/, // Appels à require() (Node.js)
    /typeof\s+[a-zA-Z]+/, // Vérifications de type JavaScript
    /instanceof\s+[A-Z][a-zA-Z]+/, // Vérifications d'instance
    /@import\s+['"].+?['"];/, // Importation de fichiers CSS
    /font-size:\s*\d+px/, // Déclaration de taille de police en CSS
    /rgba?\(\d+, \d+, \d+(, \d+)?\)/, // Couleurs en format RGB/RGBA
    /-webkit-|-moz-|-ms-/, // Préfixes spécifiques aux navigateurs
    /Date\.now\(\)/, // Appels à la fonction Date.now()
    /Object\.assign\(.+?\)/, // Méthode Object.assign
    /Math\.(max|min|random)\(.+?\)/, // Appels à des fonctions Math
    /setTimeout\(.+?\)/, // Appels à setTimeout
    /clearTimeout\(.+?\)/, // Appels à clearTimeout
    /\d+\.\d+\.\d+/, // Versions de logiciels (type 1.0.0)
    /import\s+[^'"]+['"];?/, // Importations ES6
    /export\s+(default\s+)?[a-zA-Z]+/, // Exportations ES6
    /module\.exports\s*=\s*.+;/, // Exports en CommonJS
    /<\/?[a-zA-Z][^>]*>/, // Balises HTML ou JSX
    /\b\d{1,3}(,\d{3})*(\.\d+)?\b/, // Nombres formatés avec des virgules (1,000.00)
    /[0-9a-f]{8,}/, // Chaînes hexadécimales longues (hashs, IDs)
    /\d+\s*ms/, // Durées en millisecondes
    /undefined|null|NaN/, // Valeurs spéciales de JavaScript
    /\b\d{2}:\d{2}(:\d{2})?\b/, // Horaires au format HH:mm ou HH:mm:ss
    /constructor|prototype|super\(/, // Syntaxe de classes JavaScript
    /\blet\b|\bconst\b|\bvar\b/, // Mots-clés de déclaration de variables
    /(?:async\s+)?function\s*\(.*?\)/, // Déclarations de fonctions
    /\bthen\b|\bcatch\b|\bfinally\b/, // Méthodes de promesses
    /JSON\.(stringify|parse)\(.+?\)/, // Appels à JSON.stringify et JSON.parse
    /\b\d{2,4}(\.\d{1,3})?\%/, // Pourcentages (25%, 99.99%, etc.)
    /background:\s*#[0-9a-fA-F]{6}/, // Couleurs hexadécimales
    /\blocalhost\b/, // Références à localhost
    /\b\d+\.\d+\.\d+\.\d+\b/, // Adresses IP
    /\bconsole\.[a-z]+\(.+?\)/, // Appels à des méthodes console (log, warn, error)
    /^$/, // Exclure les chaînes vides
    /^[:;.,!?\-]+$/, // Exclure uniquement les chaînes qui ne contiennent que des caractères de ponctuation ou symboles
    /\b(?:multer|cors|express|mongoose|body-parser|jsonwebtoken|axios)\b/ // Exclure des modules Node.js populaires comme multer, cors, etc.
  ];
  
  

  // Parcourir chaque fichier filtré
  filesSansExlude(dir).forEach((file) => {
    const content = fs.readFileSync(file, "utf8");

    let match;
    while ((match = regexString.exec(content)) !== null) {
      const str = match[1]; // Capturer uniquement le texte entre guillemets
      
      // Vérification contre les motifs d'exclusion
      const shouldExclude = excludePatterns.some((pattern) => pattern.test(str));
      if (!shouldExclude && !str.match(/^\.\.?\/|\\|\.[a-z]{2,4}$/)) { // Exclure les chemins et fichiers binaires
        strings[str] = str; // Ajouter la chaîne extraite à l'objet strings
      }
    }
  });

  return strings;
};

// Extraire les chaînes de caractères du répertoire src
const strings = extractStrings(path.join(__dirname, "src"));

// Écrire les chaînes de caractères dans en.json
console.log(strings);
