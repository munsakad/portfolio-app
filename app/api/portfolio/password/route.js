import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import getDb from '@/lib/db'
import { getAuthUser } from '@/lib/auth'
import { logActivity, notify } from '@/lib/activity'

export async function PATCH(request) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { currentPassword, newPassword } = await request.json()

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Current and new password are required' }, { status: 400 })
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 })
  }

  const db = getDb()
  const record = db.prepare('SELECT password FROM users WHERE id = ?').get(user.id)
  const valid = await bcrypt.compare(currentPassword, record.password)
  if (!valid) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
  }

  const hashed = await bcrypt.hash(newPassword, 10)
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, user.id)

  logActivity(user.id, 'password_changed', 'user', 'Changed account password')
  notify(user.id, 'Password changed', 'Your account password was updated successfully.')

  return NextResponse.json({ message: 'Password updated' })
}
