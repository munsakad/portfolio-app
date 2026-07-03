import { NextResponse } from 'next/server'
import getDb from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function PATCH(_request, { params }) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = params
  const db = getDb()
  const notification = db.prepare('SELECT * FROM notifications WHERE id = ? AND user_id = ?').get(id, user.id)
  if (!notification) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(id, user.id)
  return NextResponse.json({ message: 'Marked as read' })
}

export async function DELETE(_request, { params }) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = params
  const db = getDb()
  const notification = db.prepare('SELECT * FROM notifications WHERE id = ? AND user_id = ?').get(id, user.id)
  if (!notification) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  db.prepare('DELETE FROM notifications WHERE id = ? AND user_id = ?').run(id, user.id)
  return NextResponse.json({ message: 'Deleted' })
}
