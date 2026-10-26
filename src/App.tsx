import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type Screen =
  | "welcome"
  | "language"
  | "location"
  | "home"
  | "report"
  | "confirmation"
  | "tracking"
  | "reports"
  | "village"
  | "profile";

type Report = {
  id: string;
  category: string;
  description: string;
  location: string;
  createdAt: string;
  status: "Submitted" | "In Progress";
  photo?: string;
  photoName?: string;
  isSample?: boolean;
};

const sampleReport: Report = {
  id: "DEMO-1001",
  category: "Pothole",
  description: "Sample pothole complaint created only to demonstrate the report tracking experience.",
  location: "Sample Location — DEMO ONLY",
  createdAt: "01 Jan 2025 — DEMO DATE",
  status: "In Progress",
  isSample: true,
};

const categories = [
  ["Pothole", "road"],
  ["Garbage", "trash"],
  ["Drainage", "drop"],
  ["Water Supply", "water"],
  ["Streetlight", "sun"],
  ["Other", "dots"],
];

const dashboardCards = [
  ["Village Information", "Local overview and essentials", "village"],
  ["Schools & Facilities", "Verified civic facilities", "school"],
  ["Development Works", "Projects and progress", "works"],
  ["Public Representatives", "Verified public contacts", "people"],
  ["Government Schemes", "Explore citizen schemes", "file"],
  ["Public Records", "Open public information", "records"],
];

const icons: Record<string, ReactNode> = {
  home: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v10h13V10M9 20v-6h6v6" /></>,
  pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  alert: <><path d="M12 3v10M12 18v.01" /><circle cx="12" cy="12" r="10" /></>,
  report: <><path d="M6 3h9l4 4v14H6z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" /></>,
  village: <><path d="M3 21h18M5 21v-9l7-5 7 5v9M9 21v-5h6v5" /><path d="M3 9h4M17 9h4" /></>,
  school: <><path d="m3 9 9-5 9 5-9 5zM6 11.5V18h12v-6.5M10 18v-4h4v4" /></>,
  works: <><path d="m14 5 5 5M12 7l5-5 5 5-5 5M3 21l8-8M5 14l5 5" /></>,
  people: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6M15 15c3.5 0 5.5 1.7 6 5" /></>,
  file: <><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h6M9 16h6" /></>,
  records: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  road: <><path d="M8 3 5 21M16 3l3 18M12 4v4M12 12v3M12 19v2" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" /></>,
  drop: <path d="M12 3s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12Z" />,
  water: <><path d="M4 12h16M7 12V8h7a3 3 0 0 1 3 3v1M4 16c1.3 0 1.3 2 2.7 2s1.3-2 2.6-2 1.4 2 2.7 2 1.3-2 2.7-2 1.3 2 2.6 2S18.7 16 20 16" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></>,
  dots: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  camera: <><path d="M4 7h4l2-3h4l2 3h4v13H4z" /><circle cx="12" cy="13" r="4" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  arrow: <path d="m9 18 6-6-6-6" />,
  back: <path d="m15 18-6-6 6-6" />,
};

function Icon({ name, size = 22 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function Logo({ large = false }: { large?: boolean }) {
  return (
    <div className={`logo ${large ? "logo-large" : ""}`} aria-label="Apni Mitti sprout logo">
      <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <circle className="logo-ring" cx="40" cy="40" r="36" />
        <circle className="logo-halo" cx="40" cy="40" r="29" />
        <path className="logo-stem" d="M40 52V30" />
        <path className="logo-leaf" d="M40 39c-8 0-13-5-13-14 8 0 13 5 13 14ZM40 34c7 0 12-4 12-12-7 0-12 4-12 12Z" />
        <path className="logo-soil" d="M20 54c12-5 28-5 40 0M24 60c10-3 22-3 32 0" />
      </svg>
    </div>
  );
}

function PageHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <header className="page-header">
      {onBack ? <button className="icon-button" onClick={onBack} aria-label="Go back"><Icon name="back" /></button> : <Logo />}
      <strong>{title}</strong>
      <div className="header-spacer" />
    </header>
  );
}

function DemoBanner() {
  return (
    <div className="demo-banner" role="note">
      <strong>DEMO DATA — NOT VERIFIED</strong>
      <span>Prototype demonstration only. Reports are not sent to government departments.</span>
    </div>
  );
}

function BottomNav({ active, go }: { active: string; go: (s: Screen) => void }) {
  const items: [string, string, Screen][] = [
    ["Home", "home", "home"],
    ["FixMyArea", "alert", "report"],
    ["My Reports", "report", "reports"],
    ["Profile", "user", "profile"],
  ];
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map(([label, icon, screen]) => (
        <button key={label} className={active === screen ? "active" : ""} onClick={() => go(screen)}>
          <Icon name={icon} size={21} /><span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem("apni-language") || "मराठी"; }
    catch { return "मराठी"; }
  });
  const [location, setLocation] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("apni-location") || "null");
      return saved && typeof saved === "object" ? saved : { state: "", district: "", taluka: "", village: "" };
    }
    catch { return { state: "", district: "", taluka: "", village: "" }; }
  });
  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("apni-reports") || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch { return []; }
  });
  const [activeReport, setActiveReport] = useState<Report | null>(null);

  useEffect(() => {
    try { localStorage.setItem("apni-language", language); } catch { /* Keep the live demo usable when storage is blocked. */ }
  }, [language]);
  useEffect(() => {
    try { localStorage.setItem("apni-location", JSON.stringify(location)); } catch { /* Keep the live demo usable when storage is blocked. */ }
  }, [location]);
  useEffect(() => {
    try { localStorage.setItem("apni-reports", JSON.stringify(reports)); } catch { /* Large photos may exceed browser storage; the in-session report still works. */ }
  }, [reports]);

  const go = (next: Screen) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setScreen(next);
  };

  if (screen === "welcome") return <Welcome onContinue={() => go("language")} />;
  if (screen === "language") return <Language value={language} onChange={setLanguage} onContinue={() => go("location")} onBack={() => go("welcome")} />;
  if (screen === "location") return <Location value={location} onChange={setLocation} onContinue={() => go("home")} onBack={() => go("language")} />;
  if (screen === "home") return <Home location={location} go={go} />;
  if (screen === "report") return <ReportForm location={location} onBack={() => go("home")} onSubmit={(report) => { setReports((old) => [report, ...old]); setActiveReport(report); go("confirmation"); }} />;
  if (screen === "confirmation" && activeReport) return <Confirmation report={activeReport} track={() => go("tracking")} reports={() => go("reports")} home={() => go("home")} />;
  if (screen === "tracking" && activeReport) return <Tracking report={activeReport} onBack={() => go("reports")} />;
  if (screen === "reports") return <MyReports reports={reports} go={go} open={(report) => { setActiveReport(report); go("tracking"); }} />;
  if (screen === "village") return <Village location={location} onBack={() => go("home")} />;
  return <Profile language={language} location={location} go={go} />;
}

function Welcome({ onContinue }: { onContinue: () => void }) {
  return (
    <main className="welcome">
      <div className="welcome-inner">
        <Logo large />
        <div className="eyebrow">नमस्ते 🙏</div>
        <div className="namaste">NAMASTE</div>
        <h1>APNI MITTI</h1>
        <p className="welcome-marathi">आपलं गाव, आपली माती,<br />आपला विकास</p>
        <button className="primary-button welcome-button" onClick={onContinue}>आगे बढ़ें <span>|</span> Continue <Icon name="arrow" size={18} /></button>
      </div>
      <p className="disclaimer">A community prototype · Not affiliated with any government body</p>
    </main>
  );
}

function Language({ value, onChange, onContinue, onBack }: { value: string; onChange: (v: string) => void; onContinue: () => void; onBack: () => void }) {
  return (
    <main className="setup-page">
      <PageHeader title="Choose language" onBack={onBack} />
      <section className="setup-content">
        <div className="step-label">STEP 1 OF 2</div>
        <h1>आपली भाषा निवडा</h1>
        <p>Select a language for your experience.</p>
        <div className="option-list">
          {["मराठी", "हिन्दी", "English"].map((item) => (
            <button key={item} className={`select-option ${value === item ? "selected" : ""}`} onClick={() => onChange(item)}>
              <span>{item}</span><span className="radio">{value === item && <span />}</span>
            </button>
          ))}
        </div>
        <button className="primary-button" onClick={onContinue}>Continue <Icon name="arrow" size={18} /></button>
      </section>
    </main>
  );
}

function Location({ value, onChange, onContinue, onBack }: { value: Record<string, string>; onChange: (v: Record<string, string>) => void; onContinue: () => void; onBack: () => void }) {
  const fields = [
    ["state", "State", ["Maharashtra"]],
    ["district", "District", ["Nashik"]],
    ["taluka", "Taluka", ["Chandvad"]],
    ["village", "Village", ["Sample Village — Demo"]],
  ];
  const complete = fields.every(([key]) => value[key]);
  return (
    <main className="setup-page">
      <PageHeader title="Set your location" onBack={onBack} />
      <section className="setup-content">
        <div className="step-label">STEP 2 OF 2</div>
        <h1>तुमचं गाव निवडा</h1>
        <p>This helps us show information relevant to your area.</p>
        <div className="location-path">
          {fields.map(([key, label, options], index) => {
            const enabled = index === 0 || Boolean(value[fields[index - 1][0]]);
            return (
              <label key={key} className={!enabled ? "disabled" : ""}>
                <span>{label}{label === "Village" && <small>Sample choice</small>}</span>
                <select disabled={!enabled} value={value[key]} onChange={(e) => {
                  const next = { ...value, [key]: e.target.value };
                  fields.slice(index + 1).forEach(([future]) => next[future] = "");
                  onChange(next);
                }}>
                  <option value="">Select {label}</option>
                  {options.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            );
          })}
        </div>
        <div className="info-note">Pilot selections only. Village choice is sample data, not a verified directory.</div>
        <button className="primary-button" disabled={!complete} onClick={onContinue}>Go to dashboard <Icon name="arrow" size={18} /></button>
      </section>
    </main>
  );
}

function Home({ location, go }: { location: Record<string, string>; go: (s: Screen) => void }) {
  const [query, setQuery] = useState("");
  const visibleCards = dashboardCards.filter(([title, text]) => `${title} ${text}`.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <main className="app-page with-nav">
      <div className="app-shell">
        <header className="home-header">
          <div><span className="hello">नमस्ते 🙏</span><div className="current-location"><Icon name="pin" size={16} /> {location.village || "Sample Village"}, {location.taluka || "Chandvad"}</div></div>
          <Logo />
        </header>
        <DemoBanner />
        <div className="search"><Icon name="search" size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search village services" placeholder="Search village services..." /></div>
        <button className="fix-card" onClick={() => go("report")}>
          <span className="fix-icon"><Icon name="alert" size={27} /></span>
          <span><strong>FixMyArea</strong><small>Report a civic issue in your area</small></span>
          <Icon name="arrow" />
        </button>
        <div className="section-heading"><h2>Explore your village</h2><span>Verified updates when available</span></div>
        <div className="dashboard-grid">
          {visibleCards.map(([title, text, icon], index) => (
            <button key={title} className="dashboard-card" onClick={() => index === 0 ? go("village") : go("village")}>
              <span className="card-icon"><Icon name={icon} /></span>
              <strong>{title}</strong><small>{text}</small><span className="card-arrow"><Icon name="arrow" size={17} /></span>
            </button>
          ))}
        </div>
        {visibleCards.length === 0 && <div className="search-empty" role="status">No matching village services found.</div>}
      </div>
      <BottomNav active="home" go={go} />
    </main>
  );
}

function ReportForm({ location, onBack, onSubmit }: { location: Record<string, string>; onBack: () => void; onSubmit: (r: Report) => void }) {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [error, setError] = useState("");
  const place = `${location.village || "Sample Village"}, ${location.taluka || "Chandvad"}, ${location.district || "Nashik"}`;
  const [reportedLocation, setReportedLocation] = useState(place);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!category || description.trim().length < 10 || !reportedLocation.trim()) {
      setError(
        !category
          ? "Please select an issue category."
          : description.trim().length < 10
            ? "Please add at least 10 characters of detail."
            : "Please enter the issue location.",
      );
      return;
    }
    const uniquePart = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.slice(-8).toUpperCase();
    const id = `FMA-DEMO-${uniquePart}`;
    onSubmit({
      id,
      category,
      description: description.trim(),
      location: reportedLocation.trim(),
      createdAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      status: "Submitted",
      photo,
      photoName,
    });
  };
  return (
    <main className="app-page">
      <div className="app-shell">
        <PageHeader title="Report an issue" onBack={onBack} />
        <DemoBanner />
        <form className="report-form" onSubmit={submit}>
          <div className="form-intro"><h1>What needs attention?</h1><p>Your report stays on this device for prototype demonstration.</p></div>
          <fieldset><legend>Choose category <em>*</em></legend>
            <div className="category-grid">
              {categories.map(([label, icon]) => <button type="button" key={label} className={category === label ? "selected" : ""} onClick={() => { setCategory(label); setError(""); }}><Icon name={icon} /><span>{label}</span></button>)}
            </div>
          </fieldset>
          <label className="field"><span>Description <em>*</em></span><textarea value={description} onChange={(e) => { setDescription(e.target.value); setError(""); }} maxLength={400} placeholder="Describe the issue and nearby landmark..." /><small>{description.length}/400</small></label>
          <label className="photo-upload"><Icon name="camera" /><span><strong>Add a photo</strong><small>Optional · JPG or PNG, up to 1 MB</small></span><input type="file" accept="image/jpeg,image/png" onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 1024 * 1024) {
              setPhoto("");
              setPhotoName("");
              setError("Please choose a photo smaller than 1 MB.");
              return;
            }
            const reader = new FileReader();
            reader.onload = () => {
              setPhoto(String(reader.result || ""));
              setPhotoName(file.name);
              setError("");
            };
            reader.onerror = () => setError("The photo could not be read. Please try another file.");
            reader.readAsDataURL(file);
          }} /> <b>{photoName || "Choose"}</b></label>
          {photo && <div className="photo-preview"><img src={photo} alt="Selected issue preview" /><span><Icon name="check" size={15} /> Photo ready</span></div>}
          <label className="field"><span>Issue location <em>*</em></span><div className="location-input"><Icon name="pin" size={18} /><input value={reportedLocation} onChange={(e) => { setReportedLocation(e.target.value); setError(""); }} aria-label="Issue location" placeholder="Enter area or nearby landmark" /></div></label>
          {error && <div className="form-error" role="alert" aria-live="assertive">{error}</div>}
          <button className="primary-button" type="submit">Submit Report <Icon name="arrow" size={18} /></button>
          <p className="form-disclaimer">Prototype demonstration only. Reports are not sent to government departments.</p>
        </form>
      </div>
    </main>
  );
}

function Confirmation({ report, track, reports, home }: { report: Report; track: () => void; reports: () => void; home: () => void }) {
  return (
    <main className="result-page">
      <div className="result-card">
        <div className="success-mark"><Icon name="check" size={42} /></div>
        <div className="step-label" role="status" aria-live="polite">REPORT SAVED LOCALLY</div>
        <h1>Thank you for speaking up.</h1>
        <p>Your demo report has been added to My Reports.</p>
        <div className="tracking-id"><span>DEMO TRACKING ID</span><strong>{report.id}</strong><small>This is not an official government reference number.</small></div>
        <button className="primary-button" onClick={track}>Track this report <Icon name="arrow" size={18} /></button>
        <button className="secondary-button result-secondary" onClick={reports}>Open My Reports</button>
        <button className="text-button" onClick={home}>Back to dashboard</button>
      </div>
    </main>
  );
}

function Tracking({ report, onBack }: { report: Report; onBack: () => void }) {
  const steps = ["Submitted", "Under Review", "In Progress", "Resolved"];
  const currentStep = report.status === "In Progress" ? 2 : 0;
  return (
    <main className="app-page">
      <div className="app-shell">
        <PageHeader title="Report details" onBack={onBack} />
        <DemoBanner />
        <section className="tracking-content">
          <div className="report-summary">
            <div><span className="category-pill">{report.category}</span><h1>{report.category} report</h1><p><Icon name="pin" size={15} /> {report.location}</p></div>
            <span className="date">{report.createdAt}</span>
          </div>
          {report.isSample && <div className="sample-warning">DEMO DATA — NOT A REAL COMPLAINT</div>}
          <div className="id-row"><span>Demo tracking ID</span><strong>{report.id}</strong></div>
          <div className="timeline-label">SIMULATED STATUS TIMELINE</div>
          <div className="timeline">
            {steps.map((step, index) => <div className={index <= currentStep ? "done" : ""} key={step}><span>{index <= currentStep ? <Icon name="check" size={16} /> : index + 1}</span><div><strong>{step}{index === currentStep && " — SIMULATED"}</strong><small>{index === 0 ? `Created ${report.createdAt}` : index <= currentStep ? "Simulated progress update" : "Awaiting demo update"}</small></div></div>)}
          </div>
          <div className="description-card"><span>Description</span><p>{report.description}</p></div>
          {report.photo && <div className="report-photo"><span>Attached photo</span><img src={report.photo} alt={`Attached evidence for ${report.category} report`} /><small>{report.photoName}</small></div>}
          <div className="warning-note"><strong>Prototype notice</strong> Prototype demonstration only. Reports are not sent to government departments.</div>
        </section>
      </div>
    </main>
  );
}

function MyReports({ reports, go, open }: { reports: Report[]; go: (s: Screen) => void; open: (r: Report) => void }) {
  return (
    <main className="app-page with-nav">
      <div className="app-shell">
        <PageHeader title="My Reports" />
        <DemoBanner />
        <section className="reports-content">
          <div className="sample-section">
            <div className="sample-heading"><span>JUDGE DEMO EXAMPLE</span><strong>See tracking in action</strong></div>
            <button className="sample-report" onClick={() => open(sampleReport)}>
              <span className="card-icon"><Icon name="road" /></span>
              <span><strong>Pothole</strong><small>Sample Location — DEMO ONLY</small><em>DEMO-1001</em></span>
              <span className="sample-status">In Progress · Simulated</span>
              <Icon name="arrow" size={18} />
            </button>
            <div className="sample-warning">DEMO DATA — NOT A REAL COMPLAINT</div>
          </div>
          <div className="section-heading"><h1>Your reports</h1><span>{reports.length} saved locally</span></div>
          {reports.length === 0 ? <div className="empty-state"><span><Icon name="report" size={34} /></span><h2>No reports yet</h2><p>Report a local issue to see it here.</p><button className="primary-button" onClick={() => go("report")}>Create a report</button></div>
          : <div className="report-list">{reports.map((report) => <button key={report.id} onClick={() => open(report)}><span className="card-icon"><Icon name={categories.find(([c]) => c === report.category)?.[1] || "dots"} /></span><span><strong>{report.category}</strong><small>{report.location}</small><em>{report.id}</em></span><span className="status-pill">Demo · Submitted</span><Icon name="arrow" size={18} /></button>)}</div>}
        </section>
      </div>
      <BottomNav active="reports" go={go} />
    </main>
  );
}

function Village({ location, onBack }: { location: Record<string, string>; onBack: () => void }) {
  const sections = [
    ["Overview", "village"], ["Facilities", "school"], ["Projects", "works"], ["Representatives", "people"], ["Schemes", "file"], ["Public records", "records"],
  ];
  return (
    <main className="app-page">
      <div className="app-shell">
        <PageHeader title="Village profile" onBack={onBack} />
        <div className="village-hero">
          <div className="landscape" aria-hidden="true"><span className="sun-disc" /><span className="hill hill-one" /><span className="hill hill-two" /><span className="house" /></div>
          <DemoBanner />
          <div><span className="step-label">PILOT LOCATION</span><h1>{location.village || "Sample Village"}</h1><p><Icon name="pin" size={16} /> {location.taluka || "Chandvad"}, {location.district || "Nashik"}, Maharashtra</p></div>
        </div>
        <section className="village-content">
          <p className="profile-intro">A single place for trusted village information. Content appears only after it is verified.</p>
          <div className="profile-grid">
            {sections.map(([title, icon]) => <article key={title}><span className="card-icon"><Icon name={icon} /></span><div><h2>{title}</h2><p>Verified information not available yet.</p></div></article>)}
          </div>
        </section>
      </div>
    </main>
  );
}

function Profile({ language, location, go }: { language: string; location: Record<string, string>; go: (s: Screen) => void }) {
  return (
    <main className="app-page with-nav">
      <div className="app-shell">
        <PageHeader title="Profile" />
        <section className="profile-page">
          <Logo large />
          <h1>Prototype preferences</h1>
          <div className="preference"><span>Language</span><strong>{language}</strong></div>
          <div className="preference"><span>Location</span><strong>{location.village || "Not selected"}</strong></div>
          <button className="secondary-button" onClick={() => go("language")}>Change language or location</button>
          <p>APNI MITTI is a hackathon prototype and is not affiliated with or endorsed by any government authority.</p>
        </section>
      </div>
      <BottomNav active="profile" go={go} />
    </main>
  );
}
