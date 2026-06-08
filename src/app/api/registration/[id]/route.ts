import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { unlink } from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const registration = await db.registration.findUnique({
      where: { id },
    })

    if (!registration) {
      return NextResponse.json(
        { error: 'Inscription non trouvée.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ registration })
  } catch (error) {
    console.error('Fetch registration error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { statut, commentaire } = body

    const existing = await db.registration.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Inscription non trouvée.' },
        { status: 404 }
      )
    }

    // Validate statut
    if (statut && !['en_attente', 'accepte', 'refuse'].includes(statut)) {
      return NextResponse.json(
        { error: 'Statut invalide.' },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {}
    if (statut) updateData.statut = statut
    if (commentaire !== undefined) updateData.commentaire = commentaire

    const registration = await db.registration.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ registration })
  } catch (error) {
    console.error('Update registration error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await db.registration.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Inscription non trouvée.' },
        { status: 404 }
      )
    }

    // Delete photo file
    if (existing.photoPath) {
      try {
        const filePath = path.join(process.cwd(), 'public', existing.photoPath)
        await unlink(filePath)
      } catch {
        // Photo file might not exist, continue anyway
      }
    }

    await db.registration.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete registration error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 }
    )
  }
}
