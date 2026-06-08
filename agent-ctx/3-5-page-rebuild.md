# Task 3-5: Rebuild page.tsx with Admin/Registration System

## Work Completed

### What was done
Rebuilt the complete `/home/z/my-project/src/app/page.tsx` file (approx 1500+ lines) that preserves ALL existing website sections and adds the new admin/registration system.

### Architecture: Hash-based routing within single page
Since only the `/` route can be used, implemented hash-based navigation:
- `/#accueil` or default → Main website (existing 11 sections)
- `/#inscription` → Registration form (RegistrationView component)
- `/#admin` → Admin dashboard (AdminDashboard component, requires auth)

### New Features Added

#### 1. Hidden Admin Trigger
- Small Sparkles icon in the footer copyright area
- Uses `opacity-30 hover:opacity-100` for subtle but visible appearance
- On DOUBLE CLICK, opens the admin login dialog

#### 2. Admin Login Dialog
- Uses shadcn Dialog component
- Title: "Administration ONGD LUVHES FAMILLE ESENGO"
- Logo at top
- Password input field
- Login button with loading state
- POSTs to `/api/admin/login` with `{password}`
- On success: stores token in localStorage as `ongd_admin_token`, sets adminMode=true, navigates to #admin
- Error message on wrong password with AlertTriangle icon

#### 3. Registration Form (RegistrationView component)
- Header with centered logo, organization name, "FORMULAIRE OFFICIEL D'INSCRIPTION" subtitle
- Section: Informations Personnelles (Nom, Post-nom, Prénom, Sexe radio, Date naissance, WhatsApp, Email)
- Section: Photo Passeport (file input with preview, URL.createObjectURL with cleanup)
- Section: Filière Souhaitée (Select dropdown with 13 options, "Autre" shows text input)
- Submit button with loading state
- Success confirmation with specified message about HENOCK ADUMA
- Footer notice as specified in requirements
- Back button to return to main site

#### 4. Admin Dashboard (AdminDashboard component)
- Responsive sidebar (desktop: fixed left, mobile: hamburger with slide-in overlay)
- Sidebar items: Tableau de bord, Générer une fiche, Fiches inscrites, Statistiques, Déconnexion
- Dashboard view: welcome card + 4 stat cards (Total, En attente, Acceptés, Refusés) fetched from /api/stats
- Generate Link view: button to generate, display link, copy button, share buttons (WhatsApp, Facebook, Email, SMS)
- Registrations view: search bar, filter by statut & filiere, table/list with photo thumbnails, status badges, detail dialog
- Detail dialog: photo, all info, Accept/Refuse/Reset buttons, commentaire textarea, save, delete
- Statistics view: 6 stat cards + filiere distribution bar chart
- CSV export, PDF export placeholder
- Logout clears localStorage, resets adminMode, navigates to #accueil

### Existing Sections Preserved
All 11 original sections remain exactly as they were:
1. Navigation (fixed header with scroll detection)
2. Hero (parallax with floating circles)
3. About (4 cards: Mission, Vision, Objectifs, Actions)
4. Coordonnatrice (photo + bio + quote)
5. Impact (animated counters)
6. Gallery (filter + lightbox)
7. Donations (4 methods with copy buttons)
8. Contact (info + form)
9. Messages (WhatsApp + Email cards)
10. Facebook
11. Footer (with hidden admin trigger)

### Technical Details
- Uses `useState` for: currentView, adminMode, adminToken, showLoginDialog, loginPassword, loginError, loginLoading
- Uses `useEffect` for hash change listener and admin token check on mount
- Uses `AnimatePresence` with `mode="wait"` for view transitions
- All fetches use relative paths: `/api/registration`, `/api/stats`, `/api/admin/login`, `/api/admin/generate-link`
- Photo preview uses `URL.createObjectURL()` with `URL.revokeObjectURL()` cleanup
- Lint passes cleanly
- Dev server compiles without errors

### Dependencies Used
- framer-motion (AnimatePresence, motion)
- lucide-react (additional icons: LayoutDashboard, Link2, UserCheck, BarChart3, LogOut, Search, Filter, Download, Share2, Loader2, ChevronUp, Camera, ArrowDownToLine, Trash2, CheckCircle2, XCircle, Clock, AlertTriangle)
- shadcn/ui: Dialog, Select, Badge, Card, Input, Textarea, Button, Sheet
- sonner (toast)
- next/image
