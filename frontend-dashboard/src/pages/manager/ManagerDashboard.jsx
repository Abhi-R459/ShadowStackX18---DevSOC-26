import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PageWrapper from '../../components/ui/PageWrapper'
import KPI from '../../components/ui/KPI'
import ChartCard from '../../components/ui/ChartCard'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, ResponsiveContainer, Cell } from 'recharts'
import callBackend from '../../services/api'
import EmptyState from '../../components/dashboard/EmptyState'

export default function ManagerDashboard(){
  const [overview, setOverview] = useState(null)
  const [riskTrend, setRiskTrend] = useState([])
  const [payments, setPayments] = useState([])
  const [agentPerf, setAgentPerf] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted=true; setLoading(true);
    Promise.all([
      callBackend('/api/analytics/manager/overview','GET').catch(()=>null),
      callBackend('/api/analytics/manager/payment-forecast','GET').catch(()=>null),
      callBackend('/api/analytics/manager/risk-by-agent','GET').catch(()=>null),
    ]).then(([ov,pf,rb])=>{
      if(!mounted) return;
      if(ov) {
        setOverview(ov);
        // Respect empty-safe API: if overview indicates no data, leave analytics empty
        if (ov.hasData) {
          setPayments(Array.isArray(pf)?pf:[]);
          setAgentPerf(Array.isArray(rb)?rb:[]);
          setRiskTrend(Array.isArray(pf)?pf:[]);
        } else {
          setPayments([]);
          setAgentPerf([]);
          setRiskTrend([]);
        }
      }
    }).finally(()=>mounted&&setLoading(false))
    return ()=> mounted=false
  },[])

  function openDetail(key){
    // placeholder for drill-in action
    console.log('open detail', key)
  }

  return (
    <PageWrapper>
      <div className="min-h-screen text-white">
        <div className="flex">
          {/* Sidebar */}
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

          {/* Main */}
          <main className="flex-1 p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
            {/* Topbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <input placeholder="Search accounts, agents, calls..." className="bg-white/5 p-2 rounded-lg w-96 text-sm text-slate-200" />
                <div className="text-sm text-slate-400">All time</div>
              </div>
              <div className="flex items-center gap-4">
                <button className="secondary-btn">Export</button>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-medium">Alex Morgan</div>
                    <div className="text-xs text-slate-400">Manager</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">AM</div>
                </div>
              </div>
            </div>

            {(!overview || overview.hasData === false) ? (
              <div className="p-12">
                <EmptyState />
              </div>
            ) : (
              <div className="min-h-screen">
                <div className="grid grid-cols-3 gap-6 items-center mb-6">
                  <div className="col-span-2 card">
                    <h1 className="text-2xl font-semibold tracking-tight">Financial Risk Overview</h1>
                    <p className="mt-3 text-slate-300 max-w-2xl">Portfolio analytics and AI insights for reviewed calls.</p>
                  </div>

                  <div className="card flex flex-col items-center justify-center">
                    <div className="text-slate-300 text-sm mb-2">AI Risk Meter</div>
                    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-red-600/40 to-red-400/20 flex items-center justify-center">
                      <div className="text-3xl font-bold">{overview.complianceScore ?? '—'}</div>
                      <div className="text-xs text-slate-200 mt-1">Compliance</div>
                    </div>
                  </div>
                </div>

                {/* KPI Row */}
                <div className="grid grid-cols-4 gap-4">
                  <motion.div whileHover={{ scale: 1.03 }} className="group card p-6 cursor-pointer" onClick={()=>openDetail('total')}>
                    <KPI title="Total Calls Analyzed" value={overview.totalCallsAnalyzed ?? '—'} change="" />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} className="group card p-6 cursor-pointer" onClick={()=>openDetail('highRisk')}>
                    <KPI title="High Risk Accounts" value={overview.highRiskClients ?? '—'} change="" />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} className="group card p-6 cursor-pointer" onClick={()=>openDetail('broken')}>
                    <KPI title="Promises Broken" value={overview.promisesBroken ?? '—'} change="" />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} className="group card p-6 cursor-pointer" onClick={()=>openDetail('payments')}>
                    <KPI title="Expected Payments Next Month" value={overview.likelyPaymentsNextMonth ?? '—'} change="" />
                  </motion.div>
                </div>

                {/* Trend + AI Insights + Actions */}
                <div className="grid grid-cols-3 gap-6 mt-6">
                  <div className="col-span-2">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-2xl font-semibold tracking-tight">Risk Trend Over Time</h2>
                      <div className="flex items-center gap-3 text-sm text-slate-300">
                        <select className="bg-white/5 p-2 rounded"> <option>Last 3 months</option><option>Last 6 months</option></select>
                        <select className="bg-white/5 p-2 rounded"> <option>All regions</option></select>
                        <select className="bg-white/5 p-2 rounded"> <option>All agents</option></select>
                      </div>
                    </div>

                    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
                      <ChartCard title="Risk Trend">
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={riskTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="month" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip />
                            <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={3} dot={{ r:4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartCard>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <ChartCard title="Payment Forecast">
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={payments}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="month" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" tickFormatter={(v)=>formatCurrency(v)} />
                            <Tooltip formatter={(v)=>formatCurrency(v)} />
                            <Bar dataKey="expected" fill="#38bdf8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartCard>

                      <ChartCard title="Agent Performance">
                        <div className="p-2">
                          <div className="text-slate-400 text-sm mb-2">High-risk calls by agent</div>
                          <div className="space-y-2">
                            {agentPerf.map(a=> (
                              <div key={a.agent} className="flex items-center justify-between">
                                <div>{a.agent}</div>
                                <div className="text-sm text-slate-400">{a.highRiskCount}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </ChartCard>
                    </div>
                  </div>

                  {/* AI Insights + Action Center */}
                  <div className="space-y-4">
                    <div className="card">
                      <h3 className="text-lg font-semibold">AI Insights</h3>
                      <div className="mt-3 text-slate-300">
                        <p>AI insights will be shown here after call analysis.</p>
                      </div>
                    </div>

                    <div className="card">
                      <h3 className="text-lg font-semibold">Action Center</h3>
                      <div className="mt-4 flex flex-col gap-3">
                        <button className="primary-btn">View High Risk Accounts</button>
                        <button className="secondary-btn">Export Compliance Report</button>
                        <button className="secondary-btn">Schedule Agent Review</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </PageWrapper>
  )
}

function formatCurrency(value){
  if (value == null || Number.isNaN(Number(value))) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(value));
}
