import { NextResponse } from 'next/server'
import getDb from '@/lib/db'
import { getAuthUser } from '@/lib/auth'
import { logActivity } from '@/lib/activity'

export async function PUT(request, { params }) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, category, level } = await request.json()
  const { id } = params

  const db = getDb()
  const skill = db.prepare('SELECT * FROM skills WHERE id = ? AND user_id = ?').get(id, user.id)
  if (!skill) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  db.prepare(
    'UPDATE skills SET name=?, category=?, level=? WHERE id=? AND user_id=?'
  ).run(name, category, level, id, user.id)

  const updated = db.prepare('SELECT * FROM skills WHERE id = ?').get(id)

  logActivity(user.id, 'skill_updated', 'skill', `Updated skill "${updated.name}"`)

  return NextResponse.json(updated)
}

export async function DELETE(request, { params }) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = params
  const db = getDb()
  const skill = db.prepare('SELECT * FROM skills WHERE id = ? AND user_id = ?').get(id, user.id)
  if (!skill) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  db.prepare('DELETE FROM skills WHERE id = ? AND user_id = ?').run(id, user.id)

  logActivity(user.id, 'skill_deleted', 'skill', `Deleted skill "${skill.name}"`)

  return NextResponse.json({ message: 'Deleted' })
}
