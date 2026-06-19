import { NextResponse } from 'next/server'
import getDb from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function PUT(request, { params }) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, tech_stack, live_url, github_url, image_url, category } = await request.json()
  const { id } = params

  const db = getDb()
  const project = db.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').get(id, user.id)
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  db.prepare(
    'UPDATE projects SET title=?, description=?, tech_stack=?, live_url=?, github_url=?, image_url=?, category=?, updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?'
  ).run(title, description, tech_stack, live_url, github_url, image_url ?? project.image_url, category ?? project.category, id, user.id)

  const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(id)
  return NextResponse.json(updated)
}

export async function DELETE(_request, { params }) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = params
  const db = getDb()
  const project = db.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').get(id, user.id)
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  db.prepare('DELETE FROM projects WHERE id = ? AND user_id = ?').run(id, user.id)
  return NextResponse.json({ message: 'Deleted' })
}
