'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { User, Email } from '@/types'
import ComposeModal from './ComposeModal'
import EmailTable from './EmailTable'

interface DashboardProps {
  user: User
}

export default function Dashboard({ user }: DashboardProps) {
  const [showCompose, setShowCompose] = useState(false)
  const [activeTab, setActiveTab] = useState<'scheduled' | 'sent'>('scheduled')

  const { data: scheduledEmails = [], refetch: refetchScheduled } = useQuery<Email[]>({
    queryKey: ['emails', 'scheduled'],
    queryFn: async () => {
      const response = await api.get('/api/emails/scheduled')
      return response.data
    },
  })

  const { data: sentEmails = [], refetch: refetchSent } = useQuery<Email[]>({
    queryKey: ['emails', 'sent'],
    queryFn: async () => {
      const response = await api.get('/api/emails/sent')
      return response.data
    },
  })

  const handleLogout = async () => {
    await api.get('/auth/logout')
    window.location.reload()
  }

  const handleEmailScheduled = () => {
    refetchScheduled()
    setShowCompose(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Email Scheduler</h1>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCompose(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Compose
            </button>
            
            <div className="flex items-center gap-3">
              {user.picture && (
                <img src={user.picture} alt={user.name || ''} className="w-8 h-8 rounded-full" />
              )}
              <div className="text-sm">
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-gray-500">{user.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 ml-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex gap-8">
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'scheduled'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Scheduled ({scheduledEmails.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sent'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sent ({sentEmails.length})
            </button>
          </nav>
        </div>

        {/* Email Tables */}
        {activeTab === 'scheduled' ? (
          <EmailTable emails={scheduledEmails} type="scheduled" />
        ) : (
          <EmailTable emails={sentEmails} type="sent" />
        )}
      </main>

      {/* Compose Modal */}
      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(false)}
          onSuccess={handleEmailScheduled}
        />
      )}
    </div>
  )
}
