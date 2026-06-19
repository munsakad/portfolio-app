import { getAuthUser } from '@/lib/auth'
import getDb from '@/lib/db'
import ProfileForm from '../ProfileForm'

export default function ProfilePage() {
  const user = getAuthUser()
  const db = getDb()
  const profile = db.prepare(
    'SELECT id, name, email, title, bio, github, linkedin, website, location, avatar_url FROM users WHERE id = ?'
  ).get(user.id)

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Profile</h1>
        <p className="text-slate-400 text-sm">This information shows on your public portfolio page.</p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  )
}
