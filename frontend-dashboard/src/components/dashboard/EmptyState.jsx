import React from 'react'

export default function EmptyState(){
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="mb-4 opacity-70">
        <path d="M20 16.58A5.5 5.5 0 0014.5 11H14a4 4 0 00-4 4v1" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 16v4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 20v-4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <h2 className="text-xl font-semibold">No call data available</h2>
      <p className="text-slate-400 max-w-md mt-2">Analytics will appear after agents upload and analyze calls.</p>
    </div>
  )
}
