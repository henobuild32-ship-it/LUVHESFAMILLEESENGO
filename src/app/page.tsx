'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import {
  Heart, Eye, Target, HandHeart, ChevronDown, Menu, X, Phone, Mail, MapPin,
  Copy, Check, Send, Facebook, MessageCircle, ArrowLeft, ArrowRight,
  Users, FolderOpen, Globe2, HeartHandshake, Sparkles, Quote, ExternalLink,
  CreditCard, Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { toast } from 'sonner'

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
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  /* ─── STATE ─── */
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

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */
  return (
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
          <div className="mt-12 pt-8 border-t border-background/10 text-center">
            <p className="text-background/50 text-sm">
              © {new Date().getFullYear()} ONGD Luvhes Famille Esengo. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
