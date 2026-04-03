'use client'
import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import type { EditorRef } from 'react-email-editor'
import { type Audience, sendCampaign } from './campaign-actions'

const EmailEditor = dynamic(() => import('react-email-editor'), { ssr: false })

export default function EmailAdminPage() {
  const editorRef = useRef<EditorRef>(null)
  const [audience, setAudience] = useState<Audience>('newsletter')
  const [subject, setSubject] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handleSend = () => {
    if (!subject.trim()) {
      setResult({ success: false, message: 'Please enter a subject line.' })
      return
    }
    editorRef.current?.editor?.exportHtml(async (data) => {
      setSending(true)
      setResult(null)
      try {
        const res = await sendCampaign({
          html: data.html,
          subject,
          audience,
        })
        setResult(res)
      } finally {
        setSending(false)
      }
    })
  }

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-bold tracking-tight">Email Campaign</h1>

      <div className="flex gap-4 items-end flex-wrap">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="audience">
            Audience
          </label>
          <select
            id="audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value as Audience)}
            className="border rounded-lg px-3 py-2 text-sm bg-background"
          >
            <option value="newsletter">Newsletter Subscribers</option>
            <option value="pattern-tester">Pattern Testers</option>
            <option value="all">All Subscribers</option>
          </select>
        </div>

        <div className="space-y-1 flex-1 min-w-60">
          <label className="text-sm font-medium" htmlFor="subject">
            Subject
          </label>
          <input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject line..."
            className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
          />
        </div>

        <button
          type="button"
          onClick={handleSend}
          disabled={sending}
          className="bg-secondary text-white rounded-lg px-6 py-2 text-sm font-bold hover:bg-secondary/90 disabled:opacity-50 transition-colors"
        >
          {sending ? 'Sending…' : 'Send Campaign'}
        </button>
      </div>

      {result && (
        <div
          className={`p-3 rounded-lg text-sm ${
            result.success
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {result.message}
        </div>
      )}

      <div className="border rounded-xl overflow-hidden shadow-sm">
        <EmailEditor ref={editorRef} minHeight="72vh" />
      </div>
    </div>
  )
}
