# Deploy this in about 3 minutes

No build step. No dependencies. No server. It is plain HTML, CSS and JavaScript.

---

## Option A — GitHub Pages (free, sits next to your repos)

**GitHub does not unzip uploads.** Unzip this folder first, then upload the *files*.

1. Unzip. You now have a `vikash-portfolio` folder.
2. Go to <https://github.com/new>. Name the repo `portfolio`. Set it **Public**. Click **Create repository**.
3. On the new repo page click **uploading an existing file**.
4. Open the unzipped folder, select **everything inside it** (not the folder itself) and drag it onto the page.
5. Click **Commit changes**.
6. Go to **Settings → Pages**. Under *Source* choose **Deploy from a branch**, branch **main**, folder **/ (root)**. Save.
7. Wait about a minute. You are live at `https://YOUR-USERNAME.github.io/portfolio/`

**Want it at the domain root instead?** Name the repo `YOUR-USERNAME.github.io` and it serves from
`https://YOUR-USERNAME.github.io/` with no subfolder.

### Using Git instead of drag-and-drop

```bash
cd vikash-portfolio
git init
git add .
git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
git push -u origin main
```

---

## Option B — Netlify (this one really does accept the zip)

Go to <https://app.netlify.com/drop> and drag the **zip file itself** onto the page.
It unpacks and hosts it immediately. You get a URL straight away and can rename it in
*Site settings → Change site name*.

---

## Option C — Vercel

```bash
cd vikash-portfolio
npx vercel --prod
```

Framework preset **Other**, build command **none**, output directory **.**

---

## After you are live: update your URL in 6 places

The placeholder is `https://vikashmaharaj.github.io/portfolio/`. Replace it with your real URL.
Everything else on the site uses relative paths, so it works at any subfolder without changes.

| File | What to change |
|---|---|
| `index.html` | `<link rel="canonical">` |
| `index.html` | `og:url` |
| `index.html` | `og:image` and `twitter:image` |
| `index.html` | `"url"` inside the JSON-LD block |
| `portfolio-data.js` | `seo.url` |
| `sitemap.xml` | `<loc>` |
| `robots.txt` | `Sitemap:` line |

Until you do, link previews on LinkedIn and WhatsApp will not show the share card.

---

## Three content decisions still open

Open `portfolio-data.js` and search for **CONFIRM**.

1. **Second employer's name.** It currently reads *Nirikshan AI*, from your resume. Your brief
   said *Direction AI*. One line: `experience[1].company`.
2. **Your résumé.** Drop a PDF next to `index.html` and set `contact.resumeUrl` to the filename,
   e.g. `"Vikash-Maharaj-Resume.pdf"`. The Résumé button and contact row appear automatically.
   While it is blank they stay hidden rather than link to a missing file.
3. **Certifications.** Only the two verified freeCodeCamp entries are listed. LinkedIn blocks
   automated reading so nothing was added from it. Add more in `certifications`.

---

## Files in this folder

| File | Needed to host? | What it is |
|---|---|---|
| `index.html` | **yes** | the page |
| `styles.css` | **yes** | all styling |
| `app.js` | **yes** | rendering and interactions |
| `portfolio-data.js` | **yes** | **all your content — edit this one** |
| `og-image.png` | **yes** | the share card for LinkedIn/WhatsApp/Twitter |
| `robots.txt`, `sitemap.xml` | recommended | search engines |
| `.nojekyll` | recommended | tells GitHub Pages to skip Jekyll |
| `portfolio-standalone.html` | no | the whole site as one file, to email or open offline |
| `build.js` | no | regenerates the standalone file (`node build.js`) |
| `test/` | no | headless checks (`npm i -D jsdom` first) |
| `README.md`, `DEPLOY.md` | no | documentation |

You can delete anything marked "no" without breaking the site.

---

## Preview it locally first

```bash
cd vikash-portfolio
python3 -m http.server 5173
```

Then open <http://localhost:5173>.

Opening `index.html` by double-clicking also works, but the GitHub repositories
section stays empty because browsers block that request from `file://`.
