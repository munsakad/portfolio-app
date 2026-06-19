import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import LogoutButton from './LogoutButton'
import SidebarNav from './SidebarNav'

export default function DashboardLayout({ children }) {
  const user = getAuthUser()
  if (!user) redirect('/auth/login')

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-6 h-16 flex items-center gap-2 border-b border-slate-700 shrink-0">
          <Link href="/" className="text-lg font-bold text-cyan-400">Portfolio</Link>
          <span className="text-xs text-slate-500 font-normal mt-0.5">Dashboard</span>
        </div>

        {/* Nav links */}
        <SidebarNav />

        {/* User block + logout */}
        <div className="px-4 py-4 border-t border-slate-700 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-slate-800/40 border-b border-slate-700 h-16 flex items-center justify-end px-6 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition"
          >
            View Portfolio
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
