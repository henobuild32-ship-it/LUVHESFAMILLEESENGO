'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import {
  Heart, Eye, Target, HandHeart, ChevronDown, Menu, X, Phone, Mail, MapPin,
  Copy, Check, Send, Facebook, MessageCircle, ArrowLeft, ArrowRight,
  Users, FolderOpen, Globe2, HeartHandshake, Sparkles, Quote, ExternalLink,
  CreditCard, Smartphone, LayoutDashboard, Link2, UserCheck, BarChart3,
  LogOut, Search, Filter, Download, Share2, Loader2, ChevronUp, Camera,
  ArrowDownToLine, Trash2, CheckCircle2, XCircle, Clock, AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { toast } from 'sonner'

/* ─── TYPES ─── */
interface Registration {
  id: string
  nom: string
  postnom: string
  prenom: string
  sexe: string
  dateNaissance: string
  whatsapp: string
  email: string
  photoPath: string
  filiere: string
  filiereAutre: string | null
  statut: string
  commentaire: string | null
  createdAt: string
  updatedAt: string
}

interface Stats {
  total: number
  hommes: number
  femmes: number
  acceptes: number
  refuses: number
  enAttente: number
  filiereDistribution: Record<string, number>
}

/* ─── CONSTANTS ─── */
const NAV_LINKS = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'À Propos', href: '#apropos' },
  { label: 'Coordonnatrice', href: '#coordonnatrice' },
  { label: 'Impact', href: '#impact' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'Dons', href: '#dons' },
  { label: 'Contact', href: '#contact' },
]

const ABOUT_CARDS = [
  {
    icon: Heart,
    title: 'Mission',
    text: "Porter l'espoir et l'amour aux familles et communautés vulnérables à travers des actions humanitaires durables et un accompagnement holistique.",
  },
  {
    icon: Eye,
    title: 'Vision',
    text: "Un monde où chaque famille vit dans la dignité, la solidarité et l'espoir, où chaque individu a les opportunités de s'épanouir.",
  },
  {
    icon: Target,
    title: 'Objectifs',
    text: "Promouvoir le développement communautaire, soutenir l'éducation, renforcer la santé, protéger les droits des femmes et enfants, et lutter contre la pauvreté.",
  },
  {
    icon: HandHeart,
    title: 'Actions',
    text: "Projets éducatifs, campagnes de santé, soutien alimentaire, formation professionnelle, assistance aux déplacés, et plaidoyer pour les droits humains.",
  },
]

const IMPACT_STATS = [
  { value: 2500, suffix: '+', label: 'Bénéficiaires Touchés', icon: Users },
  { value: 35, suffix: '+', label: 'Projets Réalisés', icon: FolderOpen },
  { value: 15, suffix: '+', label: 'Communautés Impactées', icon: Globe2 },
  { value: 10, suffix: '+', label: 'Campagnes Humanitaires', icon: HeartHandshake },
]

const GALLERY_IMAGES = [
  { src: '/gallery1.jpg', category: 'Activités', alt: 'Activités communautaires' },
  { src: '/gallery2.jpg', category: 'Événements', alt: 'Événements organisation' },
  { src: '/gallery3.jpg', category: 'Projets', alt: 'Projets en cours' },
  { src: '/gallery4.jpg', category: 'Communauté', alt: 'Engagement communautaire' },
  { src: '/gallery5.jpg', category: 'Activités', alt: 'Activités de soutien' },
  { src: '/gallery6.jpg', category: 'Événements', alt: 'Événements spéciaux' },
]

const GALLERY_CATEGORIES = ['Tous', 'Activités', 'Événements', 'Projets', 'Communauté']

const DONATION_METHODS = [
  {
    name: 'M-Pesa',
    number: '+243811861032',
    icon: Smartphone,
    color: 'oklch(0.55 0.15 150)',
    bgColor: 'oklch(0.95 0.05 150)',
    borderColor: 'oklch(0.75 0.1 150)',
  },
  {
    name: 'Orange Money',
    number: '+243897043155',
    icon: Smartphone,
    color: 'oklch(0.6 0.18 55)',
    bgColor: 'oklch(0.95 0.06 55)',
    borderColor: 'oklch(0.75 0.1 55)',
  },
  {
    name: 'Airtel Money',
    number: '+243999562447',
    icon: Smartphone,
    color: 'oklch(0.55 0.2 25)',
    bgColor: 'oklch(0.95 0.06 25)',
    borderColor: 'oklch(0.75 0.1 25)',
  },
  {
    name: 'Virement Bancaire UBA',
    number: 'N° Compte 015020591010',
    icon: CreditCard,
    color: 'oklch(0.45 0.12 150)',
    bgColor: 'oklch(0.95 0.05 150)',
    borderColor: 'oklch(0.75 0.1 150)',
  },
]

const FILIERES = [
  'Informatique', 'Alphabétisation', 'Hôtellerie', 'Agriculture et Élevage',
  'Transformation', 'Restauration', 'Peinture', 'Maçonnerie', 'Couture',
  'Électricité', 'Mécanique', 'Entrepreneuriat', 'Autre'
]

/* ─── ANIMATED COUNTER COMPONENT ─── */
function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const startTime = Date.now()

    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      start = Math.floor(eased * value)
      setCount(start)
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [isInView, value])

  return (
    <span ref={ref} className="font-serif text-5xl md:text-6xl font-bold">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

/* ─── COPY BUTTON COMPONENT ─── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copié dans le presse-papiers !')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Impossible de copier')
    }
  }, [text])

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="gap-1.5 transition-all duration-300 hover:scale-105"
    >
      {copied ? <Check className="size-4 text-emerald" /> : <Copy className="size-4" />}
      {copied ? 'Copié !' : 'Copier'}
    </Button>
  )
}

/* ─── SECTION HEADER COMPONENT ─── */
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center mb-12 md:mb-16"
    >
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
        {title}
      </h2>
      <div className="section-divider mb-4" />
      {subtitle && (
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   REGISTRATION FORM VIEW
   ═══════════════════════════════════════════════════════════════ */
function RegistrationView({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState({
    nom: '', postnom: '', prenom: '', sexe: '', dateNaissance: '',
    whatsapp: '', email: '', filiere: '', filiereAutre: '',
  })
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const removePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhoto(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nom || !formData.postnom || !formData.prenom || !formData.sexe ||
        !formData.dateNaissance || !formData.whatsapp || !formData.email || !formData.filiere || !photo) {
      toast.error('Veuillez remplir tous les champs obligatoires.')
      return
    }
    if (formData.filiere === 'Autre' && !formData.filiereAutre.trim()) {
      toast.error('Veuillez préciser votre filière.')
      return
    }
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('nom', formData.nom)
      fd.append('postnom', formData.postnom)
      fd.append('prenom', formData.prenom)
      fd.append('sexe', formData.sexe)
      fd.append('dateNaissance', formData.dateNaissance)
      fd.append('whatsapp', formData.whatsapp)
      fd.append('email', formData.email)
      fd.append('filiere', formData.filiere)
      if (formData.filiere === 'Autre') fd.append('filiereAutre', formData.filiereAutre)
      fd.append('photo', photo)

      const res = await fetch('/api/registration', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Erreur lors de l'inscription.")
        return
      }
      setSuccess(true)
    } catch {
      toast.error("Erreur réseau. Veuillez réessayer.")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <Card className="border-emerald/30 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="size-10 text-emerald" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                Inscription Enregistrée !
              </h2>
              <div className="text-muted-foreground space-y-3 text-left bg-warm rounded-xl p-6 mb-6">
                <p>Votre inscription a été enregistrée avec succès.</p>
                <p>Votre dossier sera étudié par l&apos;Informaticien <strong className="text-foreground">HENOCK ADUMA</strong> de l&apos;ONGD LUVHES FAMILLE ESENGO.</p>
                <p>Une réponse vous sera communiquée prochainement par email ou via votre numéro WhatsApp.</p>
                <p>Nous vous remercions pour votre confiance.</p>
              </div>
              <Button
                onClick={onBack}
                className="bg-emerald hover:bg-emerald/90 text-white rounded-full px-8"
              >
                <ArrowLeft className="size-4 mr-2" />
                Retour au site
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald/5 via-background to-gold/5 border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image src="/logo.jpeg" alt="ONGD LUVHES FAMILLE ESENGO" fill className="object-cover rounded-full" sizes="96px" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
            ONGD LUVHES FAMILLE ESENGO
          </h1>
          <p className="text-emerald font-semibold text-lg tracking-wide">
            FORMULAIRE OFFICIEL D&apos;INSCRIPTION
          </p>
        </div>
      </div>

      {/* Back button */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="size-4 mr-1" />
          Retour au site
        </Button>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-6 pb-16">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations Personnelles */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <Users className="size-5 text-emerald" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nom <span className="text-red-500">*</span></label>
                  <Input name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Post-nom <span className="text-red-500">*</span></label>
                  <Input name="postnom" placeholder="Post-nom" value={formData.postnom} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Prénom <span className="text-red-500">*</span></label>
                  <Input name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Sexe <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                  <label className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${
                    formData.sexe === 'Masculin' ? 'border-emerald bg-emerald/10 text-emerald' : 'border-border hover:border-emerald/30'
                  }`}>
                    <input type="radio" name="sexe" value="Masculin" checked={formData.sexe === 'Masculin'} onChange={handleChange} className="sr-only" />
                    <span className="font-medium">Masculin</span>
                  </label>
                  <label className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${
                    formData.sexe === 'Féminin' ? 'border-emerald bg-emerald/10 text-emerald' : 'border-border hover:border-emerald/30'
                  }`}>
                    <input type="radio" name="sexe" value="Féminin" checked={formData.sexe === 'Féminin'} onChange={handleChange} className="sr-only" />
                    <span className="font-medium">Féminin</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Date de naissance <span className="text-red-500">*</span></label>
                  <Input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Numéro WhatsApp <span className="text-red-500">*</span></label>
                  <Input type="tel" name="whatsapp" placeholder="+243..." value={formData.whatsapp} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Adresse Email <span className="text-red-500">*</span></label>
                <Input type="email" name="email" placeholder="votre@email.com" value={formData.email} onChange={handleChange} required />
              </div>
            </CardContent>
          </Card>

          {/* Photo Passeport */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <Camera className="size-5 text-emerald" />
                Photo Passeport
              </CardTitle>
            </CardHeader>
            <CardContent>
              {photoPreview ? (
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-32 rounded-lg overflow-hidden border-2 border-emerald/30">
                    <Image src={photoPreview} alt="Photo preview" fill className="object-cover" sizes="96px" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{photo?.name}</p>
                    <Button type="button" variant="outline" size="sm" onClick={removePhoto} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      <X className="size-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-emerald/50 hover:bg-emerald/5 transition-all duration-300">
                  <Camera className="size-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Cliquez pour sélectionner votre photo</span>
                  <span className="text-xs text-muted-foreground/60 mt-1">JPG, JPEG ou PNG</span>
                  <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" onChange={handlePhotoChange} className="hidden" required />
                </label>
              )}
            </CardContent>
          </Card>

          {/* Filière */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <Target className="size-5 text-emerald" />
                Filière Souhaitée
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Filière <span className="text-red-500">*</span></label>
                <Select value={formData.filiere} onValueChange={(val) => setFormData((prev) => ({ ...prev, filiere: val }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez une filière" />
                  </SelectTrigger>
                  <SelectContent>
                    {FILIERES.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.filiere === 'Autre' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-foreground">Précisez votre filière <span className="text-red-500">*</span></label>
                  <Input
                    name="filiereAutre"
                    placeholder="Précisez votre filière"
                    value={formData.filiereAutre}
                    onChange={handleChange}
                    required
                  />
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="w-full bg-emerald hover:bg-emerald/90 text-white rounded-xl py-6 text-lg shadow-xl shadow-emerald/20 transition-all duration-300 hover:scale-[1.02]"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-5 animate-spin" />
                Envoi en cours...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="size-5" />
                Soumettre mon inscription
              </span>
            )}
          </Button>
        </form>

        {/* Footer notice */}
        <div className="mt-10 bg-warm rounded-xl p-6 border border-border/50 text-sm text-muted-foreground space-y-3">
          <p className="font-semibold text-foreground text-base">Cette fiche appartient à l&apos;ONGD LUVHES FAMILLE ESENGO.</p>
          <p>Certaines informations importantes telles que l&apos;adresse exacte du centre, les horaires, les dates d&apos;arrivée ainsi que le calendrier des formations selon la filière choisie ne sont pas affichées sur cette fiche.</p>
          <p>Ces informations vous seront communiquées directement par le centre après validation de votre dossier.</p>
          <p className="font-semibold text-emerald">Merci pour votre confiance.</p>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ADMIN DASHBOARD VIEW
   ═══════════════════════════════════════════════════════════════ */
function AdminDashboard({ onLogout, token }: { onLogout: () => void; token: string }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatut, setFilterStatut] = useState('tous')
  const [filterFiliere, setFilterFiliere] = useState('toutes')
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null)
  const [commentaire, setCommentaire] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const sidebarItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'generate', label: 'Générer une fiche', icon: Link2 },
    { id: 'registrations', label: 'Fiches inscrites', icon: UserCheck },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3 },
    { id: 'logout', label: 'Déconnexion', icon: LogOut },
  ]

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data)
    } catch {
      toast.error('Erreur lors du chargement des statistiques.')
    }
  }, [])

  const fetchRegistrations = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterStatut !== 'tous') params.set('statut', filterStatut)
      if (filterFiliere !== 'toutes') params.set('filiere', filterFiliere)
      if (searchTerm) params.set('search', searchTerm)
      const res = await fetch(`/api/registration?${params.toString()}`)
      const data = await res.json()
      setRegistrations(data.registrations || [])
    } catch {
      toast.error('Erreur lors du chargement des inscriptions.')
    } finally {
      setLoading(false)
    }
  }, [filterStatut, filterFiliere, searchTerm])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  useEffect(() => {
    if (activeTab === 'registrations') {
      fetchRegistrations()
    }
  }, [activeTab, fetchRegistrations])

  const handleSidebarClick = (id: string) => {
    if (id === 'logout') {
      onLogout()
      return
    }
    setActiveTab(id)
    setSidebarOpen(false)
  }

  const updateStatus = async (id: string, statut: string) => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/registration/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut }),
      })
      if (!res.ok) throw new Error()
      toast.success(`Statut mis à jour : ${statut === 'accepte' ? 'Accepté' : statut === 'refuse' ? 'Refusé' : 'En attente'}`)
      fetchRegistrations()
      fetchStats()
      if (selectedReg) {
        setSelectedReg({ ...selectedReg, statut })
      }
    } catch {
      toast.error('Erreur lors de la mise à jour.')
    } finally {
      setActionLoading(false)
    }
  }

  const saveCommentaire = async (id: string) => {
    try {
      const res = await fetch(`/api/registration/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentaire }),
      })
      if (!res.ok) throw new Error()
      toast.success('Commentaire sauvegardé.')
      if (selectedReg) {
        setSelectedReg({ ...selectedReg, commentaire })
      }
    } catch {
      toast.error('Erreur lors de la sauvegarde.')
    }
  }

  const deleteRegistration = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) return
    try {
      const res = await fetch(`/api/registration/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Inscription supprimée.')
      setSelectedReg(null)
      fetchRegistrations()
      fetchStats()
    } catch {
      toast.error('Erreur lors de la suppression.')
    }
  }

  const generateLink = async () => {
    try {
      const res = await fetch('/api/admin/generate-link')
      const data = await res.json()
      setGeneratedLink(data.link)
    } catch {
      toast.error('Erreur lors de la génération du lien.')
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Lien copié !')
    } catch {
      toast.error('Impossible de copier.')
    }
  }

  const exportData = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const headers = ['Nom', 'Post-nom', 'Prénom', 'Sexe', 'Date naissance', 'WhatsApp', 'Email', 'Filière', 'Statut', 'Date inscription']
      const rows = registrations.map(r => [
        r.nom, r.postnom, r.prenom, r.sexe, r.dateNaissance, r.whatsapp, r.email,
        r.filiere === 'Autre' ? r.filiereAutre || 'Autre' : r.filiere,
        r.statut, new Date(r.createdAt).toLocaleDateString('fr-FR')
      ])
      const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `inscriptions_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Export CSV téléchargé.')
    } else {
      toast.info('Export PDF en cours de développement. Utilisez l\'export CSV pour le moment.')
    }
  }

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'accepte':
        return <Badge className="bg-emerald/10 text-emerald border-emerald/20"><CheckCircle2 className="size-3 mr-1" />Accepté</Badge>
      case 'refuse':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20"><XCircle className="size-3 mr-1" />Refusé</Badge>
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"><Clock className="size-3 mr-1" />En attente</Badge>
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-emerald/30">
            <Image src="/logo.jpeg" alt="Logo" fill className="object-cover" sizes="40px" />
          </div>
          <div>
            <p className="font-serif font-bold text-sm text-foreground">LUVHES FAMILLE</p>
            <p className="text-xs text-muted-foreground">Administration</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => handleSidebarClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-emerald/10 text-emerald'
                  : item.id === 'logout'
                    ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <Icon className="size-4" />
              {item.label}
            </button>
          )
        })}
      </nav>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border/50 bg-card flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-card z-50 md:hidden border-r border-border/50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 md:px-6 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <h2 className="font-serif font-bold text-lg text-foreground truncate">
            {sidebarItems.find((i) => i.id === activeTab)?.label || 'Administration'}
          </h2>
        </header>

        <div className="p-4 md:p-6 max-w-6xl">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="border-emerald/20 bg-gradient-to-br from-emerald/5 to-gold/5">
                <CardContent className="pt-6">
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                    Bienvenue, Administrateur
                  </h3>
                  <p className="text-muted-foreground">
                    Gérez les inscriptions et suivez les statistiques de l&apos;ONGD LUVHES FAMILLE ESENGO.
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border/50">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center">
                        <Users className="size-5 text-emerald" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stats?.total || 0}</p>
                        <p className="text-xs text-muted-foreground">Total inscriptions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                        <Clock className="size-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stats?.enAttente || 0}</p>
                        <p className="text-xs text-muted-foreground">En attente</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center">
                        <CheckCircle2 className="size-5 text-emerald" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stats?.acceptes || 0}</p>
                        <p className="text-xs text-muted-foreground">Acceptés</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <XCircle className="size-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stats?.refuses || 0}</p>
                        <p className="text-xs text-muted-foreground">Refusés</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Generate Link */}
          {activeTab === 'generate' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Générer le lien d&apos;inscription</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={generateLink}
                    className="bg-emerald hover:bg-emerald/90 text-white"
                  >
                    <Link2 className="size-4 mr-2" />
                    Générer le lien d&apos;inscription
                  </Button>

                  {generatedLink && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2">
                        <Input value={generatedLink} readOnly className="flex-1 font-mono text-sm" />
                        <Button variant="outline" size="icon" onClick={() => copyToClipboard(generatedLink)}>
                          <Copy className="size-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">Partager via :</p>
                        <div className="flex flex-wrap gap-2">
                          <Button asChild variant="outline" size="sm" className="gap-1.5">
                            <a href={`https://wa.me/?text=Inscrivez-vous%20sur%20le%20formulaire%20officiel%20de%20l'ONGD%20LUVHES%20FAMILLE%20ESENGO%20:%20${encodeURIComponent(generatedLink)}`} target="_blank" rel="noopener noreferrer">
                              <MessageCircle className="size-4" /> WhatsApp
                            </a>
                          </Button>
                          <Button asChild variant="outline" size="sm" className="gap-1.5">
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generatedLink)}`} target="_blank" rel="noopener noreferrer">
                              <Facebook className="size-4" /> Facebook
                            </a>
                          </Button>
                          <Button asChild variant="outline" size="sm" className="gap-1.5">
                            <a href={`mailto:?subject=Inscription ONGD LUVHES FAMILLE ESENGO&body=Inscrivez-vous%20:%20${encodeURIComponent(generatedLink)}`}>
                              <Mail className="size-4" /> Email
                            </a>
                          </Button>
                          <Button asChild variant="outline" size="sm" className="gap-1.5">
                            <a href={`sms:?body=Inscrivez-vous%20:%20${encodeURIComponent(generatedLink)}`}>
                              <Smartphone className="size-4" /> SMS
                            </a>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Registrations List */}
          {activeTab === 'registrations' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Filters */}
              <Card className="border-border/50">
                <CardContent className="pt-4 pb-4 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher par nom, email, WhatsApp..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={filterStatut} onValueChange={setFilterStatut}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Tous</SelectItem>
                        <SelectItem value="en_attente">En attente</SelectItem>
                        <SelectItem value="accepte">Accepté</SelectItem>
                        <SelectItem value="refuse">Refusé</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterFiliere} onValueChange={setFilterFiliere}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filière" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="toutes">Toutes</SelectItem>
                        {FILIERES.map((f) => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportData('csv')} className="gap-1.5">
                      <Download className="size-3.5" /> Export CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportData('pdf')} className="gap-1.5">
                      <Download className="size-3.5" /> Export PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* List */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="size-8 animate-spin text-emerald" />
                </div>
              ) : registrations.length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="pt-8 pb-8 text-center">
                    <Users className="size-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">Aucune inscription trouvée.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {registrations.map((reg) => (
                    <Card
                      key={reg.id}
                      className="border-border/50 cursor-pointer hover:border-emerald/30 hover:shadow-md transition-all duration-200"
                      onClick={() => { setSelectedReg(reg); setCommentaire(reg.commentaire || '') }}
                    >
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border shrink-0">
                            <Image src={reg.photoPath} alt={`${reg.prenom} ${reg.nom}`} fill className="object-cover" sizes="40px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {reg.nom} {reg.postnom} {reg.prenom}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {reg.filiere === 'Autre' ? reg.filiereAutre : reg.filiere} • {reg.email}
                            </p>
                          </div>
                          <div className="hidden sm:block">
                            {getStatusBadge(reg.statut)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Detail Dialog */}
              <Dialog open={selectedReg !== null} onOpenChange={(open) => { if (!open) setSelectedReg(null) }}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogTitle className="sr-only">Détails de l&apos;inscription</DialogTitle>
                  <DialogDescription className="sr-only">Détails complets de l&apos;inscription sélectionnée</DialogDescription>
                  {selectedReg && (
                    <div className="space-y-5">
                      {/* Photo & Name */}
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald/20 shrink-0">
                          <Image src={selectedReg.photoPath} alt={`${selectedReg.prenom} ${selectedReg.nom}`} fill className="object-cover" sizes="80px" />
                        </div>
                        <div>
                          <h3 className="font-serif text-xl font-bold text-foreground">
                            {selectedReg.nom} {selectedReg.postnom} {selectedReg.prenom}
                          </h3>
                          <div className="mt-1">{getStatusBadge(selectedReg.statut)}</div>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="text-muted-foreground">Sexe:</span> <span className="font-medium ml-1">{selectedReg.sexe}</span></div>
                        <div><span className="text-muted-foreground">Naissance:</span> <span className="font-medium ml-1">{selectedReg.dateNaissance}</span></div>
                        <div><span className="text-muted-foreground">WhatsApp:</span> <span className="font-medium ml-1">{selectedReg.whatsapp}</span></div>
                        <div><span className="text-muted-foreground">Email:</span> <span className="font-medium ml-1 break-all">{selectedReg.email}</span></div>
                        <div className="col-span-2"><span className="text-muted-foreground">Filière:</span> <span className="font-medium ml-1">{selectedReg.filiere === 'Autre' ? selectedReg.filiereAutre : selectedReg.filiere}</span></div>
                        <div className="col-span-2"><span className="text-muted-foreground">Inscrit le:</span> <span className="font-medium ml-1">{new Date(selectedReg.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateStatus(selectedReg.id, 'accepte')}
                          disabled={actionLoading || selectedReg.statut === 'accepte'}
                          className="bg-emerald hover:bg-emerald/90 text-white gap-1"
                        >
                          <CheckCircle2 className="size-3.5" /> Accepter
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(selectedReg.id, 'refuse')}
                          disabled={actionLoading || selectedReg.statut === 'refuse'}
                          className="text-red-500 border-red-200 hover:bg-red-50 gap-1"
                        >
                          <XCircle className="size-3.5" /> Refuser
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(selectedReg.id, 'en_attente')}
                          disabled={actionLoading || selectedReg.statut === 'en_attente'}
                          className="gap-1"
                        >
                          <Clock className="size-3.5" /> Remettre en attente
                        </Button>
                      </div>

                      {/* Commentaire */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Commentaire</label>
                        <Textarea
                          value={commentaire}
                          onChange={(e) => setCommentaire(e.target.value)}
                          placeholder="Ajouter un commentaire..."
                          rows={3}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => saveCommentaire(selectedReg.id)}
                          className="gap-1"
                        >
                          <Check className="size-3.5" /> Sauvegarder
                        </Button>
                      </div>

                      {/* Delete */}
                      <div className="pt-2 border-t border-border/50">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteRegistration(selectedReg.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-1"
                        >
                          <Trash2 className="size-3.5" /> Supprimer cette inscription
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </motion.div>
          )}

          {/* Statistics */}
          {activeTab === 'statistics' && stats && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'Total', value: stats.total, icon: Users, color: 'emerald' },
                  { label: 'Hommes', value: stats.hommes, icon: Users, color: 'blue' },
                  { label: 'Femmes', value: stats.femmes, icon: Users, color: 'pink' },
                  { label: 'Acceptés', value: stats.acceptes, icon: CheckCircle2, color: 'emerald' },
                  { label: 'Refusés', value: stats.refuses, icon: XCircle, color: 'red' },
                  { label: 'En attente', value: stats.enAttente, icon: Clock, color: 'yellow' },
                ].map((s) => {
                  const Icon = s.icon
                  return (
                    <Card key={s.label} className="border-border/50">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-${s.color}-500/10 flex items-center justify-center`}>
                            <Icon className={`size-5 text-${s.color}-500`} />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-foreground">{s.value}</p>
                            <p className="text-xs text-muted-foreground">{s.label}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Filiere Distribution Chart */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Répartition par filière</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(stats.filiereDistribution).length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Aucune donnée disponible.</p>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(stats.filiereDistribution)
                        .sort(([, a], [, b]) => b - a)
                        .map(([filiere, count]) => {
                          const maxCount = Math.max(...Object.values(stats.filiereDistribution))
                          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0
                          return (
                            <div key={filiere} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-foreground">{filiere}</span>
                                <span className="text-muted-foreground">{count}</span>
                              </div>
                              <div className="h-6 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-emerald/70 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 0.8, ease: 'easeOut' }}
                                />
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  /* ─── HASH-BASED ROUTING STATE ─── */
  const [currentView, setCurrentView] = useState<'main' | 'inscription' | 'admin'>('main')
  const [adminMode, setAdminMode] = useState(false)
  const [adminToken, setAdminToken] = useState('')
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  /* ─── EXISTING STATE ─── */
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [galleryFilter, setGalleryFilter] = useState('Tous')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [formSubmitting, setFormSubmitting] = useState(false)

  /* ─── SCROLL TRACKING ─── */
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  /* ─── HASH ROUTING ─── */
  useEffect(() => {
    const updateView = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'inscription') {
        setCurrentView('inscription')
      } else if (hash === 'admin') {
        if (adminMode) {
          setCurrentView('admin')
        } else {
          setCurrentView('main')
          window.location.hash = '#accueil'
        }
      } else {
        setCurrentView('main')
      }
    }
    updateView()
    window.addEventListener('hashchange', updateView)
    return () => window.removeEventListener('hashchange', updateView)
  }, [adminMode])

  /* ─── CHECK ADMIN TOKEN ON MOUNT ─── */
  useEffect(() => {
    const storedToken = localStorage.getItem('ongd_admin_token')
    if (storedToken) {
      setAdminToken(storedToken)
      setAdminMode(true)
    }
  }, [])

  /* ─── ADMIN LOGIN ─── */
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setLoginError(data.error || 'Mot de passe incorrect.')
        return
      }
      localStorage.setItem('ongd_admin_token', data.token)
      setAdminToken(data.token)
      setAdminMode(true)
      setShowLoginDialog(false)
      setLoginPassword('')
      setLoginError('')
      window.location.hash = '#admin'
    } catch {
      setLoginError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setLoginLoading(false)
    }
  }

  /* ─── ADMIN LOGOUT ─── */
  const handleAdminLogout = () => {
    localStorage.removeItem('ongd_admin_token')
    setAdminToken('')
    setAdminMode(false)
    window.location.hash = '#accueil'
    toast.success('Déconnexion réussie.')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ─── SMOOTH SCROLL ─── */
  const scrollTo = useCallback((href: string) => {
    setMobileMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  /* ─── GALLERY HELPERS ─── */
  const filteredImages = galleryFilter === 'Tous'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter((img) => img.category === galleryFilter)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex <= 0 ? filteredImages.length - 1 : lightboxIndex - 1)
    }
  }
  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex >= filteredImages.length - 1 ? 0 : lightboxIndex + 1)
    }
  }

  /* ─── CONTACT FORM ─── */
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Erreur réseau')
      toast.success('Message envoyé avec succès ! Nous vous répondrons bientôt.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast.error("Erreur lors de l'envoi du message. Veuillez réessayer.")
    } finally {
      setFormSubmitting(false)
    }
  }

  /* ─── NAVIGATE BACK FROM REGISTRATION ─── */
  const navigateToMain = useCallback(() => {
    window.location.hash = '#accueil'
  }, [])

  /* ═══════════════════════════════════════════════════════════
     RENDER - VIEW SWITCHING
     ═══════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ADMIN LOGIN DIALOG */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="max-w-sm">
          <DialogTitle className="text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-emerald/30">
                <Image src="/logo.jpeg" alt="Logo" fill className="object-cover" sizes="64px" />
              </div>
              <span className="font-serif text-lg font-bold">Administration ONGD LUVHES FAMILLE ESENGO</span>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">Connexion à l&apos;interface d&apos;administration</DialogDescription>
          <form onSubmit={handleAdminLogin} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="admin-password">Mot de passe</label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Entrez le mot de passe"
                value={loginPassword}
                onChange={(e) => { setLoginPassword(e.target.value); setLoginError('') }}
                required
                autoFocus
              />
            </div>
            {loginError && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-2 rounded-lg">
                <AlertTriangle className="size-4 shrink-0" />
                {loginError}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-emerald hover:bg-emerald/90 text-white"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Connexion...
                </span>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* VIEW SWITCHING */}
      <AnimatePresence mode="wait">
        {currentView === 'inscription' && (
          <motion.div
            key="inscription"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <RegistrationView onBack={navigateToMain} />
          </motion.div>
        )}

        {currentView === 'admin' && adminMode && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminDashboard onLogout={handleAdminLogout} token={adminToken} />
          </motion.div>
        )}

        {currentView === 'main' && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="min-h-screen flex flex-col">
              {/* ────────────────────────────────────────────────────────
                  1. NAVIGATION
                  ──────────────────────────────────────────────────────── */}
              <motion.header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                  scrolled
                    ? 'bg-background/80 backdrop-blur-xl shadow-lg border-b border-border/50'
                    : 'bg-transparent'
                }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
                  {/* Logo */}
                  <a
                    href="#accueil"
                    onClick={(e) => { e.preventDefault(); scrollTo('#accueil') }}
                    className="flex items-center gap-3 group"
                  >
                    <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-emerald/30 group-hover:ring-gold/50 transition-all duration-300">
                      <Image
                        src="/logo.jpeg"
                        alt="ONGD Luvhes Famille Esengo"
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <span className={`font-serif font-bold text-sm md:text-lg transition-colors duration-300 ${
                      scrolled ? 'text-foreground' : 'text-white'
                    }`}>
                      LUVHES FAMILLE ESENGO
                    </span>
                  </a>

                  {/* Desktop Nav */}
                  <div className="hidden lg:flex items-center gap-1">
                    {NAV_LINKS.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                          scrolled
                            ? 'text-foreground/80 hover:text-foreground hover:bg-emerald/10'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>

                  {/* Mobile Menu */}
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`lg:hidden ${scrolled ? 'text-foreground' : 'text-white'}`}
                        aria-label="Ouvrir le menu"
                      >
                        <Menu className="size-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] bg-background">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-emerald/30">
                            <Image src="/logo.jpeg" alt="Logo" fill className="object-cover" sizes="40px" />
                          </div>
                          <span className="font-serif text-sm">LUVHES FAMILLE ESENGO</span>
                        </SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col gap-1 px-4 mt-4">
                        {NAV_LINKS.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
                            className="px-4 py-3 rounded-lg text-foreground/80 hover:text-foreground hover:bg-emerald/10 transition-all duration-200 font-medium"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>
                </nav>
              </motion.header>

              {/* ────────────────────────────────────────────────────────
                  2. HERO SECTION
                  ──────────────────────────────────────────────────────── */}
              <section
                id="accueil"
                ref={heroRef}
                className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
              >
                {/* Parallax Background */}
                <motion.div
                  className="absolute inset-0 z-0"
                  style={{ y: heroY }}
                >
                  <Image
                    src="/gallery1.jpg"
                    alt="ONGD Luvhes Famille Esengo"
                    fill
                    className="object-cover scale-110"
                    priority
                    sizes="100vw"
                  />
                </motion.div>

                {/* Dark Overlay */}
                <div className="hero-overlay absolute inset-0 z-[1]" />

                {/* Decorative Floating Circles */}
                <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
                  <motion.div
                    className="absolute top-[15%] left-[10%] w-32 h-32 rounded-full border border-white/10"
                    animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute bottom-[20%] right-[15%] w-24 h-24 rounded-full border border-gold/20"
                    animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute top-[60%] left-[70%] w-16 h-16 rounded-full bg-emerald/10"
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute top-[25%] right-[25%] w-20 h-20 rounded-full bg-gold/5"
                    animate={{ y: [0, 18, 0], x: [0, 8, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>

                {/* Hero Content */}
                <motion.div
                  className="relative z-[3] text-center px-4 max-w-4xl mx-auto"
                  style={{ opacity: heroOpacity }}
                >
                  <motion.h1
                    className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  >
                    <span className="gradient-text">ONGD LUVHES</span>
                    <br />
                    <span className="gradient-text">FAMILLE ESENGO</span>
                  </motion.h1>

                  <motion.div
                    className="shimmer inline-block mb-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                  >
                    <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gold tracking-wider">
                      SAUVÉ POUR SERVIR
                    </span>
                  </motion.div>

                  <motion.p
                    className="text-white/70 text-lg md:text-xl mb-10 tracking-widest"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    Espoir • Solidarité • Amour • Compassion
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                  >
                    <Button
                      onClick={() => scrollTo('#apropos')}
                      size="lg"
                      className="bg-emerald hover:bg-emerald/90 text-white px-8 py-6 text-lg rounded-full shadow-xl shadow-emerald/30 hover:shadow-emerald/50 transition-all duration-300 hover:scale-105"
                    >
                      <Sparkles className="size-5 mr-2" />
                      Découvrir Notre Mission
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3]"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ChevronDown className="size-8 text-white/60" />
                </motion.div>
              </section>

              {/* ────────────────────────────────────────────────────────
                  3. ABOUT / PRESENTATION SECTION
                  ──────────────────────────────────────────────────────── */}
              <section id="apropos" className="py-20 md:py-28 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <SectionHeader title="Qui Sommes-Nous ?" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {ABOUT_CARDS.map((card, index) => {
                      const Icon = card.icon
                      return (
                        <motion.div
                          key={card.title}
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-50px' }}
                          transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                        >
                          <Card className="h-full group hover:shadow-xl hover:shadow-emerald/5 transition-all duration-500 hover:-translate-y-1 border-border/50">
                            <CardHeader>
                              <div className="w-14 h-14 rounded-xl bg-emerald/10 flex items-center justify-center mb-2 group-hover:bg-emerald/20 transition-colors duration-300">
                                <Icon className="size-7 text-emerald" />
                              </div>
                              <CardTitle className="font-serif text-xl text-foreground">
                                {card.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground leading-relaxed">{card.text}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </section>

              {/* ────────────────────────────────────────────────────────
                  4. COORDONNATRICE SECTION
                  ──────────────────────────────────────────────────────── */}
              <section id="coordonnatrice" className="py-20 md:py-28 bg-warm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <SectionHeader title="Notre Coordonnatrice" />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Photo */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="flex justify-center"
                    >
                      <div className="relative">
                        {/* Glow ring */}
                        <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-emerald/20 via-gold/20 to-emerald/20 pulse-glow" />
                        {/* Frame */}
                        <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-2xl overflow-hidden ring-4 ring-gold/50 animate-float">
                          <Image
                            src="/coordinatrice.jpg"
                            alt="Madame Micheline Omokoko"
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 288px, 320px"
                          />
                        </div>
                        {/* Decorative badge */}
                        <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-emerald flex items-center justify-center shadow-lg">
                          <Heart className="size-7 text-white" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Bio */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                      <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                        Madame Micheline Omokoko
                      </h3>
                      <p className="text-emerald font-semibold text-lg mb-6 flex items-center gap-2">
                        <Sparkles className="size-5" />
                        Coordonnatrice Générale
                      </p>
                      <p className="text-muted-foreground leading-relaxed mb-8 text-base md:text-lg">
                        Femme de vision et de cœur, Madame Micheline Omokoko incarne l&apos;esprit même de l&apos;ONGD Luvhes Famille Esengo. Son leadership exemplaire, son engagement humanitaire sans faille et sa compassion pour les plus vulnérables ont permis de transformer d&apos;innombrables vies. Sous sa direction, l&apos;organisation a étendu ses actions à de nombreuses communautés, apportant espoir, dignité et opportunités aux familles qui en avaient le plus besoin. Sa conviction profonde que chaque vie mérite d&apos;être sauvée et servie guide chaque action de l&apos;ONGD.
                      </p>

                      {/* Quote */}
                      <div className="relative bg-background rounded-xl p-6 border-l-4 border-gold">
                        <Quote className="absolute top-4 left-4 size-8 text-gold/30" />
                        <p className="font-serif text-lg md:text-xl text-foreground italic pl-8">
                          « Chaque acte de compassion est une graine d&apos;espoir qui transforme une vie. »
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* ────────────────────────────────────────────────────────
                  5. IMPACT & RÉALISATIONS SECTION
                  ──────────────────────────────────────────────────────── */}
              <section id="impact" className="py-20 md:py-28 bg-background relative overflow-hidden">
                {/* Subtle Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald/[0.03] via-transparent to-gold/[0.03] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                  <SectionHeader title="Notre Impact" />

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {IMPACT_STATS.map((stat, index) => {
                      const Icon = stat.icon
                      return (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-50px' }}
                          transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
                        >
                          <Card className="text-center h-full hover:shadow-xl hover:shadow-emerald/5 transition-all duration-500 hover:-translate-y-1 border-border/50">
                            <CardContent className="pt-8 pb-6">
                              <div className="w-14 h-14 rounded-xl bg-emerald/10 flex items-center justify-center mx-auto mb-4">
                                <Icon className="size-7 text-emerald" />
                              </div>
                              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                              <p className="text-muted-foreground mt-2 text-sm md:text-base">{stat.label}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </section>

              {/* ────────────────────────────────────────────────────────
                  6. GALLERY SECTION
                  ──────────────────────────────────────────────────────── */}
              <section id="galerie" className="py-20 md:py-28 bg-warm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <SectionHeader title="Notre Galerie" />

                  {/* Filter Buttons */}
                  <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {GALLERY_CATEGORIES.map((cat) => (
                      <Button
                        key={cat}
                        variant={galleryFilter === cat ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setGalleryFilter(cat)}
                        className={`rounded-full transition-all duration-300 ${
                          galleryFilter === cat
                            ? 'bg-emerald text-white shadow-lg shadow-emerald/20'
                            : 'hover:bg-emerald/10 hover:text-emerald hover:border-emerald/30'
                        }`}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>

                  {/* Gallery Grid */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={galleryFilter}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {filteredImages.map((img, index) => (
                        <motion.div
                          key={img.src}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.4, delay: index * 0.08 }}
                          className={`group relative overflow-hidden rounded-xl cursor-pointer ${
                            index === 0 ? 'sm:row-span-2' : ''
                          } ${index === 0 ? 'min-h-[300px] sm:min-h-0' : 'min-h-[250px]'}`}
                          onClick={() => openLightbox(index)}
                        >
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                            <div className="p-4 w-full">
                              <span className="inline-block px-3 py-1 rounded-full bg-emerald/80 text-white text-sm font-medium">
                                {img.category}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>

                  {/* Lightbox Dialog */}
                  <Dialog open={lightboxIndex !== null} onOpenChange={(open) => { if (!open) closeLightbox() }}>
                    <DialogContent className="max-w-5xl w-[95vw] bg-black/95 border-white/10 p-0 overflow-hidden" showCloseButton={false}>
                      <DialogTitle className="sr-only">
                        {lightboxIndex !== null ? filteredImages[lightboxIndex]?.alt : 'Galerie'}
                      </DialogTitle>
                      <DialogDescription className="sr-only">
                        Navigation dans la galerie photos
                      </DialogDescription>
                      {lightboxIndex !== null && filteredImages[lightboxIndex] && (
                        <div className="relative w-full aspect-[4/3]">
                          <Image
                            src={filteredImages[lightboxIndex].src}
                            alt={filteredImages[lightboxIndex].alt}
                            fill
                            className="object-contain"
                            sizes="95vw"
                          />

                          {/* Close */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 z-10"
                            onClick={closeLightbox}
                          >
                            <X className="size-6" />
                          </Button>

                          {/* Prev */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:bg-white/10 z-10 rounded-full"
                            onClick={prevImage}
                          >
                            <ArrowLeft className="size-6" />
                          </Button>

                          {/* Next */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:bg-white/10 z-10 rounded-full"
                            onClick={nextImage}
                          >
                            <ArrowRight className="size-6" />
                          </Button>

                          {/* Caption */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald/80 text-white text-sm font-medium">
                              {filteredImages[lightboxIndex].category}
                            </span>
                            <p className="text-white mt-2 font-medium">{filteredImages[lightboxIndex].alt}</p>
                            <p className="text-white/50 text-sm">{lightboxIndex + 1} / {filteredImages.length}</p>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </section>

              {/* ────────────────────────────────────────────────────────
                  7. DONATIONS SECTION
                  ──────────────────────────────────────────────────────── */}
              <section id="dons" className="py-20 md:py-28 bg-background relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] via-transparent to-emerald/[0.03] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                  <SectionHeader
                    title="Soutenez Notre Action"
                    subtitle="Chaque don compte. Ensemble, nous pouvons transformer des vies."
                  />

                  <motion.p
                    className="text-center text-muted-foreground max-w-2xl mx-auto mb-12 text-base md:text-lg leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Vos dons permettent de financer des projets éducatifs, des campagnes de santé,
                    le soutien alimentaire des familles vulnérables, la formation professionnelle
                    des jeunes et l&apos;assistance aux personnes déplacées. Chaque contribution,
                    quelle que soit sa taille, fait une différence réelle.
                  </motion.p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {DONATION_METHODS.map((method, index) => {
                      const Icon = method.icon
                      return (
                        <motion.div
                          key={method.name}
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-30px' }}
                          transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                        >
                          <Card
                            className="donate-card h-full hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-border/50"
                            style={{ '--method-color': method.color } as React.CSSProperties}
                          >
                            <CardContent className="pt-6 pb-6">
                              <div className="flex items-start gap-4">
                                <div
                                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: method.bgColor, color: method.color }}
                                >
                                  <Icon className="size-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-foreground mb-1">{method.name}</h3>
                                  <p className="text-muted-foreground font-mono text-sm break-all">
                                    {method.number}
                                  </p>
                                </div>
                                <CopyButton text={method.number.replace('N° Compte ', '')} />
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </section>

              {/* ────────────────────────────────────────────────────────
                  8. CONTACT SECTION
                  ──────────────────────────────────────────────────────── */}
              <section id="contact" className="py-20 md:py-28 bg-warm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <SectionHeader title="Contactez-Nous" />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                    {/* Contact Info */}
                    <motion.div
                      initial={{ opacity: 0, x: -40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="space-y-6"
                    >
                      <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                        Restons en Contact
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Nous sommes à votre écoute. N&apos;hésitez pas à nous contacter pour toute question,
                        suggestion ou proposition de collaboration.
                      </p>

                      <div className="space-y-4">
                        <a
                          href="mailto:michelineomokoko70@gmail.com"
                          className="flex items-center gap-4 p-4 rounded-xl bg-background hover:shadow-md transition-all duration-300 group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center group-hover:bg-emerald/20 transition-colors">
                            <Mail className="size-5 text-emerald" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium text-foreground">michelineomokoko70@gmail.com</p>
                          </div>
                        </a>

                        <a
                          href="tel:+243811861032"
                          className="flex items-center gap-4 p-4 rounded-xl bg-background hover:shadow-md transition-all duration-300 group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                            <Phone className="size-5 text-gold-dark" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Téléphone</p>
                            <p className="font-medium text-foreground">+243 811 861 032</p>
                          </div>
                        </a>

                        <div className="flex items-center gap-4 p-4 rounded-xl bg-background">
                          <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center">
                            <MapPin className="size-5 text-emerald" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Adresse</p>
                            <p className="font-medium text-foreground">République Démocratique du Congo</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                      initial={{ opacity: 0, x: 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                      <Card className="border-border/50">
                        <CardContent className="pt-6">
                          <form onSubmit={handleFormSubmit} className="space-y-5">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground" htmlFor="name">
                                Nom complet
                              </label>
                              <Input
                                id="name"
                                name="name"
                                placeholder="Votre nom complet"
                                value={formData.name}
                                onChange={handleFormChange}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground" htmlFor="email">
                                Adresse email
                              </label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="votre@email.com"
                                value={formData.email}
                                onChange={handleFormChange}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground" htmlFor="subject">
                                Sujet
                              </label>
                              <Input
                                id="subject"
                                name="subject"
                                placeholder="Sujet de votre message"
                                value={formData.subject}
                                onChange={handleFormChange}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground" htmlFor="message">
                                Message
                              </label>
                              <Textarea
                                id="message"
                                name="message"
                                placeholder="Écrivez votre message ici..."
                                rows={5}
                                value={formData.message}
                                onChange={handleFormChange}
                                required
                              />
                            </div>

                            <Button
                              type="submit"
                              size="lg"
                              disabled={formSubmitting}
                              className="w-full bg-emerald hover:bg-emerald/90 text-white rounded-lg shadow-lg shadow-emerald/20 transition-all duration-300 hover:scale-[1.02]"
                            >
                              {formSubmitting ? (
                                <span className="flex items-center gap-2">
                                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  Envoi en cours...
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  <Send className="size-4" />
                                  Envoyer le Message
                                </span>
                              )}
                            </Button>
                          </form>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* ────────────────────────────────────────────────────────
                  9. MESSAGES SECTION
                  ──────────────────────────────────────────────────────── */}
              <section className="py-20 md:py-28 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <SectionHeader title="Écrivez-Nous Directement" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* WhatsApp Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                      <Card className="h-full border-emerald/20 hover:shadow-xl hover:shadow-emerald/10 transition-all duration-500 hover:-translate-y-1">
                        <CardContent className="pt-8 pb-6 text-center">
                          <div className="w-16 h-16 rounded-2xl bg-emerald/10 flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="size-8 text-emerald" />
                          </div>
                          <h3 className="font-serif text-xl font-bold text-foreground mb-2">WhatsApp</h3>
                          <p className="text-muted-foreground mb-1">+243 811 861 032</p>
                          <p className="text-sm text-muted-foreground mb-6">
                            Écrivez-nous directement sur WhatsApp
                          </p>
                          <Button
                            asChild
                            className="bg-emerald hover:bg-emerald/90 text-white rounded-full shadow-lg shadow-emerald/20 transition-all duration-300 hover:scale-105"
                          >
                            <a
                              href="https://wa.me/243811861032?text=Bonjour%20Madame%20la%20Coordonnatrice%2C%20je%20souhaite%20obtenir%20plus%20d%27informations%20concernant%20les%20activit%C3%A9s%20de%20l%27ONGD%20Luvhes%20Famille%20Esengo."
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MessageCircle className="size-4 mr-2" />
                              Ouvrir WhatsApp
                              <ExternalLink className="size-3 ml-1" />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Email Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                    >
                      <Card className="h-full border-gold/20 hover:shadow-xl hover:shadow-gold/10 transition-all duration-500 hover:-translate-y-1">
                        <CardContent className="pt-8 pb-6 text-center">
                          <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                            <Mail className="size-8 text-gold-dark" />
                          </div>
                          <h3 className="font-serif text-xl font-bold text-foreground mb-2">Email</h3>
                          <p className="text-muted-foreground mb-1 text-sm break-all">michelineomokoko70@gmail.com</p>
                          <p className="text-sm text-muted-foreground mb-6">
                            Envoyez-nous un email directement
                          </p>
                          <Button
                            asChild
                            className="bg-gold-dark hover:bg-gold-dark/90 text-white rounded-full shadow-lg shadow-gold/20 transition-all duration-300 hover:scale-105"
                          >
                            <a
                              href="mailto:michelineomokoko70@gmail.com?subject=Demande%20d%27informations%20sur%20l%27ONGD%20Luvhes%20Famille%20Esengo&body=Bonjour%20Madame%20la%20Coordonnatrice%2C%0A%0AJe%20souhaite%20obtenir%20davantage%20d%27informations%20concernant%20les%20activit%C3%A9s%20et%20projets%20de%20l%27ONGD%20Luvhes%20Famille%20Esengo.%0A%0AMerci%20d%27avance%20pour%20votre%20retour.%0A%0ACordialement."
                            >
                              <Mail className="size-4 mr-2" />
                              Envoyer un Email
                              <ExternalLink className="size-3 ml-1" />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* ────────────────────────────────────────────────────────
                  10. FACEBOOK SECTION
                  ──────────────────────────────────────────────────────── */}
              <section className="py-16 md:py-20 bg-warm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald/10 flex items-center justify-center mx-auto mb-4">
                      <Facebook className="size-8 text-emerald" />
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
                      Suivez-nous sur Facebook
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Restez informés de nos dernières activités et projets en nous suivant sur notre page Facebook.
                    </p>
                    <Button
                      asChild
                      size="lg"
                      className="bg-emerald hover:bg-emerald/90 text-white rounded-full shadow-lg shadow-emerald/20 transition-all duration-300 hover:scale-105"
                    >
                      <a
                        href="https://www.facebook.com/profile.php?id=61590782690731&__tn__=-R"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook className="size-5 mr-2" />
                        Visiter notre page
                        <ExternalLink className="size-4 ml-2" />
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </section>

              {/* ────────────────────────────────────────────────────────
                  11. FOOTER
                  ──────────────────────────────────────────────────────── */}
              <footer className="mt-auto bg-foreground text-background/80">
                {/* Gradient Top Border */}
                <div className="h-1 bg-gradient-to-r from-emerald via-gold to-emerald" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-emerald/50">
                          <Image src="/logo.jpeg" alt="Logo" fill className="object-cover" sizes="40px" />
                        </div>
                        <span className="font-serif font-bold text-background text-sm">
                          LUVHES FAMILLE ESENGO
                        </span>
                      </div>
                      <p className="text-gold font-serif text-lg italic mb-2">Sauvé Pour Servir</p>
                      <p className="text-background/60 text-sm leading-relaxed">
                        ONGD dédiée à l&apos;espoir, la solidarité, l&apos;amour et la compassion
                        pour les familles et communautés vulnérables.
                      </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                      <h4 className="font-semibold text-background mb-4">Liens Rapides</h4>
                      <ul className="space-y-2">
                        {NAV_LINKS.map((link) => (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
                              className="text-background/60 hover:text-gold transition-colors duration-200 text-sm"
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <h4 className="font-semibold text-background mb-4">Contact</h4>
                      <ul className="space-y-3">
                        <li>
                          <a
                            href="mailto:michelineomokoko70@gmail.com"
                            className="text-background/60 hover:text-gold transition-colors duration-200 text-sm flex items-center gap-2"
                          >
                            <Mail className="size-4 shrink-0" />
                            <span className="break-all">michelineomokoko70@gmail.com</span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="tel:+243811861032"
                            className="text-background/60 hover:text-gold transition-colors duration-200 text-sm flex items-center gap-2"
                          >
                            <Phone className="size-4 shrink-0" />
                            +243 811 861 032
                          </a>
                        </li>
                        <li>
                          <span className="text-background/60 text-sm flex items-center gap-2">
                            <MapPin className="size-4 shrink-0" />
                            RDC
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                      <h4 className="font-semibold text-background mb-4">Réseaux Sociaux</h4>
                      <a
                        href="https://www.facebook.com/profile.php?id=61590782690731&__tn__=-R"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 p-3 rounded-xl bg-background/10 hover:bg-emerald/30 transition-all duration-300 group"
                      >
                        <Facebook className="size-5 text-background/70 group-hover:text-emerald transition-colors" />
                        <span className="text-sm text-background/70 group-hover:text-background transition-colors">
                          Facebook
                        </span>
                      </a>
                    </div>
                  </div>

                  {/* Copyright */}
                  <div className="mt-12 pt-8 border-t border-background/10 text-center flex items-center justify-center gap-4">
                    <p className="text-background/50 text-sm">
                      © {new Date().getFullYear()} ONGD Luvhes Famille Esengo. Tous droits réservés.
                    </p>
                    {/* Hidden admin trigger - double click star */}
                    <button
                      onDoubleClick={() => setShowLoginDialog(true)}
                      className="opacity-30 hover:opacity-100 transition-opacity duration-300 cursor-default"
                      aria-label="Admin"
                    >
                      <Sparkles className="size-3 text-background/40" />
                    </button>
                  </div>
                </div>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
