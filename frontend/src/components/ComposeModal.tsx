'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

interface ComposeModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function ComposeModal({ onClose, onSuccess }: ComposeModalProps) {
  const [emails, setEmails] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [startTime, setStartTime] = useState('')
  const [delayBetweenEmails, setDelayBetweenEmails] = useState('2000')
  const [maxEmailsPerHour, setMaxEmailsPerHour] = useState('200')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const parseEmails = (text: string): string[] => {
    return text
      .split(/[\n,]/)
      .map(email => email.trim())
      .filter(email => email && email.includes('@'))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setEmails(text)
    }
    reader.readAsText(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const emailList = parseEmails(emails)
      
      if (emailList.length === 0) {
        throw new Error('Please provide at least one valid email')
      }

      await api.post('/api/emails/schedule', {
        emails: emailList,
        subject,
        body,
        startTime: new Date(startTime).toISOString(),
        delayBetweenEmails: parseInt(delayBetweenEmails),
        maxEmailsPerHour: parseInt(maxEmailsPerHour),
      })

      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to schedule emails')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Schedule Emails</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Recipients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipients (one per line or comma-separated)
              </label>
              <textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="user1@example.com&#10;user2@example.com"
                required
              />
              <div className="mt-2">
                <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                  <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
                  Upload CSV file
                </label>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={6}
                required
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Delay Between Emails */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delay Between Emails (ms)
              </label>
              <input
                type="number"
                value={delayBetweenEmails}
                onChange={(e) => setDelayBetweenEmails(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="2000"
                required
              />
            </div>

            {/* Max Emails Per Hour */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Emails Per Hour
              </label>
              <input
                type="number"
                value={maxEmailsPerHour}
                onChange={(e) => setMaxEmailsPerHour(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Scheduling...' : 'Schedule Emails'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
