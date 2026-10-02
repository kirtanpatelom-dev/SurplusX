'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Leaf,
  LineChart,
  Radar,
  Repeat,
  FileBarChart,
  UtensilsCrossed,
  Factory,
  Truck,
  HeartHandshake,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const steps = [
  { title: 'Predict', icon: LineChart, copy: 'Forecast hostel and cafeteria demand using attendance, weather, and festival calendars.' },
  { title: 'Detect', icon: Radar, copy: 'Flag surplus, expiry risk, and cold-storage drift before food leaves the safe window.' },
  { title: 'Redistribute', icon: Repeat, copy: 'Match leftover lots to NGOs and shelters around Gandhinagar and Ahmedabad.' },
  { title: 'Report', icon: FileBarChart, copy: 'Publish MoFPI-aligned ESG metrics: waste diverted, meals served, CO₂e avoided.' },
];

const features = [
  { title: 'Kitchen demand AI', copy: 'Meal-wise production targets with confidence bands for breakfast, lunch, and dinner.' },
  { title: 'Expiry monitor', copy: 'Batch-level countdown across dal, dairy, vegetables, and prepared food.' },
  { title: 'Computer vision QC', copy: 'Simulated freshness scores and issue overlays for incoming lots.' },
  { title: 'IoT cold chain', copy: 'Temperature, humidity, and ammonia sparklines with threshold alerts.' },
  { title: 'NGO matching', copy: 'Ranked receivers by distance, remaining capacity, and dietary fit.' },
  { title: 'Route optimisation', copy: 'Multi-stop vans with cold-chain flags and fuel saved versus the original path.' },
  { title: 'Plant OEE', copy: 'Line health, downtime, energy, and raw-material loss for processing units.' },
  { title: 'ESG pack', copy: 'Month, quarter, and year views with a printable compliance checklist.' },
];

const counters = [
  { value: '18,420 kg', label: 'Waste prevented (this month)' },
  { value: '36,840', label: 'Meals redistributed' },
  { value: '₹9.21 L', label: 'Kitchen cost saved' },
  { value: '44 t', label: 'CO₂e avoided' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-primary p-2">
              <Leaf className="h-5 w-5 text-primary-foreground" aria-hidden />
            </span>
            <span className="text-lg font-bold">SurplusX</span>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/login" className={cn(buttonVariants({ variant: 'ghost' }))}>
              Role select
            </Link>
            <Link href="/login" className={cn(buttonVariants())}>
              Open demo
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm font-medium text-primary">India · institutional kitchens · MoFPI context</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Stop surplus at the steam table. Feed the city instead.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              SurplusX helps hostels, cafeterias, caterers, and food plants in Gujarat predict demand, catch spoilage risk, and move safe surplus to NGOs before it is dumped.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/login" className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}>
                Continue as demo user
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#how" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
                How it works
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Frontend-only demo. All AI and IoT readings are simulated.</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: UtensilsCrossed, title: 'Kitchen', copy: 'Gandhinagar guest house · 312 covers' },
              { icon: Factory, title: 'Plant', copy: 'Dal mill & packaging OEE' },
              { icon: HeartHandshake, title: 'NGO', copy: '12 receivers in 40 km' },
              { icon: Truck, title: 'Logistics', copy: '6 vehicles, cold-chain vans' },
            ].map((card) => (
              <div key={card.title} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <card.icon className="mb-3 h-5 w-5 text-primary" />
                <p className="font-semibold">{card.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{card.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-2xl font-bold">The waste we already know about</h2>
            <p className="mt-2 max-w-3xl text-muted-foreground">
              FAO estimates that about one-third of food produced for human consumption is lost or wasted globally. In Indian institutional kitchens that shows up as overproduced lunch thalis, dairy hitting its use-by date, and plants dumping trim that never reached a secondary buyer.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <StatBlock value="1/3" label="of food wasted globally (FAO)" />
              <StatBlock value="12%" label="typical weekend waste in our 90-day kitchen history" />
              <StatBlock value="45 min" label="safe window we target from pack time to listed surplus" />
            </div>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold">How it works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs font-medium tabular-nums text-primary">0{i + 1}</p>
                <step.icon className="mt-3 h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-muted/50">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-2xl font-bold">Built for every seat in the loop</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <article key={f.title} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold">Impact this month (simulated)</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {counters.map((c) => (
              <div key={c.label} className="rounded-xl border border-border bg-card p-6">
                <p className="text-3xl font-bold tabular-nums text-primary">{c.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{c.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-xl bg-primary px-6 py-10 text-primary-foreground">
            <h2 className="text-2xl font-bold">Run the Gandhinagar demo</h2>
            <p className="mt-2 max-w-2xl text-primary-foreground/90">
              Pick Kitchen Manager, Plant Manager, NGO, Driver, or ESG Auditor. No account, no environment variables.
            </p>
            <Link href="/login" className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'mt-6 inline-flex')}>
              Enter demo
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <p className="text-3xl font-bold tabular-nums">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
