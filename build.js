/* Inlines styles.css + portfolio-data.js + app.js into one standalone file.
   Run:  node build.js      Output:  portfolio-standalone.html
   The multi-file version stays the source of truth — regenerate after edits. */

const fs = require('fs');
const path = require('path');
const root = __dirname;

const read = f => fs.readFileSync(path.join(root, f), 'utf8');

let html = read('index.html');
const css = read('styles.css');
const data = read('portfolio-data.js');
const app = read('app.js');

// NOTE: replacement must be a function — a string replacement would treat
// $&, $', $` and $1 inside the file contents as special patterns and corrupt it.
html = html.replace(
  '<link rel="stylesheet" href="styles.css">',
  () => '<style>\n' + css + '\n</style>'
);

html = html.replace(
  '<script src="portfolio-data.js"></script>\n<script src="app.js"></script>',
  () => '<script>\n' + data + '\n</script>\n<script>\n' + app + '\n</script>'
);

// the standalone file has no sibling og-image.png unless it is deployed alongside
fs.writeFileSync(path.join(root, 'portfolio-standalone.html'), html);

const kb = n => (n / 1024).toFixed(1) + ' KB';
console.log('portfolio-standalone.html written —', kb(Buffer.byteLength(html)));
console.log('  css', kb(css.length), '| data', kb(data.length), '| app', kb(app.length));
