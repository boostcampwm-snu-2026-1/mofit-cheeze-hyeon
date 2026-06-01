import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card, CardHeader, CardBody, CardFooter,
  Input,
  Badge,
  Display, DisplayAlt, Heading, SubHeading, CardTitle, BodyLarge, Body, Caption,
} from "@ui";

const SECTIONS = [
  "Colors",
  "Typography",
  "Buttons",
  "Cards",
  "Inputs",
  "Badges",
  "Elevation",
  "Spacing",
] as const;

type Section = (typeof SECTIONS)[number];

// ─── Color Swatches ─────────────────────────────────────────────────────────

const colorTokens = [
  { name: "Cream", value: "#f7f4ed", role: "Page background, card surfaces", text: "#1c1c1c" },
  { name: "Charcoal", value: "#1c1c1c", role: "Primary text, dark buttons", text: "#fcfbf8" },
  { name: "Off-White", value: "#fcfbf8", role: "Button text on dark", text: "#1c1c1c" },
  { name: "Muted", value: "#5f5f5d", role: "Secondary text, captions", text: "#fcfbf8" },
  { name: "Border", value: "#eceae4", role: "Card borders, dividers", text: "#1c1c1c" },
];

const opacityTokens = [
  { name: "Charcoal 83%", value: "rgba(28,28,28,0.83)", hex: "≈ #333", role: "Strong secondary text" },
  { name: "Charcoal 40%", value: "rgba(28,28,28,0.40)", hex: "≈ #8f8f8f", role: "Interactive borders" },
  { name: "Charcoal 4%", value: "rgba(28,28,28,0.04)", hex: "≈ #f5f5f5", role: "Hover tint" },
  { name: "Charcoal 3%", value: "rgba(28,28,28,0.03)", hex: "≈ #f7f7f7", role: "Subtle overlay" },
];

// ─── Typography specimens ───────────────────────────────────────────────────

const typeScaleRows = [
  { label: "Display Hero", size: "60px", weight: "600", tracking: "-1.5px", lh: "1.05", el: "h1" },
  { label: "Display Alt", size: "60px", weight: "400", tracking: "normal", lh: "1.00", el: "h1" },
  { label: "Section Heading", size: "48px", weight: "600", tracking: "-1.2px", lh: "1.00", el: "h2" },
  { label: "Sub-heading", size: "36px", weight: "600", tracking: "-0.9px", lh: "1.10", el: "h3" },
  { label: "Card Title", size: "20px", weight: "400", tracking: "normal", lh: "1.25", el: "h4" },
  { label: "Body Large", size: "18px", weight: "400", tracking: "normal", lh: "1.38", el: "p" },
  { label: "Body", size: "16px", weight: "400", tracking: "normal", lh: "1.50", el: "p" },
  { label: "Caption", size: "14px", weight: "400", tracking: "normal", lh: "1.50", el: "p" },
];

// ─── Elevation levels ───────────────────────────────────────────────────────

const elevationLevels = [
  {
    level: "Level 0 — Flat",
    desc: "No shadow, cream background. Page surface.",
    style: { background: "#f7f4ed" },
    className: "bg-cream",
  },
  {
    level: "Level 1 — Bordered",
    desc: "1px solid #eceae4. Cards, images, dividers.",
    style: { background: "#f7f4ed", border: "1px solid #eceae4" },
    className: "bg-cream border border-border",
  },
  {
    level: "Level 2 — Inset",
    desc: "Inset shadow on dark buttons. Tactile depth.",
    style: {
      background: "#1c1c1c",
      boxShadow:
        "rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px",
    },
    className: "bg-charcoal shadow-btn-primary",
    dark: true,
  },
  {
    level: "Level 3 — Focus",
    desc: "rgba(0,0,0,0.1) 0px 4px 12px. Active/focus glow.",
    style: { background: "#f7f4ed", border: "1px solid #eceae4", boxShadow: "rgba(0,0,0,0.1) 0px 4px 12px" },
    className: "bg-cream border border-border shadow-focus",
  },
];

// ─── Spacing scale ──────────────────────────────────────────────────────────

const spacingScale = [8, 10, 12, 16, 24, 32, 40, 56, 80, 96, 128];

// ─── Section wrapper ────────────────────────────────────────────────────────

function Section({ id, title, description, children }: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="py-14 border-b border-border last:border-b-0">
      <div className="mb-8">
        <h2 className="font-sans font-semibold text-[1.5rem] leading-tight tracking-[-0.5px] text-charcoal mb-2">
          {title}
        </h2>
        <p className="font-sans text-sm text-muted leading-normal">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Token({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-sans text-xs text-muted leading-normal">{label}</span>
      <code className="font-mono text-xs text-charcoal bg-[rgba(28,28,28,0.04)] px-2 py-1 rounded-micro">
        {value}
      </code>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState<Section>("Colors");

  const scrollTo = (section: Section) => {
    setActiveSection(section);
    const el = document.getElementById(section.toLowerCase());
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex min-h-screen bg-cream font-sans">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-52 border-r border-border bg-cream flex flex-col z-10">
        <div className="px-5 py-6 border-b border-border">
          <p className="font-sans font-semibold text-sm text-charcoal tracking-[-0.3px]">Design System</p>
          <p className="font-sans text-xs text-muted mt-0.5">mofit</p>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className={[
                "w-full text-left px-3 py-2 rounded-[6px] font-sans text-sm transition-colors",
                activeSection === s
                  ? "bg-[rgba(28,28,28,0.06)] text-charcoal font-semibold"
                  : "text-muted hover:text-charcoal hover:bg-[rgba(28,28,28,0.04)]",
              ].join(" ")}
            >
              {s}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-border flex flex-col gap-2">
          <Link
            to="/components"
            className="font-sans text-xs text-muted hover:text-charcoal transition-colors"
          >
            → Components
          </Link>
          <p className="font-sans text-xs text-muted">
            Based on <span className="text-charcoal">Lovable</span>
          </p>
        </div>
      </aside>

      {/* Content */}
      <main className="ml-52 flex-1 px-12 max-w-4xl">
        {/* Header */}
        <div className="py-16 border-b border-border">
          <Display className="mb-4">Design System</Display>
          <BodyLarge className="text-muted max-w-lg">
            A warm, editorial component library built on cream parchment and charcoal ink.
            Every element derives from a single source of warmth.
          </BodyLarge>
        </div>

        {/* Colors */}
        <Section
          id="colors"
          title="Colors"
          description="All grays are derived from #1c1c1c at varying opacity — a unified tonal range with no arbitrary hex values."
        >
          <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-3">
            {colorTokens.map((t) => (
              <div key={t.name} className="flex flex-col gap-2">
                <div
                  className="h-20 rounded-card border border-border flex items-end p-3"
                  style={{ background: t.value }}
                >
                  <span
                    className="font-sans text-xs font-semibold"
                    style={{ color: t.text }}
                  >
                    {t.name}
                  </span>
                </div>
                <Token label={t.role} value={t.value} />
              </div>
            ))}
          </div>

          <h3 className="font-sans font-semibold text-sm text-charcoal mb-4">Opacity Scale</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {opacityTokens.map((t) => (
              <div key={t.name} className="flex flex-col gap-2">
                <div
                  className="h-12 rounded-card border border-border"
                  style={{ background: t.value }}
                />
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-xs text-charcoal font-semibold">{t.name}</span>
                  <span className="font-sans text-xs text-muted">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Typography */}
        <Section
          id="typography"
          title="Typography"
          description="DM Sans at two weights — 400 for body/UI, 600 for headings. Hierarchy through size and negative tracking, not weight variation."
        >
          <div className="flex flex-col divide-y divide-border">
            {typeScaleRows.map((row) => (
              <div key={row.label} className="py-5 flex items-baseline gap-6 flex-wrap">
                <div
                  style={{
                    fontSize: row.size,
                    fontWeight: row.weight,
                    letterSpacing: row.tracking,
                    lineHeight: row.lh,
                    color: "#1c1c1c",
                    flex: "1 1 300px",
                  }}
                  className="font-sans"
                >
                  The quick brown fox
                </div>
                <div className="flex gap-6 flex-shrink-0">
                  <Token label="Label" value={row.label} />
                  <Token label="Size" value={row.size} />
                  <Token label="Weight" value={row.weight} />
                  <Token label="Tracking" value={row.tracking} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="font-sans font-semibold text-sm text-charcoal mb-4">Live Components</h3>
            <div className="flex flex-col gap-2">
              <Display>Display Hero</Display>
              <Heading>Section Heading</Heading>
              <SubHeading>Sub-heading</SubHeading>
              <CardTitle>Card Title</CardTitle>
              <BodyLarge>Body Large — comfortable reading introduction text</BodyLarge>
              <Body>Body — standard paragraph text for content areas</Body>
              <Caption>Caption — metadata, timestamps, supporting detail</Caption>
            </div>
          </div>
        </Section>

        {/* Buttons */}
        <Section
          id="buttons"
          title="Buttons"
          description="Four variants with intentional depth. The inset shadow on Primary is the system's signature tactile detail."
        >
          <div className="flex flex-col gap-10">
            {/* Variants */}
            <div>
              <h3 className="font-sans font-semibold text-sm text-charcoal mb-4">Variants</h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary">Primary Dark</Button>
                <Button variant="ghost">Ghost / Outline</Button>
                <Button variant="cream">Cream Surface</Button>
                <Button variant="pill">Pill Action</Button>
              </div>
            </div>
            {/* Sizes */}
            <div>
              <h3 className="font-sans font-semibold text-sm text-charcoal mb-4">Sizes</h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-3 items-center mt-3">
                <Button variant="ghost" size="sm">Small</Button>
                <Button variant="ghost" size="md">Medium</Button>
                <Button variant="ghost" size="lg">Large</Button>
              </div>
            </div>
            {/* States */}
            <div>
              <h3 className="font-sans font-semibold text-sm text-charcoal mb-4">States</h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary">Default</Button>
                <Button variant="primary" className="opacity-80">Active (0.8)</Button>
                <Button variant="primary" disabled>Disabled</Button>
                <Button variant="ghost" disabled>Disabled Ghost</Button>
              </div>
            </div>
            {/* Tokens */}
            <div>
              <h3 className="font-sans font-semibold text-sm text-charcoal mb-4">Token Reference</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Token label="Primary bg" value="#1c1c1c" />
                <Token label="Primary text" value="#fcfbf8" />
                <Token label="Ghost border" value="rgba(28,28,28,0.4)" />
                <Token label="Cream bg" value="#f7f4ed" />
                <Token label="Radius" value="6px (standard)" />
                <Token label="Active opacity" value="0.8" />
              </div>
            </div>
          </div>
        </Section>

        {/* Cards */}
        <Section
          id="cards"
          title="Cards"
          description="Containment through warm borders, not shadows. Background matches the page for seamless integration."
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <span className="font-sans text-xs text-muted">Standard (12px radius)</span>
              <Card radius="card">
                <CardHeader>
                  <CardTitle>Designer Profile</CardTitle>
                </CardHeader>
                <CardBody>
                  <Body className="text-muted">
                    3년차 헤어 디자이너. 내추럴 커트와 레이어드 스타일링을 전문으로 합니다.
                  </Body>
                </CardBody>
                <CardFooter>
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary">Connect</Button>
                    <Button size="sm" variant="ghost">View Portfolio</Button>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-sans text-xs text-muted">Compact (8px radius)</span>
              <Card radius="compact">
                <CardBody>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="mb-1">Matching Request</CardTitle>
                      <Caption>Received 2 hours ago</Caption>
                    </div>
                    <Badge variant="muted">Pending</Badge>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <span className="font-sans text-xs text-muted">Container (16px radius)</span>
              <Card radius="container">
                <CardBody className="py-8 px-8">
                  <div className="grid grid-cols-3 divide-x divide-border text-center">
                    {[["48", "Designers"], ["12", "Active Matches"], ["98%", "Satisfaction"]].map(([n, l]) => (
                      <div key={l} className="px-6">
                        <p className="font-sans font-semibold text-[2rem] leading-tight tracking-[-0.8px] text-charcoal">{n}</p>
                        <Caption>{l}</Caption>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </Section>

        {/* Inputs */}
        <Section
          id="inputs"
          title="Inputs"
          description="Warm cream fields with soft focus indication. Placeholder in muted gray, errors in warm red."
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-2xl">
            <Input label="Name" placeholder="Your full name" />
            <Input label="Email" placeholder="you@example.com" type="email" />
            <Input
              label="With hint"
              placeholder="Enter portfolio URL"
              hint="Add https:// prefix"
            />
            <Input
              label="With error"
              placeholder="Enter email"
              defaultValue="not-an-email"
              error="Please enter a valid email address"
            />
            <Input label="Disabled" placeholder="Not editable" disabled />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-sans text-charcoal">Textarea</label>
              <textarea
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full bg-cream text-charcoal placeholder:text-muted border border-border rounded-[6px] px-3 py-2 text-base font-sans leading-normal outline-none transition-shadow focus:border-border-interactive focus:shadow-focus resize-none"
              />
            </div>
          </div>
        </Section>

        {/* Badges */}
        <Section
          id="badges"
          title="Badges"
          description="Pill-shaped status indicators. Three variants for hierarchy across neutral surfaces."
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-3 items-center">
              <Badge variant="default">Default</Badge>
              <Badge variant="muted">Muted</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="default">New</Badge>
              <Badge variant="muted">Pending</Badge>
              <Badge variant="outline">염색</Badge>
              <Badge variant="muted">Active</Badge>
              <Badge variant="default">Featured</Badge>
              <Badge variant="outline">펌</Badge>
              <Badge variant="muted">커트</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <Token label="Default bg" value="#1c1c1c" />
              <Token label="Default text" value="#fcfbf8" />
              <Token label="Radius" value="9999px" />
            </div>
          </div>
        </Section>

        {/* Elevation */}
        <Section
          id="elevation"
          title="Elevation"
          description="A shallow depth system — borders contain, inset shadows add tactility, focus glows invite interaction."
        >
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {elevationLevels.map((level) => (
              <div key={level.level} className="flex flex-col gap-3">
                <div
                  className="h-24 rounded-card flex items-center justify-center"
                  style={level.style}
                >
                  <span
                    className="font-sans text-xs font-semibold"
                    style={{ color: level.dark ? "#fcfbf8" : "#1c1c1c" }}
                  >
                    {level.level.split(" — ")[0]}
                  </span>
                </div>
                <div>
                  <p className="font-sans text-xs font-semibold text-charcoal">{level.level}</p>
                  <p className="font-sans text-xs text-muted mt-0.5">{level.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Spacing */}
        <Section
          id="spacing"
          title="Spacing"
          description="Base unit of 8px. Scale expands generously at the top — sections breathe with 80px–128px gaps."
        >
          <div className="flex flex-col gap-3">
            {spacingScale.map((val) => (
              <div key={val} className="flex items-center gap-5">
                <span className="font-mono text-xs text-muted w-10 text-right flex-shrink-0">{val}px</span>
                <div
                  className="bg-charcoal rounded-micro flex-shrink-0"
                  style={{ width: `${Math.min(val * 2, 600)}px`, height: "10px", opacity: 0.15 + (val / 128) * 0.7 }}
                />
                <span className="font-sans text-xs text-muted">
                  {val <= 16 ? "Micro spacing" : val <= 40 ? "Component spacing" : val <= 80 ? "Section padding" : "Editorial breathing room"}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer spacer */}
        <div className="h-24" />
      </main>
    </div>
  );
}
