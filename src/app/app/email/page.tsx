'use client'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import type { EditorRef } from 'react-email-editor'
import {
  getWorkshopsForSelection,
  sendCampaign,
  sendTestEmail,
  type Audience,
} from './campaign-actions'

const EmailEditor = dynamic(() => import('react-email-editor'), { ssr: false })

interface Workshop {
  _id: string
  title: string
  date: string
}

export default function EmailAdminPage() {
  const editorRef = useRef<EditorRef>(null)
  const [emailType, setEmailType] = useState<'campaign' | 'followup'>('campaign')
  const [audience, setAudience] = useState<Audience>('newsletter')
  const [followupTarget, setFollowupTarget] = useState<
    'all-customers' | 'workshop-orders'
  >('all-customers')
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>('')
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loadingWorkshops, setLoadingWorkshops] = useState(false)
  const [subject, setSubject] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [testEmail, setTestEmail] = useState('')
  const [sendingTest, setSendingTest] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  useEffect(() => {
    const shouldLoadWorkshops =
      (emailType === 'campaign' && audience === 'workshop-attendees') ||
      (emailType === 'followup' && followupTarget === 'workshop-orders')

    if (shouldLoadWorkshops) {
      setLoadingWorkshops(true)
      getWorkshopsForSelection()
        .then(setWorkshops)
        .catch((err: unknown) => {
          console.error('Failed to load workshops:', err)
          setWorkshops([])
        })
        .finally(() => setLoadingWorkshops(false))
    }
  }, [emailType, audience, followupTarget])

  const handleSendTest = () => {
    if (!subject.trim()) {
      setTestResult({ success: false, message: 'Please enter a subject line.' })
      return
    }
    if (!testEmail.trim()) {
      setTestResult({ success: false, message: 'Please enter a test email address.' })
      return
    }
    editorRef.current?.editor?.exportHtml(async (data) => {
      setSendingTest(true)
      setTestResult(null)
      try {
        const res = await sendTestEmail({ html: data.html, subject, toEmail: testEmail })
        setTestResult(res)
      } finally {
        setSendingTest(false)
      }
    })
  }

  const handleSend = () => {
    if (!subject.trim()) {
      setResult({ success: false, message: 'Please enter a subject line.' })
      return
    }
    if (emailType === 'campaign' && audience === 'workshop-attendees' && !selectedWorkshop) {
      setResult({ success: false, message: 'Please select a workshop.' })
      return
    }
    editorRef.current?.editor?.exportHtml(async (data) => {
      setSending(true)
      setResult(null)
      try {
        const res = await sendCampaign({
          html: data.html,
          subject,
          emailType,
          audience: emailType === 'campaign' ? audience : undefined,
          followupTarget: emailType === 'followup' ? followupTarget : undefined,
          workshopId: selectedWorkshop || undefined,
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

      <div className="flex gap-3 border rounded-lg p-3 bg-muted/40">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value="campaign"
            checked={emailType === 'campaign'}
            onChange={(e) => setEmailType(e.target.value as 'campaign' | 'followup')}
            className="cursor-pointer"
          />
          <span className="text-sm font-medium">Campaign (Subscribers)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value="followup"
            checked={emailType === 'followup'}
            onChange={(e) => setEmailType(e.target.value as 'campaign' | 'followup')}
            className="cursor-pointer"
          />
          <span className="text-sm font-medium">Follow-up Email (Customers)</span>
        </label>
      </div>

      <div className="flex gap-4 items-end flex-wrap">
        {emailType === 'campaign' ? (
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="audience">
              Audience
            </label>
            <select
              id="audience"
              value={audience}
              onChange={(e) => {
                setAudience(e.target.value as Audience)
                setSelectedWorkshop('')
              }}
              className="border rounded-lg px-3 py-2 text-sm bg-background"
            >
              <option value="newsletter">Newsletter Subscribers</option>
              <option value="pattern-tester">Pattern Testers</option>
              <option value="all">All Subscribers</option>
              <option value="workshop-attendees">Workshop Attendees</option>
            </select>
          </div>
        ) : (
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="followup-target">
              Send to
            </label>
            <select
              id="followup-target"
              value={followupTarget}
              onChange={(e) => {
                setFollowupTarget(e.target.value as 'all-customers' | 'workshop-orders')
                setSelectedWorkshop('')
              }}
              className="border rounded-lg px-3 py-2 text-sm bg-background"
            >
              <option value="all-customers">All Customers</option>
              <option value="workshop-orders">Workshop Customers</option>
            </select>
          </div>
        )}

        {emailType === 'campaign' && audience === 'workshop-attendees' && (
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="workshop">
              Workshop
            </label>
            <select
              id="workshop"
              value={selectedWorkshop}
              onChange={(e) => setSelectedWorkshop(e.target.value)}
              disabled={loadingWorkshops}
              className="border rounded-lg px-3 py-2 text-sm bg-background disabled:opacity-50"
            >
              <option value="">
                {loadingWorkshops ? 'Loading workshops...' : 'Select a workshop'}
              </option>
              {workshops.map((workshop) => (
                <option key={workshop._id} value={workshop._id}>
                  {workshop.title} (
                  {new Date(workshop.date).toLocaleDateString('da-DK')})
                </option>
              ))}
            </select>
          </div>
        )}

        {emailType === 'followup' && followupTarget === 'workshop-orders' && (
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="followup-workshop">
              Workshop (Optional)
            </label>
            <select
              id="followup-workshop"
              value={selectedWorkshop}
              onChange={(e) => setSelectedWorkshop(e.target.value)}
              disabled={loadingWorkshops}
              className="border rounded-lg px-3 py-2 text-sm bg-background disabled:opacity-50"
            >
              <option value="">
                {loadingWorkshops ? 'Loading workshops...' : 'All workshop customers'}
              </option>
              {workshops.map((workshop) => (
                <option key={workshop._id} value={workshop._id}>
                  {workshop.title} (
                  {new Date(workshop.date).toLocaleDateString('da-DK')})
                </option>
              ))}
            </select>
          </div>
        )}

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

      <div className="flex gap-3 items-end flex-wrap border rounded-lg p-3 bg-muted/40">
        <div className="space-y-1 flex-1 min-w-60">
          <label className="text-sm font-medium" htmlFor="test-email">
            Send Test Email
          </label>
          <input
            id="test-email"
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="test@example.com"
            className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
          />
        </div>
        <button
          type="button"
          onClick={handleSendTest}
          disabled={sendingTest}
          className="border rounded-lg px-5 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50 transition-colors"
        >
          {sendingTest ? 'Sending…' : 'Send Test'}
        </button>
        {testResult && (
          <p
            className={`w-full text-sm ${testResult.success ? 'text-green-700' : 'text-red-700'}`}
          >
            {testResult.message}
          </p>
        )}
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
