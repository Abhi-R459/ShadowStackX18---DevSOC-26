import React from 'react'

export default function Sidebar(){
  return (
    <aside className="w-72 p-6 bg-gradient-to-b from-slate-950 to-slate-900 border-r border-white/6 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold">TD</div>
        <div>
          <div className="font-semibold">TailDash</div>
          <div className="text-xs text-slate-400">Manager</div>
        </div>
      </div>

      <nav className="space-y-3 text-slate-300">
        <div className="py-2 px-3 rounded-lg bg-white/3">Dashboard</div>
        <div className="py-2 px-3 rounded-lg hover:bg-white/2 cursor-pointer">Analytics</div>
        <div className="py-2 px-3 rounded-lg hover:bg-white/2 cursor-pointer">Accounts</div>
        <div className="py-2 px-3 rounded-lg hover:bg-white/2 cursor-pointer">Agents</div>
        <div className="py-2 px-3 rounded-lg hover:bg-white/2 cursor-pointer">Reports</div>
      </nav>
    </aside>
  )
}
