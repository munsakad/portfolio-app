import { NextResponse } from 'next/server'
import getDb from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET(request) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const limit = Math.min(Number(searchParams.get('limit')) || 10, 50)

  const db = getDb()
  const activity = db.prepare(
    'SELECT * FROM activity_log WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'
  ).all(user.id, limit)

  return NextResponse.json(activity)
}
