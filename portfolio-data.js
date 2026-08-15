/* ==========================================================================
   portfolio-data.js  —  ALL CONTENT LIVES HERE
   --------------------------------------------------------------------------
   Change a value, save, refresh. You never need to open app.js or index.html
   to update content.

   FACT POLICY: every fact below comes from Vikash Maharaj's resume, the
   previous version of this site, or the brief Vikash wrote himself.
   Nothing is invented. Fields marked  // EDITABLE  are yours to fill in.

   ⚠️ TWO THINGS TO CONFIRM  (search for "CONFIRM" to find them):
      1. experience[1].company — your brief said "Direction AI", the resume
         said "Nirikshan AI". The resume name is kept. Change one line if wrong.
      2. contact.resumeUrl — empty, so the Résumé button is hidden. Drop a PDF
         in this folder and set the filename to switch the button on.
   ========================================================================== */

window.PORTFOLIO = {

  /* ---------------------------------------------------------------- PROFILE */
  profile: {
    name: "Vikash Maharaj",
    /* Positioning line. Job titles inside `experience` stay exactly as held. */
    role: "Data Scientist / Data Analyst",
    discipline: "Machine Learning · Business Analytics · AI Automation",
    headline: "I turn business questions into datasets, models and automation that answer them.",
    valueProp:
      "Python and SQL across 100,000+ record datasets. Supervised classification in production. " +
      "Prompt-engineered automation that took a 10-day workflow down to 2. B.Tech in Robotics and AI.",
    /* Recruiter scan strip — the four facts worth 10 seconds. */
    snapshot: [
      { k: "Now",       v: "BA / MIS Executive",       s: "1DigitalStack · e-commerce analytics" },
      { k: "Before",    v: "Data Analyst",             s: "Nirikshan AI · ML & production data" },
      { k: "Core",      v: "Python · SQL · ML · BI",   s: "Pandas, Scikit-learn, Power BI, BigQuery" },
      { k: "Education", v: "B.Tech Robotics & AI",     s: "J.C. Bose University (YMCA), 2021–2025" }
    ],
    about: [
      "I sit in the overlap between three jobs that usually belong to three people: the analyst who writes the query, the data scientist who builds the model, and the person in the client review explaining what any of it means.",
      "Day to day that looks like querying six-figure e-commerce datasets in SQL, moving them into Python when the transformation outgrows the query, engineering features, training supervised classifiers, and shaping the result into a dashboard someone can decide with. My degree is in Robotics and Artificial Intelligence, which is why the machine-learning side is never far from the analytics side.",
      "The part I'd want you to know that isn't on a resume: I like being bad at things for a while. New library, new domain, new tool — I'd rather spend a weekend not understanding something than a year staying comfortable. That's how the GenAI automation work started, and it's the same instinct that makes me cook, paint and write music badly enough to keep improving."
    ],
    availability: "Open to Data Scientist & Data Analyst roles" // EDITABLE
  },

  /* ---------------------------------------------------------------- CONTACT */
  contact: {
    email: "vikashbhatt9910@gmail.com",
    phone: "+91-9910146253",
    /* CORRECTED — the previous site used a misspelt handle. This is the right one. */
    linkedin: { label: "linkedin.com/in/vikashmahraj", url: "https://www.linkedin.com/in/vikashmahraj" },
    github:   { label: "github.com/vikashmaharaj",     url: "https://github.com/vikashmaharaj" },
    githubUser: "vikashmaharaj",
    location: "Delhi NCR, India",
    /* EDITABLE — drop a PDF next to index.html and put the filename here.
       Leave "" and the Résumé button hides itself rather than 404-ing. */
    resumeUrl: "",
    ctaHeadline: "Send me a problem, not a job description.",
    ctaBody:
      "If you have messy data, a question nobody can answer yet, a report someone rebuilds by hand every week, or a model that needs to actually ship — that's the conversation I want."
  },

  /* ------------------------------------------------------------- NAVIGATION */
  nav: [
    { id: "spectrum",   label: "Spectrum" },
    { id: "skills",     label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects",   label: "Projects" },
    { id: "impact",     label: "Impact" },
    { id: "knowledge",  label: "Knowledge" },
    { id: "beyond",     label: "Beyond" },
    { id: "contact",    label: "Contact" }
  ],

  /* ------------------------------------------------------------ COLOUR KEY
     Four accents, each one means a domain. Used consistently site-wide so a
     chip's colour tells you what kind of skill it is before you read it.     */
  legend: [
    { key: "data", label: "Data & analytics" },
    { key: "ml",   label: "Machine learning" },
    { key: "auto", label: "AI & automation" },
    { key: "biz",  label: "Business & client" }
  ],

  /* ------------------------------------------------------------- HERO CELLS
     Code that cycles in the hero console. Real snippets, real libraries.     */
  cells: [
    {
      lang: "python",
      code: [
        "df = pd.read_sql(query, conn)",
        "df = df.dropna(subset=['sku', 'gmv'])",
        "X, y = features(df), df['category']",
        "clf = RandomForestClassifier().fit(X, y)"
      ],
      out: "50,000+ SKUs classified · 100% accuracy"
    },
    {
      lang: "sql",
      code: [
        "SELECT outlet, SUM(sales) AS gmv",
        "FROM   quick_commerce.orders",
        "WHERE  order_date >= CURRENT_DATE - 90",
        "GROUP  BY outlet ORDER BY gmv DESC"
      ],
      out: "100,000+ records · prep time −60%"
    },
    {
      lang: "python",
      code: [
        "prompt = build_extraction_prompt(page)",
        "records = llm.parse(prompt)",
        "clean = normalise(records)",
        "pipeline.run(clean)   # was manual"
      ],
      out: "crawl workflow · ~10 days → ~2 days"
    }
  ],

  /* ------------------------------------------------------- IMPACT IN NUMBERS
     type "count"     -> counts up to `to`
     type "transform" -> renders  from → to                                   */
  metrics: [
    { type: "count", to: 100, suffix: "K+", label: "Records queried",           note: "SQL via DBeaver on Metabase", tone: "data" },
    { type: "count", to: 50,  suffix: "K+", label: "SKUs classified",           note: "Python classification tool",  tone: "ml"   },
    { type: "count", to: 100, suffix: "%",  label: "Classification accuracy",   note: "SKU categorisation",          tone: "ml"   },
    { type: "count", to: 95,  suffix: "%",  label: "ML detection accuracy",     note: "Supervised models, 50K+ rows", tone: "ml"  },
    { type: "count", to: 88,  suffix: "%",  label: "Credit-risk accuracy",      note: "Loan-default classification",  tone: "ml"  },
    { type: "count", to: 60,  suffix: "%",  label: "Faster data preparation",   note: "Replaced a manual process",    tone: "auto" },
    { type: "transform", from: "10", to: "2",  unit: "d", label: "Crawl workflow", note: "Prompt-engineered automation", tone: "auto" },
    { type: "transform", from: "18", to: "2",  unit: "d", label: "SKU processing", note: "Python classification tool",   tone: "auto" },
    { type: "transform", from: "10", to: "1",  unit: "d", label: "Report turnaround", note: "Automated in Advanced Excel", tone: "auto" },
    { type: "count", to: 30,  suffix: "%",  label: "Workflow efficiency gain", note: "GenAI-assisted automation",    tone: "auto" },
    { type: "count", to: 40,  suffix: "%",  label: "Reporting time cut",       note: "SQL & Python pipelines",       tone: "data" },
    { type: "count", to: 50,  suffix: "%",  label: "Evaluation speed gain",    note: "Multi-judge scoring dataset",  tone: "data" },
    { type: "count", to: 8,   suffix: "K+", label: "Sales records modelled",   note: "Power BI star schema",         tone: "biz"  },
    { type: "count", to: 5,   suffix: "+",  label: "Dashboards built",         note: "Nirikshan AI",                 tone: "biz"  }
  ],

  /* ------------------------------------------------------------- THE SPECTRUM
     The site's spine: the full distance from a business problem to a decision.
     Every stage is something Vikash has actually done, with the evidence.    */
  spectrum: {
    intro: "Most people cover part of this. The reason I'm useful is that I've worked every stage of it — the client call at one end and the model at the other.",
    stages: [
      { key: "problem",  n: "01", title: "Business problem",   tone: "biz",
        body: "Someone's revenue, market share or reporting cycle is the actual subject. The dataset is downstream of that.",
        tech: ["Business Analysis", "MIS", "Problem framing"],
        proof: "Analytics point of contact for a leading FMCG/CPG client." },
      { key: "require",  n: "02", title: "Client requirement", tone: "biz",
        body: "Requirement-gathering calls, clarification, and the unglamorous work of turning a vague ask into a spec that can be built.",
        tech: ["Requirement Gathering", "Stakeholder Management", "Client Communication"],
        proof: "Ran requirement discussions and recurring client reviews end to end." },
      { key: "collect",  n: "03", title: "Data collection",    tone: "data",
        body: "Pulling the rows out of wherever they live — warehouse, API, or a site that never intended to be read by a machine.",
        tech: ["SQL", "DBeaver", "Metabase", "BigQuery", "Web crawling", "APIs"],
        proof: "Queried and retrieved 100,000+ records from Metabase." },
      { key: "clean",    n: "04", title: "Data cleaning",      tone: "data",
        body: "Missing values, noise, duplicates and class imbalance — handled before anything downstream is allowed to depend on the data.",
        tech: ["Pandas", "NumPy", "Power Query", "Data Preparation"],
        proof: "Cleaned and preprocessed 50,000+ production-line records." },
      { key: "eda",      n: "05", title: "EDA",                tone: "data",
        body: "Distributions, trends, segments, outliers — and the questions the brief forgot to ask.",
        tech: ["Pandas", "Matplotlib", "Exploratory Data Analysis"],
        proof: "EDA on manufacturing production-line data at Nirikshan AI." },
      { key: "stats",    n: "06", title: "Statistical analysis", tone: "data",
        body: "Testing whether the thing you noticed in the chart is real before anyone spends money on it.",
        tech: ["Statistical Analysis", "Hypothesis Testing", "A/B Testing"],
        proof: "Rule-based scoring logic and statistical analysis on an evaluation dataset." },
      { key: "ml",       n: "07", title: "Machine learning",   tone: "ml",
        body: "Feature engineering, supervised classification, imbalance handling and iterative evaluation — where a model earns its place.",
        tech: ["Scikit-learn", "Decision Trees", "Random Forest", "Gradient Boosting", "XGBoost"],
        proof: "95% detection accuracy on 50,000+ records; 88% on loan-default classification." },
      { key: "viz",      n: "08", title: "Visualization",      tone: "biz",
        body: "Star-schema models, DAX measures and KPI views — built once and refreshed, not rebuilt every cycle.",
        tech: ["Power BI", "Tableau", "DAX", "Matplotlib", "Star Schema"],
        proof: "8,000+ sales records modelled into a q-commerce KPI dashboard." },
      { key: "insight",  n: "09", title: "Business insight",   tone: "biz",
        body: "The sentence a stakeholder repeats in their own meeting. If the analysis can't produce one, it isn't finished.",
        tech: ["Business Intelligence", "Reporting", "Executive-Ready Deliverables"],
        proof: "Presented dashboards, insights and recommendations in recurring client reviews." },
      { key: "auto",     n: "10", title: "Automation / AI",    tone: "auto",
        body: "Once the answer is repeatable, the manual version stops being acceptable. Prompt engineering and LLM tooling do the parts that used to eat days.",
        tech: ["Prompt Engineering", "LLMs", "GenAI", "Workflow Automation", "Python"],
        proof: "Crawling workflow cut from roughly 10 days to roughly 2." },
      { key: "decision", n: "11", title: "Decision",           tone: "auto",
        body: "The only real output. A dashboard nobody decides with is a dashboard that failed.",
        tech: ["Data-driven Decision Making", "Client Presentations"],
        proof: "Feedback and change requests folded back into the next cycle." }
    ]
  },

  /* ------------------------------------------------------------------ SKILLS
     Each domain has an ordered `chain` (animates on open) and a full `items`
     list. Add a skill by adding a string — no code changes needed.          */
  skills: {
    note: "Click a domain to expand it. The chain shows how the pieces actually connect in work, not alphabetically.",
    domains: [
      {
        key: "prog", label: "Programming & data", tone: "data",
        lead: "Where everything starts. Python for anything the query can't hold, SQL for everything else.",
        chain: ["Python", "SQL", "Pandas", "NumPy", "PySpark"],
        items: ["Python", "SQL", "Pandas", "NumPy", "PySpark", "C++", "Jupyter Notebook", "Google Colab"],
        evidence: "Python classification tool across 50,000+ SKUs; SQL across 100,000+ records."
      },
      {
        key: "ml", label: "Machine learning", tone: "ml",
        lead: "Supervised classification and predictive modelling, from feature engineering through to evaluation.",
        chain: ["Decision Trees", "Random Forest", "Gradient Boosting", "XGBoost"],
        items: ["Scikit-learn", "Decision Trees", "Random Forest", "Gradient Boosting", "XGBoost",
                "Classification", "Regression", "Predictive Modeling", "Feature Engineering",
                "Class Imbalance Handling", "PyTorch"],
        evidence: "95% detection accuracy on production-line data; 88% on loan-default prediction."
      },
      {
        key: "ds", label: "Data science & statistics", tone: "data",
        lead: "The part between raw rows and a defensible claim.",
        chain: ["Data Cleaning", "EDA", "Statistical Analysis", "Feature Engineering", "Insight"],
        items: ["Exploratory Data Analysis", "Statistical Analysis", "Hypothesis Testing",
                "A/B Testing & Experimentation", "Data Cleaning", "Data Preparation",
                "Feature Engineering", "Audience Segmentation", "Funnel Optimization"],
        evidence: "Cleaning, preprocessing and EDA on 50,000+ manufacturing records."
      },
      {
        key: "ai", label: "AI / GenAI & automation", tone: "auto",
        lead: "Using LLMs as a build tool, not a novelty — to remove the manual step from a repeating process.",
        chain: ["Prompt Engineering", "LLMs", "AI-assisted automation", "Workflow automation"],
        items: ["Prompt Engineering", "Generative AI", "LLM tooling", "Claude",
                "AI-assisted automation", "Workflow Automation", "Data Automation",
                "Web / data crawling", "Code automation"],
        evidence: "Crawling workflow from ~10 days to ~2; 30% efficiency gain across Excel and reporting."
      },
      {
        key: "viz", label: "Visualization & BI", tone: "biz",
        lead: "Modelling first, chart second. A dashboard is a data model with a face.",
        chain: ["Data model", "Measures", "KPI view", "Decision"],
        items: ["Power BI", "Tableau", "Metabase", "Matplotlib", "DAX", "Power Query",
                "Advanced Excel", "Star Schema", "Data Modeling", "Automated Dashboards"],
        evidence: "8,000+ sales records modelled into a q-commerce performance dashboard."
      },
      {
        key: "db", label: "Databases & querying", tone: "data",
        lead: "Getting exactly the rows the question needs, at the size the question needs them.",
        chain: ["Source", "Query", "Join & aggregate", "Extract"],
        items: ["SQL", "MySQL", "Google BigQuery", "DBeaver", "Metabase", "Joins & aggregation", "Query optimisation"],
        evidence: "Replaced a manual extract process, cutting data-preparation time by 60%."
      },
      {
        key: "biz", label: "Business & client", tone: "biz",
        lead: "The reason the technical work lands. I can hold the client call and write the query.",
        chain: ["Client requirement", "Business understanding", "Analysis", "Insight", "Decision"],
        items: ["Business Analysis", "MIS", "Requirement Gathering", "Client Handling & Communication",
                "Stakeholder Management", "Client Presentations & Reviews", "Reporting", "Dashboarding",
                "Business Intelligence", "Data-driven Decision Making", "Executive-Ready Deliverables"],
        evidence: "Primary analytics point of contact for a leading FMCG/CPG client."
      },
      {
        key: "cloud", label: "Cloud & environment", tone: "auto",
        lead: "Where the work runs when it isn't running on my laptop.",
        chain: ["Notebook", "Warehouse", "Cloud"],
        items: ["AWS", "Google BigQuery", "Google Colab", "Jupyter Notebook"],
        evidence: "Notebook-first development; BigQuery and cloud warehouse querying."
      }
    ]
  },

  /* -------------------------------------------------------------- EXPERIENCE
     Two roles, two deliberately different visual treatments.
     `visual` selects which storytelling module renders inside the card.      */
  experience: [
    {
      id: "ods",
      company: "1DigitalStack",
      /* Brief called this "One Digital Stack" — same company, trading name kept. */
      title: "Business Analyst / MIS Executive",
      period: "Apr 2026 — Present",
      year: "2026",
      current: true,
      tone: "biz",
      visual: "business",
      focus: ["Business analytics", "Client handling", "Automation", "GenAI"],
      context: "E-commerce and quick-commerce analytics for a leading FMCG/CPG client. Analytics point of contact, not a reporting desk.",
      points: [
        "Primary analytics point of contact for the client — requirement-gathering discussions, clarification calls and day-to-day communication, translating business questions into reporting and analysis specifications.",
        "Presented dashboards, insights and recommendations to client stakeholders in recurring reviews, managing feedback, change requests and delivery timelines.",
        "Owned recurring and ad-hoc analytical reporting on e-commerce and q-commerce data — sales, market share and product performance trends.",
        "Queried and retrieved 100,000+ records from Metabase using SQL through DBeaver, replacing a manual process and cutting data-preparation time by 60%.",
        "Built automated dashboards and reports in Advanced Excel, reducing client reporting turnaround from 10 days to 1 day.",
        "Designed a Python-based classification automation tool that categorised 50,000+ SKUs with 100% accuracy, reducing processing time from 18 days to 2 days.",
        "Developed a Python and API web crawler that extracted and auto-classified e-commerce data, replacing a multi-day manual workflow.",
        "Applied prompt engineering and GenAI/LLM tooling to build code and automations, boosting efficiency by 30% across Excel and reporting workflows."
      ],
      /* The client-translation chain — the differentiator, visualised. */
      chain: ["Client requirement", "Business understanding", "Data analysis", "Technical solution", "Business insight"],
      /* The automation headline, rendered as a shrinking bar. */
      automation: {
        label: "Crawling workflow, after prompt-engineered automation",
        fromValue: 10, toValue: 2, unit: "days",
        via: "Prompt engineering · LLM tooling · Python",
        caveat: "Approximate, as reported by me."
      },
      kpis: [
        { v: "100K+", l: "records queried" },
        { v: "60%",   l: "faster prep" },
        { v: "50K+",  l: "SKUs classified" },
        { v: "30%",   l: "efficiency gain" }
      ],
      tags: ["SQL", "DBeaver", "Metabase", "Python", "Pandas", "Advanced Excel", "Prompt Engineering", "GenAI/LLM", "Web crawling", "Client handling"]
    },
    {
      id: "nai",
      /* ⚠️ CONFIRM: your brief said "Direction AI". The resume and the previous
         site said "Nirikshan AI", and Nirikshan AI Pvt Ltd is a real Indian
         computer-vision/AI company, so that is what is shown. If the brief was
         right, change this one line. */
      company: "Nirikshan AI",
      title: "Data Analyst",
      period: "Jan 2025 — Apr 2026",
      year: "2025",
      current: false,
      tone: "data",
      visual: "analytics",
      focus: ["Data analysis", "EDA", "Machine learning", "Pipelines"],
      context: "Analytics, data pipelines and supervised models on manufacturing production-line and evaluation data.",
      points: [
        "Built SQL and Python data pipelines and developed 5+ analytics dashboards, cutting manual reporting time by 40%, working with cross-functional teams and client-side contacts on model evaluation and delivery.",
        "Cleaned, preprocessed and performed exploratory data analysis with Python, Pandas, NumPy and Matplotlib on 50,000+ records from a manufacturing partner's production lines.",
        "Engineered features and built supervised classification models (Decision Tree, Random Forest), handling missing values, noise and class imbalance, reaching 95% detection accuracy on 50,000+ records.",
        "Created and structured a multi-judge scoring dataset for a real-time evaluation platform, applying statistical analysis and rule-based scoring logic to automate rankings and improve evaluation speed by 50%."
      ],
      /* The analyst chain — animated as a data table cleaning itself. */
      chain: ["Raw data", "Cleaning", "Exploration", "Analysis", "Visualization", "Insight"],
      kpis: [
        { v: "50K+", l: "records analysed" },
        { v: "95%",  l: "detection accuracy" },
        { v: "5+",   l: "dashboards" },
        { v: "40%",  l: "less manual reporting" }
      ],
      tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Scikit-learn", "Decision Trees", "Random Forest", "SQL", "EDA", "Statistical Analysis"]
    }
  ],

  /* ---------------------------------------------------------------- PROJECTS */
  projects: [
    {
      id: "credit-risk",
      name: "Credit Risk Analysis & Prediction",
      kind: "Machine learning",
      tone: "ml",
      origin: "Self-directed",
      blurb: "Supervised models predicting customer credit risk and loan default, built around interpretable risk-scoring features so every prediction can be explained.",
      headline: { value: "88%", label: "prediction accuracy" },
      tech: ["Python", "Scikit-learn", "Pandas", "NumPy", "XGBoost"],
      chart: "accuracy",
      chartValue: 88,
      chartLabel: "loan-default classification",
      stages: ["Data", "Feature engineering", "Model", "Evaluation", "Prediction"],
      detail: {
        problem: "Predict customer credit risk and loan default in a way that supports lending decisions — where a prediction nobody can explain is not usable.",
        dataset: "Loan applicant records with demographic, financial and repayment-history attributes.",
        approach: "Built and evaluated supervised classification models, engineering interpretable risk-scoring variables so each prediction traces back to the factors driving it. Improved through iterative evaluation and hyperparameter tuning.",
        models: ["Decision Trees", "Random Forest", "Gradient Boosting", "XGBoost"],
        result: "88% prediction accuracy on loan-default classification.",
        impact: "Demonstrates the full classification workflow: imbalance handling, interpretable features, and a metric that maps to a real lending decision."
      },
      repo: "" // EDITABLE — paste a GitHub URL and a repo button appears
    },
    {
      id: "blinkit",
      name: "Blinkit Sales Performance Dashboard",
      kind: "Business intelligence",
      tone: "biz",
      origin: "Personal project",
      blurb: "Quick-commerce retail analytics dashboard covering revenue, outlet and category performance, built on a star-schema model rather than a flat export.",
      headline: { value: "8,000+", label: "sales records modelled" },
      tech: ["Power BI", "DAX", "SQL", "Power Query"],
      chart: "bars",
      stages: ["SQL extract", "Power Query", "Star schema", "DAX measures", "KPI dashboard"],
      detail: {
        problem: "Give stakeholders one place to see how a quick-commerce retail business is performing, instead of a rebuilt spreadsheet every reporting cycle.",
        dataset: "8,000+ q-commerce sales records across outlets, categories and time.",
        approach: "Modelled the records with a star schema and shaped them in Power Query, then built KPI views on top for trend analysis and decision support.",
        models: ["Star schema modelling", "DAX measures", "Power Query transformations"],
        result: "KPI dashboards enabling trend analysis and decision support across revenue, outlet and category performance.",
        impact: "Turns a recurring manual reporting job into a refreshable model."
      },
      repo: "" // EDITABLE
    },
    {
      id: "sku-classifier",
      name: "SKU Classification Automation",
      kind: "Automation · Machine learning",
      tone: "auto",
      origin: "Built at 1DigitalStack",
      blurb: "Python tool that categorises e-commerce SKUs automatically, replacing an 18-day manual classification cycle.",
      headline: { value: "50,000+", label: "SKUs classified" },
      tech: ["Python", "Pandas", "Classification", "Prompt Engineering"],
      chart: "shrink",
      shrink: { from: 18, to: 2, unit: "days" },
      stages: ["Crawl / extract", "Normalise", "Classify", "Validate", "Publish"],
      detail: {
        problem: "SKU categorisation across large e-commerce catalogues was manual, slow and the bottleneck in front of every downstream report.",
        dataset: "50,000+ e-commerce SKU records with unstructured product attributes.",
        approach: "Built a Python classification tool, paired with a Python and API web crawler that extracted and auto-classified e-commerce data. Prompt engineering and LLM tooling were used to build and refine the automation itself.",
        models: ["Rule and feature-based classification", "Automated validation"],
        result: "50,000+ SKUs categorised with 100% accuracy; processing time reduced from 18 days to 2 days.",
        impact: "Removed a multi-week manual step from the reporting cycle. The related crawling workflow moved from roughly 10 days to roughly 2."
      },
      repo: "" // EDITABLE
    }
  ],

  /* ------------------------------------------------- ADDITIONAL KNOWLEDGE
     Explicitly separated from professional experience. Self-taught areas.   */
  knowledge: {
    note: "Studied independently — courses, documentation and YouTube — and applied in personal projects. Listed separately from professional experience on purpose.",
    areas: [
      { title: "Credit risk analysis", tone: "ml",
        body: "Risk scoring, default probability and the classification framing behind lending decisions. Applied in the Credit Risk project.",
        tags: ["Credit Risk", "Risk Analysis", "Classification", "Predictive Modeling", "Feature Engineering"],
        link: "credit-risk" },
      { title: "Deep learning foundations", tone: "ml",
        body: "Working knowledge of PyTorch and neural network fundamentals, carried over from a Robotics and AI degree.",
        tags: ["PyTorch", "Neural Networks", "Deep Learning"],
        link: "" },
      { title: "Distributed data processing", tone: "data",
        body: "PySpark for datasets past the point where a single-machine Pandas workflow is the right tool.",
        tags: ["PySpark", "Distributed processing"],
        link: "" }
    ]
  },

  /* ------------------------------------------------------------- ML SECTION */
  ml: {
    note: "A visual representation of how I think about model workflow — not a live deployment.",
    layers: ["Input data", "Features", "Model", "Prediction"],
    tags: ["Decision Tree", "Random Forest", "Gradient Boosting", "XGBoost", "Classification", "Feature Engineering"],
    body: "Feature engineering, supervised classification, class-imbalance handling and iterative evaluation — applied to production-line detection at Nirikshan AI and loan-default prediction in the credit risk project."
  },

  /* -------------------------------------------------------------- EDUCATION */
  education: {
    degree: "B.Tech, Robotics and Artificial Intelligence",
    period: "2021 — 2025",
    school: "J.C. Bose University of Science and Technology, YMCA",
    location: "Faridabad, Haryana"
  },

  /* CERTIFICATIONS — only what can be verified. LinkedIn blocks automated
     reading, so nothing was added from it. Add more here as needed:
     { name: "...", issuer: "...", year: "...", url: "..." }                 */
  certifications: [
    { name: "Data Analysis with Python", issuer: "freeCodeCamp", tone: "data",
      focus: ["Pandas", "NumPy", "Data cleaning", "Analysis"], url: "" },
    { name: "Relational Database (SQL)", issuer: "freeCodeCamp", tone: "data",
      focus: ["SQL", "Schema design", "Joins", "Querying"], url: "" }
  ],

  /* ------------------------------------------------------------ BEYOND DATA
     `map` is the pairing shown on hover/expand: creative practice → the
     thinking it trains that shows up in the technical work.                  */
  beyond: {
    lead: "The same instinct that makes me pull a dataset apart makes me pull other things apart too.",
    tiles: [
      { key: "artist",   role: "Artist",   craft: "Painting & drawing",
        map: "Visual thinking",
        line: "Learning to see what's actually there instead of what you expect — which is the entire job in exploratory analysis." },
      { key: "composer", role: "Composer", craft: "Music & composition",
        map: "Structure & pattern",
        line: "Structure, repetition and timing. Same instincts as a well-built model, different medium." },
      { key: "chef",     role: "Chef",     craft: "Cooking",
        map: "Experimentation",
        line: "Change one variable, taste, iterate. Cooking is hypothesis testing you're allowed to eat." },
      { key: "creator",  role: "Creator",  craft: "Animation & writing",
        map: "Storytelling",
        line: "A chart nobody can read is a chart nobody uses. Animation teaches you to sequence an idea." }
    ]
  },

  /* ------------------------------------------------------ TERMINAL EASTER EGG */
  terminal: {
    user: "vikash",
    host: "portfolio",
    boot: "analyze --profile",
    profile: [
      ["Role",   "Data Scientist / Data Analyst"],
      ["Core",   "Python · SQL · Scikit-learn"],
      ["Focus",  "ML · Analytics · AI automation"],
      ["Domain", "E-commerce & quick-commerce"]
    ]
  },

  /* --------------------------------------------------------------------- SEO */
  seo: {
    title: "Vikash Maharaj — Data Scientist & Data Analyst",
    description:
      "Data Scientist and Data Analyst working across Python, SQL, machine learning, business analytics and AI automation. Supervised classification, e-commerce analytics, BI dashboards and prompt-engineered workflow automation.",
    url: "https://vikashmaharaj.github.io/portfolio/", // EDITABLE — set to your live URL
    ogImage: "og-image.png"                            // EDITABLE
  }
};
