// app/login/ToggleLogin.tsx
'use client'

import { useState } from 'react'
import { Briefcase, Home } from 'lucide-react'

export default function ToggleLogin({
  onChange,
}: {
  onChange: (type: 'business' | 'clinic') => void
}) {
  const [type, setType] = useState<'business' | 'clinic'>('business')

  const handleToggle = (newType: 'business' | 'clinic') => {
    setType(newType)
    onChange(newType)
  }

  return (
    <div className="flex bg-white rounded-xl overflow-hidden shadow-sm border w-full max-w-md mb-6">
      <button
        onClick={() => handleToggle('business')}
        className={`w-1/2 py-3 flex items-center justify-center gap-2 text-sm font-medium ${
          type === 'business'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-white text-gray-500'
        }`}
      >
        <Briefcase size={16} />
        Business Login
      </button>
      <button
        onClick={() => handleToggle('clinic')}
        className={`w-1/2 py-3 flex items-center justify-center gap-2 text-sm font-medium ${
          type === 'clinic'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-white text-gray-500'
        }`}
      >
        <Home size={16} />
        Clinic Login
      </button>
    </div>
  )
}
