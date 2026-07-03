import { NextResponse } from 'next/server'
import getDb from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET(request) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50)

  const db = getDb()
  const notifications = db.prepare(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'
  ).all(user.id, limit)
  const { count: unreadCount } = db.prepare(
    'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0'
  ).get(user.id)

  return NextResponse.json({ notifications, unreadCount })
}

export async function PATCH(request) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getDb()
  db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(user.id)

  return NextResponse.json({ message: 'All notifications marked as read' })
}
