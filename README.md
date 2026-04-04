[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![Zustand](https://img.shields.io/badge/Zustand-State_Store-433E38)](https://zustand-demo.pmnd.rs/)

# Pulseboard Dashboard

Interactive analytics dashboard built with Next.js App Router, TypeScript, Tailwind CSS, Zustand, Chart.js, dnd-kit, and Framer Motion.

## Features

- Responsive dashboard shell with sidebar, sticky header, and adaptive widget grid
- Draggable widgets powered by `@dnd-kit`
- Widget resize controls with persisted layout state
- Finance analytics from validated local mock JSON data
- Global filtering by date range and category
- Global search and sorting
- CSV export for the active transaction slice
- Saved dashboard layout snapshots
- Empty states and retryable error state
- Keyboard-friendly drag-and-drop sensor support
- Static export workflow for GitHub Pages with configurable base path support

## Project structure

```text
Dashboard/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── app/
│   │   └── dashboard-app.tsx
│   ├── dashboard/
│   │   ├── dashboard-grid.tsx
│   │   ├── error-state.tsx
│   │   ├── filters-bar.tsx
│   │   ├── widget-empty-state.tsx
│   │   └── widget-frame.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   └── sidebar.tsx
│   └── widgets/
│       ├── bar-chart-widget.tsx
│       ├── line-chart-widget.tsx
│       ├── pie-chart-widget.tsx
│       ├── summary-widget.tsx
│       └── transactions-widget.tsx
├── data/
│   └── finance-data.json
├── hooks/
│   └── use-dashboard-data.ts
├── lib/
│   ├── chart.ts
│   ├── constants.ts
│   ├── dashboard-data.ts
│   ├── finance-data.ts
│   ├── export.ts
│   ├── format.ts
│   └── utils.ts
├── store/
│   └── dashboard-store.ts
├── types/
│   └── dashboard.ts
├── eslint.config.mjs
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run check
npm run build
npm run start
```

## Notes

- Filters, widgets layout, and saved layout snapshots are persisted in localStorage.
- The mock dataset is anchored to the latest transaction date so date filters stay meaningful.
- CSV export always uses the currently filtered transaction list.
- `NEXT_PUBLIC_BASE_PATH` or `BASE_PATH` can override the repository-derived GitHub Pages path.
