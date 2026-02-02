"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useAuth } from "@/lib/auth"
import { 
  X, 
  Send, 
  AlertCircle, 
  Loader2, 
  MessageSquare, 
  Copy, 
  Check, 
  Trash2,
  Bot,
  User as UserIcon,
  Sparkles
} from "lucide-react"

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type Props = {
  open: boolean
  onClose: () => void
  patientId: string | null
  patientName?: string
}

function getRelativeTime(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (seconds < 10) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function PatientChatModal({ open, onClose, patientId, patientName }: Props) {
  const { authFetch } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [disclaimer, setDisclaimer] = useState<string>("")
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      setInput("")
      setError(null)
    }
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  async function handleSendMessage(e?: React.FormEvent) {
    e?.preventDefault()
    
    if (!input.trim() || !patientId || loading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)
    setError(null)

    try {
      const res = await authFetch('/api/groq/patient-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          question: userMessage.content
        })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(data.error || 'Failed to get response')
      }

      const data = await res.json()
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'I apologize, but I was unable to generate a response.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      if (data.disclaimer) {
        setDisclaimer(data.disclaimer)
      }

    } catch (err) {
      console.error('Chat error:', err)
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleRetry() {
    setError(null)
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
      if (lastUserMessage) {
        setInput(lastUserMessage.content)
      }
    }
  }

  function handleClearConversation() {
    if (confirm('Are you sure you want to clear this conversation?')) {
      setMessages([])
      setDisclaimer("")
      setError(null)
    }
  }

  async function copyToClipboard(text: string, messageId: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-r from-primary via-purple-600 to-pink-600 p-6">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                <Sparkles className="size-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  HealthSync AI Assistant
                </h2>
                {patientName && (
                  <p className="text-sm text-white/90 mt-0.5">
                    Patient: {patientName}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearConversation}
                  className="text-white hover:bg-white/20 transition-colors"
                >
                  <Trash2 className="size-4 mr-2" />
                  Clear
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 transition-colors"
              >
                <X className="size-5" />
              </Button>
            </div>
          </div>
          
          {/* Message Counter */}
          {messages.length > 0 && (
            <div className="relative mt-3 text-xs text-white/80">
              💬 {messages.length} {messages.length === 1 ? 'message' : 'messages'} in conversation
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
          {messages.length === 0 && (
            <div className="text-center py-16 px-6">
              <div className="mb-6 relative">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
                  <MessageSquare className="size-10 text-primary" />
                </div>
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-2">
                  <Sparkles className="size-6 text-amber-500 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Start a Conversation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                Ask questions about medical terms, existing diagnoses, or general health information. 
                I'm here to help educate and explain.
              </p>
              <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2 justify-center">
                  <AlertCircle className="size-4" />
                  This AI cannot diagnose, prescribe, or provide emergency advice
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-in slide-in-from-bottom-2 duration-300 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 ${message.role === 'user' ? 'order-first' : ''}`}>
                <div className={`size-10 rounded-xl flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/25'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300'
                }`}>
                  {message.role === 'user' ? (
                    <UserIcon className="size-5" />
                  ) : (
                    <Bot className="size-5" />
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className={`group relative rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/20'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  
                  {/* Copy button for assistant messages */}
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="absolute -top-2 -right-2 p-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-gray-600"
                      title="Copy message"
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="size-3.5 text-green-600" />
                      ) : (
                        <Copy className="size-3.5 text-gray-600 dark:text-gray-300" />
                      )}
                    </button>
                  )}
                </div>
                
                {/* Timestamp */}
                <div className={`flex items-center gap-2 px-2 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {message.role === 'assistant' ? '🤖' : '👤'} {getRelativeTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex-shrink-0">
                <div className="size-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                  <Bot className="size-5 text-gray-700 dark:text-gray-300" />
                </div>
              </div>
              <div className="flex-1 max-w-[80%]">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin text-primary" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Thinking...</span>
                    <div className="flex gap-1 ml-1">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="animate-in slide-in-from-bottom-2 duration-300">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="size-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-1">Something went wrong</p>
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    className="mt-3 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Disclaimer (always visible when present) */}
        {disclaimer && (
          <div className="px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border-y border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="size-4 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                {disclaimer}
              </p>
            </div>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about health information..."
              className="flex-1 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={loading || !patientId}
              maxLength={1000}
            />
            <Button
              type="submit"
              disabled={!input.trim() || loading || !patientId}
              size="icon"
              className="rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="size-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {input.length}/1000 characters
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Press Enter to send
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
