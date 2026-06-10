import { NextResponse } from 'next/server'
import getDb from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getDb()
  const profile = db.prepare(
    'SELECT id, name, email, title, bio, github, linkedin, website, location FROM users WHERE id = ?'
  ).get(user.id)

  return NextResponse.json(profile)
}

export async function PUT(request) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, title, bio, github, linkedin, website, location } = await request.json()

  const db = getDb()
  db.prepare(
    'UPDATE users SET name=?, title=?, bio=?, github=?, linkedin=?, website=?, location=? WHERE id=?'
  ).run(name, title, bio, github, linkedin, website, location, user.id)

  return NextResponse.json({ message: 'Profile updated' })
}
