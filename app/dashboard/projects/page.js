import { getAuthUser } from '@/lib/auth'
import getDb from '@/lib/db'
import ProjectsClient from './ProjectsClient'

export default function ProjectsPage() {
  const user = getAuthUser()
  const db = getDb()
  const projects = db.prepare(
    'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC'
  ).all(user.id)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Projects</h1>
        <p className="text-slate-400 text-sm">Add and manage your projects. They appear on your public portfolio.</p>
      </div>
      <ProjectsClient initialProjects={projects} />
    </div>
  )
}
