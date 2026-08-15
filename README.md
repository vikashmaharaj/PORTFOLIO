# Vikash Maharaj — Data Scientist / Data Analyst portfolio

A single-page portfolio built around one narrative:

**Business problem → client requirement → data → cleaning → EDA → statistics → machine learning → visualization → insight → automation → decision.**

Every fact on the site comes from the resume or from Vikash directly. Nothing is invented.

---

## Run it

No build step, no dependencies. Open `index.html` and it works.

The GitHub section needs a real HTTP origin (`file://` blocks `fetch`), so use any static server:

```bash
python3 -m http.server 5173      # then open http://localhost:5173
# or
npx serve .
```

---

## Two things to set before you go live

| # | What | Where |
|---|---|---|
| 1 | **Confirm the second employer's name.** Your brief said *Direction AI*; the resume said *Nirikshan AI*. The resume name is currently shown. | `portfolio-data.js` → `experience[1].company` |
| 2 | **Add your résumé.** Drop a PDF next to `index.html` and set the filename. The Résumé button and contact row then appear automatically; while it's blank they stay hidden rather than 404. | `portfolio-data.js` → `contact.resumeUrl` |

Also swap `https://vikashmaharaj.github.io/portfolio/` for your real URL in `index.html`
(canonical, `og:url`, `og:image`, `twitter:image`) and in `portfolio-data.js` → `seo.url`.

---

## Change the content

**Everything lives in `portfolio-data.js`.** Edit, save, refresh. You never touch `app.js` or `index.html` to update content.

| What you want to change | Where |
|---|---|
| Name, positioning line, headline, value prop, About | `profile` |
| The four-card recruiter strip under the hero | `profile.snapshot` |
| Email, phone, LinkedIn, GitHub, location, résumé | `contact` |
| Nav items | `nav` |
| Colour key (data / ml / auto / biz) | `legend` |
| Code snippets cycling in the hero console | `cells` |
| "Impact in numbers" cards | `metrics` |
| The 11-stage spectrum | `spectrum.stages` |
| Skill domains, chains and item lists | `skills.domains` |
| Jobs, bullets, KPIs, client chain, automation bar | `experience` |
| Projects and case-study detail | `projects` |
| Self-taught areas (credit risk, PyTorch, PySpark) | `knowledge.areas` |
| ML section copy and tags | `ml` |
| Degree and certifications | `education`, `certifications` |
| Artist / Composer / Chef / Creator tiles | `beyond.tiles` |
| Terminal easter-egg output | `terminal` |
| Title, meta description, OG image | `seo` |

### Adding a skill

Add a string to `items` in any `skills.domains` entry. The counter updates itself.
To put a skill in the animated chain, add it to that domain's `chain` array — the
stagger and the `→` separators are generated.

### Adding a project

Copy an entry in `projects`. Set `chart` to:

* `"accuracy"` — a gauge, needs `chartValue: 88`
* `"bars"` — a bar chart
* `"shrink"` — a before/after bar, needs `shrink: { from: 18, to: 2, unit: "days" }`

Paste a GitHub URL into `repo` and a **View repository** button appears in the case study.

### Adding a certification

```js
{ name: "…", issuer: "…", year: "2026", tone: "data",
  focus: ["…", "…"], url: "https://…" }   // url optional — adds a Verify link
```

---

## Architecture

```
index.html          semantic shell, SEO meta, JSON-LD, section scaffolding
styles.css          design tokens + every component (one file, no preprocessor)
portfolio-data.js   ← ALL CONTENT. one object, window.PORTFOLIO
app.js              renders data into the shell, runs canvases and interactions
og-image.png        1200×630 social share card
robots.txt
build.js            inlines everything into portfolio-standalone.html
test/               headless checks (needs `npm i -D jsdom`)
```

**Colour is a legend, not decoration.** Four accents each mean one thing, everywhere:

| Accent | Meaning |
|---|---|
| Blue `#4D9BFF` | data, SQL, analytics |
| Violet `#9B7BFF` | machine learning |
| Green `#2FD79B` | AI, automation, efficiency |
| Amber `#F5A63C` | business, client, decision |

Any element can carry `data-tone="data|ml|auto|biz"` and everything inside it picks up
`--a` and `--a-dim` automatically. That's the whole theming system — one attribute.

**Type.** Archivo for display (name, section titles, big numbers), IBM Plex Sans for
body, IBM Plex Mono for labels, code, axis ticks and metrics.

**Why no React/Vite/Three.js.** The site is content plus two canvas visualisations. A
framework would add a build step and a few hundred KB of runtime for no user-visible
gain. The 3D neural network is a hand-written perspective projection on a 2D canvas —
same visual, no WebGL bundle. Total page weight is well under 150 KB before fonts.

**Performance.** One shared `requestAnimationFrame` loop drives both canvases; each
pauses when scrolled out of view and when the tab is hidden. Device pixel ratio is
capped at 2. Point and node counts drop on narrow screens. The hero typing animation
stops when the tab is hidden. GitHub is fetched lazily on scroll.

**The hero classifier is real.** Two Gaussian clusters are generated, the optimal
boundary is computed as the perpendicular bisector of the class means, and the drawn
boundary converges toward it. The accuracy readout is counted from the points against
the current boundary each frame — it is not a scripted number.

**Accessibility.** Skip link, semantic landmarks, one `h1` and a `h2` per section,
visible focus rings, arrow-key navigation in the spectrum rail, `aria-expanded` on every
disclosure, a focus-trapped modal that returns focus on close, `aria-live` on panels that
swap content, alt/label text on both canvases, and `prefers-reduced-motion` support that
disables the loops and renders a single static frame with all bars and chains at their
final state.

**GitHub section.** Repos are fetched live from the public GitHub API, lazily, on scroll.
The unauthenticated API allows 60 requests/hour per IP; on rate limit, network failure, a
missing user or an empty list, the section shows an honest message and a link to the
profile. **It never invents repository data.** No token is needed and none should be committed.

**Contact form.** Builds a `mailto:` link and hands off to the email client. There is no
backend, so there is no fake "message sent" confirmation. Formspree or Netlify Forms drop
in later with a few lines.

---

## Tests

```bash
npm i -D jsdom
node test/smoke.js       # renders headlessly: sections, links, a11y, interactions, SEO
node test/edge.js        # reduced-motion + every GitHub API failure mode
node test/audit.js       # flags any number on the page not traceable to the resume
node test/standalone.js  # verifies the inlined single-file build
```

`smoke.js` also fails the build if the old incorrect LinkedIn handle reappears anywhere.

---

## Deploy

No build command, no environment variables, no server. Any static host works.

**GitHub Pages**

```bash
git init && git add . && git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/vikashmaharaj/portfolio.git
git push -u origin main
```

Then **Settings → Pages → Deploy from a branch → `main` / root**.

**Netlify** — drag the folder onto <https://app.netlify.com/drop>, or connect the repo with
an empty build command and publish directory `.`.

**Vercel** — `npx vercel --prod`, framework preset **Other**, no build command, output `.`.

Optionally run `node build.js` first to regenerate `portfolio-standalone.html`, a single
self-contained file you can email or open from a USB stick.

---

## Content provenance

Verified against the resume: name, B.Tech in Robotics and Artificial Intelligence
(2021–2025, J.C. Bose University of Science and Technology, YMCA, Faridabad), both roles
with their dates and bullets, both original projects, both freeCodeCamp certifications,
all achievement figures, and working email, phone and GitHub links.

Supplied by Vikash in the redesign brief and used as stated: the corrected LinkedIn URL,
the ~10-day → ~2-day crawling automation figure, the additional tools (PySpark, PyTorch,
MySQL, BigQuery, AWS, Colab, Jupyter, Tableau), the self-taught credit-risk knowledge, and
the creative interests behind the Beyond Data section.

Deliberately **not** included: any certification not already verified (LinkedIn blocks
automated reading, so nothing was scraped or guessed), and the ambiguous "Max library"
from earlier notes — it could not be resolved to a real library, so it was left out rather
than guessed at.
