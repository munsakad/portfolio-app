import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import LogoutButton from './LogoutButton'

export default function DashboardLayout({ children }) {
  const user = getAuthUser()
  if (!user) redirect('/auth/login')

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-cyan-400">Portfolio</Link>
            <div className="flex gap-2">
              <Link href="/dashboard"
                className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition">
                Profile
              </Link>
              <Link href="/dashboard/projects"
                className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition">
                Projects
              </Link>
              <Link href="/dashboard/skills"
                className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition">
                Skills
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">{user.name}</span>
            <Link href="/" className="text-xs text-cyan-400 hover:text-cyan-300">View Portfolio</Link>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}
