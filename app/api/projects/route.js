import { NextResponse } from 'next/server'
import getDb from '@/lib/db'
import { getAuthUser } from '@/lib/auth'
import { logActivity, notify } from '@/lib/activity'

export async function GET() {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getDb()
  const projects = db.prepare(
    'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC'
  ).all(user.id)

  return NextResponse.json(projects)
}

export async function POST(request) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, tech_stack, live_url, github_url, image_url, category } = await request.json()

  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

  const db = getDb()
  const result = db.prepare(
    'INSERT INTO projects (user_id, title, description, tech_stack, live_url, github_url, image_url, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(user.id, title, description || '', tech_stack || '', live_url || '', github_url || '', image_url || '', category || 'Other')

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid)

  logActivity(user.id, 'project_created', 'project', `Created project "${project.title}"`)
  notify(user.id, 'Project created', `"${project.title}" was added to your portfolio.`)

  return NextResponse.json(project, { status: 201 })
}
