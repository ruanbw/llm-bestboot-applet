import { http } from '@/http/http'

export interface IChatForm {
  inputs: Record<string, any>
  query: string
  response_mode: 'blocking'
  conversation_id: string
  user: string
  files: any[]
}

export function chatMessages(id: number, chatForm: IChatForm) {
  return http.post<void>(`/llm/${id}/v1/chat-messages`, chatForm)
}
