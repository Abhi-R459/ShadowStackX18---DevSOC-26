import React from 'react'

export default function GlassCard({ children, className = '' }){
  return (
    <div className={`bg-white/3 backdrop-blur-sm border border-white/5 rounded-lg p-4 ${className}`}>
      {children}
    </div>
  )
}
