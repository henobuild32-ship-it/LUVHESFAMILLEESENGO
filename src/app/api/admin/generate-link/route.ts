import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // The registration link uses the hash route: /#inscription
    // This is the most reliable approach since we only have the / route
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
    const link = baseUrl ? `${baseUrl}/#inscription` : '/#inscription'

    return NextResponse.json({
      link,
      message: 'Lien d\'inscription généré avec succès.',
    })
  } catch (error) {
    console.error('Generate link error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 }
    )
  }
}
