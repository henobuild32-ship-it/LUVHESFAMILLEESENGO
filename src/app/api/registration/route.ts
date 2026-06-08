import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const nom = formData.get('nom') as string
    const postnom = formData.get('postnom') as string
    const prenom = formData.get('prenom') as string
    const sexe = formData.get('sexe') as string
    const dateNaissance = formData.get('dateNaissance') as string
    const lieuNaissance = formData.get('lieuNaissance') as string
    const nationalite = formData.get('nationalite') as string
    const adresseActuelle = formData.get('adresseActuelle') as string
    const commune = formData.get('commune') as string
    const ville = formData.get('ville') as string
    const whatsapp = formData.get('whatsapp') as string
    const telephoneSecondaire = formData.get('telephoneSecondaire') as string | null
    const email = formData.get('email') as string
    const niveauEtudes = formData.get('niveauEtudes') as string
    const professionActuelle = formData.get('professionActuelle') as string
    const situationMatrimoniale = formData.get('situationMatrimoniale') as string
    const filiere = formData.get('filiere') as string
    const filiereAutre = formData.get('filiereAutre') as string | null
    const engagement = formData.get('engagement') as string
    const photo = formData.get('photo') as File | null

    // Validate required fields
    if (!nom || !postnom || !prenom || !sexe || !dateNaissance || !lieuNaissance ||
        !nationalite || !adresseActuelle || !commune || !ville || !whatsapp || !email ||
        !niveauEtudes || !professionActuelle || !situationMatrimoniale || !filiere) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis.' },
        { status: 400 }
      )
    }

    if (!photo) {
      return NextResponse.json(
        { error: 'La photo passeport est obligatoire.' },
        { status: 400 }
      )
    }

    if (engagement !== 'true') {
      return NextResponse.json(
        { error: 'Vous devez certifier que les informations sont exactes.' },
        { status: 400 }
      )
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide.' },
        { status: 400 }
      )
    }

    // Validate sexe
    if (!['Masculin', 'Féminin'].includes(sexe)) {
      return NextResponse.json(
        { error: 'Valeur de sexe invalide.' },
        { status: 400 }
      )
    }

    // Validate situation matrimoniale
    if (!['Célibataire', 'Marié(e)', 'Veuf(ve)', 'Divorcé(e)'].includes(situationMatrimoniale)) {
      return NextResponse.json(
        { error: 'Situation matrimoniale invalide.' },
        { status: 400 }
      )
    }

    // Validate filiere
    const validFilieres = [
      'Informatique', 'Alphabétisation', 'Hôtellerie', 'Agriculture et Élevage',
      'Transformation', 'Restauration', 'Peinture', 'Maçonnerie', 'Couture',
      'Électricité', 'Mécanique', 'Entrepreneuriat', 'Autre'
    ]
    if (!validFilieres.includes(filiere)) {
      return NextResponse.json(
        { error: 'Filière invalide.' },
        { status: 400 }
      )
    }

    if (filiere === 'Autre' && (!filiereAutre || filiereAutre.trim() === '')) {
      return NextResponse.json(
        { error: 'Veuillez préciser votre filière.' },
        { status: 400 }
      )
    }

    // Validate photo type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(photo.type)) {
      return NextResponse.json(
        { error: 'Format de photo invalide. Utilisez JPG, JPEG ou PNG.' },
        { status: 400 }
      )
    }

    // Save photo
    const bytes = await photo.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const ext = photo.name.split('.').pop() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
    const filePath = path.join(uploadsDir, fileName)

    await writeFile(filePath, buffer)

    // Save registration to database
    const registration = await db.registration.create({
      data: {
        nom: nom.trim(),
        postnom: postnom.trim(),
        prenom: prenom.trim(),
        sexe,
        dateNaissance,
        lieuNaissance: lieuNaissance.trim(),
        nationalite: nationalite.trim(),
        adresseActuelle: adresseActuelle.trim(),
        commune: commune.trim(),
        ville: ville.trim(),
        whatsapp: whatsapp.trim(),
        telephoneSecondaire: telephoneSecondaire?.trim() || null,
        email: email.trim().toLowerCase(),
        niveauEtudes: niveauEtudes.trim(),
        professionActuelle: professionActuelle.trim(),
        situationMatrimoniale,
        photoPath: `/uploads/${fileName}`,
        filiere,
        filiereAutre: filiere === 'Autre' ? filiereAutre?.trim() : null,
        engagement: true,
      },
    })

    return NextResponse.json(
      { success: true, message: 'Inscription enregistrée avec succès.', id: registration.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statut = searchParams.get('statut')
    const filiere = searchParams.get('filiere')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}

    if (statut && statut !== 'tous') {
      where.statut = statut
    }
    if (filiere && filiere !== 'toutes') {
      where.filiere = filiere
    }
    if (search) {
      where.OR = [
        { nom: { contains: search } },
        { postnom: { contains: search } },
        { prenom: { contains: search } },
        { email: { contains: search } },
        { whatsapp: { contains: search } },
        { ville: { contains: search } },
        { commune: { contains: search } },
      ]
    }

    const registrations = await db.registration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ registrations })
  } catch (error) {
    console.error('Fetch registrations error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 }
    )
  }
}
