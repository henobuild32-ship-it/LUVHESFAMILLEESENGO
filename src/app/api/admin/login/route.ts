import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const ADMIN_PASSWORD = '123456'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect.' },
        { status: 401 }
      )
    }

    // Generate a simple token
    const token = `admin_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    // Save session
    await db.adminSession.create({
      data: {
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    })

    return NextResponse.json({ success: true, token })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 }
    )
  }
}
