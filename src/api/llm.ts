import { http } from '@/http/http'

export interface IChatForm {
  inputs: Record<string, any>
  query: string
  response_mode: 'blocking'
  conversation_id: string
  user: string
  files: any[]
}

export function chatMessages(chatForm: IChatForm) {
  return http.post<void>('/llm/v1/chat-messages', chatForm)
}
