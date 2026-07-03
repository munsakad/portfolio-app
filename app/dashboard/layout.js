import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import DashboardShell from './DashboardShell'

export default function DashboardLayout({ children }) {
  const user = getAuthUser()
  if (!user) redirect('/auth/login')

  return <DashboardShell user={user}>{children}</DashboardShell>
}
