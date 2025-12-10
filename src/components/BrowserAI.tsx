import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import { Box, IconButton, TextField, Typography, Paper, List, ListItem, ListItemText, CircularProgress } from '@mui/material'
import React, { useState, useRef, useEffect } from 'react'
import { CreateMLCEngine, MLCEngine } from '@mlc-ai/web-llm'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface BrowserAIProps {
  model?: string
}

function BrowserAI({ model = 'Phi-3-mini-4k-instruct-q4f16_1' }: BrowserAIProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m an AI assistant running locally in your browser. How can I help you today?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [engine, setEngine] = useState<MLCEngine | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize the MLC engine when component mounts
    const initEngine = async () => {
      try {
        const mlcEngine = new CreateMLCEngine()
        setEngine(mlcEngine)
        
        // Progress callback for model loading
        const progressCallback = (progress: { progress: number; timeElapsed: number; text: string }) => {
          console.log('Model loading progress:', progress)
        }

        // Load the model
        await mlcEngine.reload(model, {
          progressCallback: progressCallback
        })
        
        setIsInitialized(true)
        console.log('MLC Engine initialized successfully')
      } catch (error) {
        console.error('Failed to initialize MLC Engine:', error)
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I failed to initialize. Please make sure your browser supports WebGPU and try again.'
        }])
      }
    }

    if (open && !isInitialized) {
      initEngine()
    }
  }, [open, model, isInitialized])

  const handleSendMessage = async () => {
    if (!input.trim() || !engine || !isInitialized || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Add the user message to conversation history
      const conversationMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // Generate response using the MLC engine
      const completion = await engine.chat.completions.create({
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 512,
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content: completion.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.'
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error generating response:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const handleOpen = () => {
    setOpen(!open)
  }

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 80, // Offset from the original chat widget
          zIndex: 1000,
        }}
      >
        <IconButton
          size='large'
          onClick={handleOpen}
          sx={{
            backgroundColor: '#4caf50',
            color: 'white',
            '&:hover': {
              backgroundColor: '#66bb6a',
            },
          }}
        >
          {open ? <CloseIcon /> : <ChatBubbleIcon />}
        </IconButton>
      </Box>
      
      {open && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 75,
            right: 80,
            width: 400,
            height: 600,
            bgcolor: 'background.paper',
            border: '1px solid #ccc',
            boxShadow: 24,
            borderRadius: '15px',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000,
          }}
        >
          <Typography variant='h6' sx={{ mb: 2, color: '#4caf50' }}>
            Browser AI Chat {isInitialized ? '✅' : '⏳'}
          </Typography>
          
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              overflow: 'auto',
              bgcolor: '#f5f5f5',
              mb: 2,
              borderRadius: 1,
            }}
          >
            <List>
              {messages.map((message, index) => (
                <ListItem
                  key={index}
                  alignItems='flex-start'
                  sx={{
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      maxWidth: '80%',
                      bgcolor: message.role === 'user' ? '#4caf50' : 'white',
                      color: message.role === 'user' ? 'white' : 'black',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.content}
                    </Typography>
                  </Paper>
                </ListItem>
              ))}
              
              {isLoading && (
                <ListItem alignItems='flex-start'>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      maxWidth: '80%',
                      bgcolor: 'white',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <CircularProgress size={16} />
                    <Typography variant='body2' color='text.secondary'>
                      Thinking...
                    </Typography>
                  </Paper>
                </ListItem>
              )}
            </List>
            <div ref={messagesEndRef} />
          </Paper>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size='small'
              placeholder={isInitialized ? 'Type your message...' : 'Initializing AI...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!isInitialized || isLoading}
              multiline
              maxRows={3}
            />
            <IconButton
              color='primary'
              onClick={handleSendMessage}
              disabled={!input.trim() || !isInitialized || isLoading}
              sx={{
                bgcolor: '#4caf50',
                color: 'white',
                '&:hover': {
                  bgcolor: '#66bb6a',
                },
                '&:disabled': {
                  bgcolor: 'grey.300',
                  color: 'grey.600',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </>
  )
}

export default BrowserAI