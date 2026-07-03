import getDb from '@/lib/db'

export function logActivity(userId, action, entityType, description) {
  const db = getDb()
  db.prepare(
    'INSERT INTO activity_log (user_id, action, entity_type, description) VALUES (?, ?, ?, ?)'
  ).run(userId, action, entityType || '', description)
}

export function notify(userId, title, message) {
  const db = getDb()
  db.prepare(
    'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)'
  ).run(userId, title, message || '')
}
