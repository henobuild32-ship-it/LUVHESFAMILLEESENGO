import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const total = await db.registration.count()
    const hommes = await db.registration.count({ where: { sexe: 'Masculin' } })
    const femmes = await db.registration.count({ where: { sexe: 'Féminin' } })
    const acceptes = await db.registration.count({ where: { statut: 'accepte' } })
    const refuses = await db.registration.count({ where: { statut: 'refuse' } })
    const enAttente = await db.registration.count({ where: { statut: 'en_attente' } })

    // Get filiere distribution
    const allRegistrations = await db.registration.findMany({
      select: { filiere: true },
    })

    const filiereDistribution: Record<string, number> = {}
    for (const reg of allRegistrations) {
      const key = reg.filiere === 'Autre' ? 'Autre' : reg.filiere
      filiereDistribution[key] = (filiereDistribution[key] || 0) + 1
    }

    return NextResponse.json({
      total,
      hommes,
      femmes,
      acceptes,
      refuses,
      enAttente,
      filiereDistribution,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 }
    )
  }
}
