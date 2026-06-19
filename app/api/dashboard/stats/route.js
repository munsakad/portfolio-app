import { NextResponse } from 'next/server'
import getDb from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getDb()
  const { count: totalProjects } = db.prepare('SELECT COUNT(*) as count FROM projects WHERE user_id = ?').get(user.id)
  const { count: totalSkills } = db.prepare('SELECT COUNT(*) as count FROM skills WHERE user_id = ?').get(user.id)
  const categories = db.prepare(
    "SELECT category, COUNT(*) as count FROM projects WHERE user_id = ? GROUP BY category ORDER BY count DESC"
  ).all(user.id)

  return NextResponse.json({ totalProjects, totalSkills, categories })
}
