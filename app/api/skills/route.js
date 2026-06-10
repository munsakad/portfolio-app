import { NextResponse } from 'next/server'
import getDb from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getDb()
  const skills = db.prepare(
    'SELECT * FROM skills WHERE user_id = ? ORDER BY category, name'
  ).all(user.id)

  return NextResponse.json(skills)
}

export async function POST(request) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, category, level } = await request.json()
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

  const db = getDb()
  const result = db.prepare(
    'INSERT INTO skills (user_id, name, category, level) VALUES (?, ?, ?, ?)'
  ).run(user.id, name, category || 'General', level || 'Intermediate')

  const skill = db.prepare('SELECT * FROM skills WHERE id = ?').get(result.lastInsertRowid)
  return NextResponse.json(skill, { status: 201 })
}
