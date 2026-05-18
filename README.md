<div align="center">

<!-- Animated Wave Header -->
<img src="https://capsule-render.vercel.app/api?type=waving&height=210&color=0:f97316,100:22c55e&text=IT%20Helpdesk%20dan%20Asset%20Inventory&fontSize=52&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Ticketing%20Workflow%20%7C%20Asset%20Tracking%20%7C%20Reporting%20CSV%20%7C%20PWA%20Offline%20Safe&descAlignY=58" />

<!-- Typing SVG -->
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=3000&pause=700&color=F97316&center=true&vCenter=true&width=980&lines=Responsive+IT+Helpdesk+simulation+for+internal+support+workflows;Ticket+management%2C+asset+inventory%2C+dan+operational+reporting;PWA+ready%2C+offline+safe%2C+dan+recruiter+friendly+React+TypeScript" />

<p>
  <img src="https://img.shields.io/badge/React-18-61dafb" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6" />
  <img src="https://img.shields.io/badge/Vite-5-646cff" />
  <img src="https://img.shields.io/badge/PWA-Ready-22c55e" />
</p>

</div>

---

## Overview
**IT Helpdesk Ticketing dan Asset Inventory** is a responsive web application that simulates real internal IT support operations:
ticket intake, status tracking, asset inventory management, and operational reporting.

The project is designed to be stable, offline-safe, and easy to demo during interviews.

---

## Key Features
### 🎫 Ticket Management
- Create, update, dan close tickets
- Category, priority, dan status tracking (`Open`, `In Progress`, `Closed`)
- Ticket activity timeline (logs)

### 🧾 Asset Inventory
- Record IT assets (PC, laptop, printer, and more)
- Serial number, location, notes, dan assignment to user
- Asset status (`Available`, `In Use`, `Maintenance`)

### 📈 Reporting
- Ticket and asset summaries
- Export reporting to CSV for operational needs

### 📱 UI dan Accessibility
- Mobile-first responsive layout
- PWA installable experience
- Offline-safe using local storage dan seeded JSON data

---

## Tech Stack
- React dan TypeScript
- Vite
- LocalStorage for persistence
- vite-plugin-pwa for installable PWA

---

## Data Model (summary)
### Ticket
`id`, `title`, `category`, `priority`, `status`, `requesterName`, `description`, `createdAt`, `updatedAt`, `logs[]`

### Asset
`id`, `name`, `type`, `serialNumber`, `assignedTo`, `status`, `location`, `notes`

---

## Quick Start
```bash
npm install
npm run dev
```

Default dev server: `http://localhost:5000`

---

## Suggested Screenshots
Place images in `attached_assets/`:
- Dashboard
- Ticket list and detail
- Asset inventory
- Reporting export page

---

## Future Improvements
- Backend REST API integration
- Authentication dan role-based access
- Email notifications
- Advanced analytics dashboard

---

## License
For educational and portfolio purposes.
