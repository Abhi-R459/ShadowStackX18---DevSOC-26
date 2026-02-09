import React, { useState } from 'react'
import PageWrapper from '../../components/ui/PageWrapper'
import GlassCard from '../../components/ui/GlassCard'
import { uploadAudio } from '../../services/api'

export default function AgentDashboard(){
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('idle')
  const [lastCallId, setLastCallId] = useState(null)
  const [error, setError] = useState(null)

  const onDrop = async (f)=>{
    setFile(f);
    setProgress(0);
    setStatus('Uploading');
    setError(null);
    try{
      const resp = await uploadAudio('/api/agent/upload', f, p=> setProgress(p.percent))
      setLastCallId(resp?.callId || null);
      setStatus('Analysis in progress');
    }catch(e){
      setStatus('error');
      setError(e?.error || e?.message || 'Upload failed');
    }
  }

  return (
    <PageWrapper>
      <div className='grid grid-cols-3 gap-6'>
        <div className='col-span-2'>
          <GlassCard>
            <h3 className='mb-2'>Upload Call Recording</h3>
            <div className='border-dashed border-2 border-white/5 rounded p-6'>
              <input type='file' accept='audio/*' onChange={(e)=> e.target.files?.[0] && onDrop(e.target.files[0])} />
              <div className='mt-4'>Status: {status} {progress>0 && `• ${progress}%`}</div>
              {lastCallId && <div className='mt-2 text-sm text-slate-400'>Call ID: {lastCallId}</div>}
              {error && <div className='mt-2 text-sm text-red-400'>Error: {error}</div>}
            </div>
          </GlassCard>

          <GlassCard className='mt-4'>
            <h3>My Assigned Calls</h3>
            <div className='mt-2 text-slate-400'>No active assignments</div>
          </GlassCard>
        </div>

        <aside>
          <GlassCard>
            <h4>Call Status</h4>
            <div className='mt-2'>
              <div className='text-sm text-slate-400'>Uploading → Transcribing → Analysis in progress</div>
            </div>
          </GlassCard>
        </aside>
      </div>
    </PageWrapper>
  )
}
