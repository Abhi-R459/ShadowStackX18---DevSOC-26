import React from 'react'
import PageWrapper from '../../components/ui/PageWrapper'
import GlassCard from '../../components/ui/GlassCard'

export default function CustomerDashboard(){
  return (
    <PageWrapper>
      <div className='max-w-3xl mx-auto'>
        <GlassCard>
          <h3 className='mb-2'>Call Summary</h3>
          <div className='text-slate-400'>No recent calls</div>
        </GlassCard>

        <GlassCard className='mt-4'>
          <h4>Payment Commitments</h4>
          <div className='mt-2 text-slate-400'>No commitments</div>
        </GlassCard>
      </div>
    </PageWrapper>
  )
}
