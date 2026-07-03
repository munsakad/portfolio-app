import ChangePasswordForm from './ChangePasswordForm'

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account security.</p>
      </div>

      <ChangePasswordForm />
    </div>
  )
}
