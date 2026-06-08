import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Build the full URL from the incoming request
    const host = request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const baseUrl = host ? `${protocol}://${host}` : ''
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
