'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Agent } from '@/types'
import { Plus, Phone, Settings, Play, Pause, Search, MoreHorizontal, MessageCircle } from 'lucide-react'
import { AgentWizard } from '@/components/agents/AgentWizard'
import { WhatsAppConversations } from '@/components/whatsapp/WhatsAppConversations'
import { enhanceAgentWithWhatsApp } from '@/lib/whatsapp-frontend-store'
import { useAgents, useVoices, useToggleAgentStatus } from '@/hooks/useAgents'
import { useQueryClient } from '@tanstack/react-query'

export default function AgentsPage() {
  const [showWizard, setShowWizard] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [showWhatsAppConversations, setShowWhatsAppConversations] = useState(false)
  const [selectedAgentForWhatsApp, setSelectedAgentForWhatsApp] = useState<Agent | null>(null)
  
  const queryClient = useQueryClient()
  
  // Use cached queries
  const { data: agentsData, isLoading: agentsLoading, error: agentsError } = useAgents()
  const { data: voicesData, isLoading: voicesLoading } = useVoices()
  const toggleStatusMutation = useToggleAgentStatus()
  
  const agents = agentsData?.agents ? agentsData.agents.agents.map(enhanceAgentWithWhatsApp) : []
  const voices = voicesData ? voicesData.reduce((acc, voice) => {
    acc[voice.id] = voice.name
    return acc
  }, {} as Record<string, string>) : {}
  const loading = agentsLoading || voicesLoading
  const error = agentsError?.message || null


  const toggleAgentStatus = (agentId: string) => {
    toggleStatusMutation.mutate(agentId)
  }

  const handleAgentCreated = () => {
    // Agent is already created by AgentWizard, just close the wizard
    setShowWizard(false)
    // Refresh the agents list to show the new agent
    queryClient.invalidateQueries({ queryKey: ['agents'] })
  }

  const handleAgentUpdated = () => {
    // Agent is already updated by AgentWizard, just close the wizard
    setEditingAgent(null)
    // Refresh the agents list to show the updated agent
    queryClient.invalidateQueries({ queryKey: ['agents'] })
  }

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent)
  }

  const handleOpenWhatsAppConversations = (agent: Agent) => {
    setSelectedAgentForWhatsApp(agent)
    setShowWhatsAppConversations(true)
  }

  return (
    <ProtectedRoute>
      <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">All Agents</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <Button variant="outline">
              Import
            </Button>
            <Button onClick={() => setShowWizard(true)} variant="dark">
              Create an Agent
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading agents...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No agents found. Create your first agent to get started.</p>
            </div>
          ) : (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="border-b border-gray-200">
                <TableHead className="font-medium text-gray-700 py-3">Agent Name</TableHead>
                <TableHead className="font-medium text-gray-700 py-3">Agent Type</TableHead>
                <TableHead className="font-medium text-gray-700 py-3">Voice</TableHead>
                <TableHead className="font-medium text-gray-700 py-3">Phone</TableHead>
                <TableHead className="font-medium text-gray-700 py-3">Edited by</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent: Agent) => (
                <TableRow key={agent.id} className="hover:bg-gray-50 border-b border-gray-100">
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <div>
                        <div className="font-medium text-gray-900">{agent.name}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Voice
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm text-gray-600">Multi Prompt</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-amber-800">🎤</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-900">
                          {agent.voice_id && voices[agent.voice_id] 
                            ? voices[agent.voice_id] 
                            : 'Default Voice'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Voice AI Ready
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {agent.outbound_phone ? (
                      <span className="text-sm text-blue-600">{agent.outbound_phone}</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="text-sm text-gray-600">
                      {agent.created_at ? (
                        <>
                          {new Date(agent.created_at).toLocaleDateString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric'
                          })}, {new Date(agent.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })}
                        </>
                      ) : 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex justify-end space-x-1">
                      <button 
                        onClick={() => handleEditAgent(agent)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Edit Agent"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </div>
      </div>

      <AgentWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onComplete={handleAgentCreated}
      />

      {editingAgent && (
        <AgentWizard
          isOpen={!!editingAgent}
          onClose={() => setEditingAgent(null)}
          onComplete={handleAgentUpdated}
          editingAgent={editingAgent}
        />
      )}

      {selectedAgentForWhatsApp && (
        <WhatsAppConversations
          isOpen={showWhatsAppConversations}
          onClose={() => {
            setShowWhatsAppConversations(false)
            setSelectedAgentForWhatsApp(null)
          }}
          agentId={selectedAgentForWhatsApp.id}
          agentName={selectedAgentForWhatsApp.name}
        />
      )}
      </Layout>
    </ProtectedRoute>
  )
}