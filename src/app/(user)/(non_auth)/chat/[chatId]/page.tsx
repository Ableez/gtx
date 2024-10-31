'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, MoreVertical, ChevronLeft, Phone, Video } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Message = {
  id: string
  sender: string
  content: string
  timestamp: Date
  attachments?: string[]
  replyTo: string | null
}

type User = {
  id: string
  name: string
  avatar: string
  isOnline: boolean
}

export default function Component() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [currentUser] = useState<User>({ id: '1', name: 'You', avatar: '/your-avatar.jpg', isOnline: true })
  const [otherUser] = useState<User>({ id: '2', name: 'John Doe', avatar: '/john-avatar.jpg', isOnline: true })
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Simulating receiving messages
    const intervalId = setInterval(() => {
      const shouldReceiveMessage = Math.random() < 0.3 // 30% chance of receiving a message
      if (shouldReceiveMessage) {
        receiveMessage()
      }
    }, 5000)

    return () => clearInterval(intervalId)
  }, [])

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: currentUser.id,
      content: inputMessage,
      timestamp: new Date(),
      replyTo: replyingTo
    }

    setMessages(prevMessages => [...prevMessages, newMessage])
    setInputMessage('')
    setReplyingTo(null)
    setIsTyping(false)
  }

  const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: currentUser.id,
        content: 'Sent an attachment',
        timestamp: new Date(),
        attachments: Array.from(files).map(file => file.name)
      }
      setMessages(prevMessages => [...prevMessages, newMessage])
    }
  }

  const handleReply = (messageId: string) => {
    setReplyingTo(messageId)
  }

  const handleCancelReply = () => {
    setReplyingTo(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value)
    setIsTyping(true)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 1000)
  }

  const receiveMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: otherUser.id,
      content: `This is a received message at ${new Date().toLocaleTimeString()}`,
      timestamp: new Date()
    }
    setMessages(prevMessages => [...prevMessages, newMessage])
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto border rounded-lg overflow-hidden">
      <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
          <Avatar className={"scale-90"}>
            <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
            <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{otherUser.name}</h2>
            <p className="text-xs">{otherUser.isOnline ? 'Online' : 'Offline'}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                  <span className="sr-only">Call</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Call {otherUser.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                  <span className="sr-only">Video call</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Video call with {otherUser.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                  <span className="sr-only">More options</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>More options</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {messages.map((message) => (
          <div key={message.id} className={`mb-4 ${message.sender === currentUser.id ? 'text-right' : ''}`}>
            {message.replyTo && (
              <div className="text-xs text-muted-foreground mb-1">
                Replying to: {messages.find(m => m.id === message.replyTo)?.content.substring(0, 20)}...
              </div>
            )}
            <div className={`inline-block p-2 rounded-lg ${
              message.sender === currentUser.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              <p>{message.content}</p>
              {message.attachments && message.attachments.map((attachment, index) => (
                <div key={index} className="mt-1 text-xs underline">{attachment}</div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {message.timestamp.toLocaleTimeString()} · 
              <button onClick={() => handleReply(message.id)} className="ml-2 underline">Reply</button>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-muted-foreground text-sm">{currentUser.name} is typing...</div>
        )}
      </ScrollArea>

      {replyingTo && (
        <div className="bg-muted p-2 flex justify-between items-center">
          <span className="text-sm">Replying to: {messages.find(m => m.id === replyingTo)?.content.substring(0, 20)}...</span>
          <Button variant="ghost" size="sm" onClick={handleCancelReply}>Cancel</Button>
        </div>
      )}

      <div className="p-4 bg-background">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={handleInputChange}
            className="flex-grow"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileAttach}
            className="hidden"
            multiple
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="h-5 w-5" />
                  <span className="sr-only">Attach file</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" size="icon">
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Send message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>
      </div>
    </div>
  )
}