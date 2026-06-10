import { getAuthUser } from '@/lib/auth'
import getDb from '@/lib/db'
import SkillsClient from './SkillsClient'

export default function SkillsPage() {
  const user = getAuthUser()
  const db = getDb()
  const skills = db.prepare(
    'SELECT * FROM skills WHERE user_id = ? ORDER BY category, name'
  ).all(user.id)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Skills</h1>
        <p className="text-slate-400 text-sm">Add your technical and professional skills.</p>
      </div>
      <SkillsClient initialSkills={skills} />
    </div>
  )
}
