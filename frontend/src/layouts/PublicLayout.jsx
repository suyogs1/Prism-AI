import { Outlet } from 'react-router-dom'

/**
 * PublicLayout — used for Landing and Judge pages.
 * Full-width, no sidebar.
 */
export default function PublicLayout() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-base)' }}>
      <Outlet />
    </div>
  )
}
