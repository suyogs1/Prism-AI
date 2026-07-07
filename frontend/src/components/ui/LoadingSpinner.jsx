export default function LoadingSpinner({ size = 20, color = '#6366f1', className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle
        cx="12" cy="12" r="10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="31.4"
        strokeDashoffset="10"
        opacity="0.3"
      />
      <circle
        cx="12" cy="12" r="10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="8 54"
        strokeDashoffset="0"
      />
    </svg>
  )
}
