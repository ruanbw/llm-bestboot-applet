import { http } from '@/http/http'

export interface IChatForm {
  inputs: Record<string, any>
  query: string
  response_mode: 'blocking'
  conversation_id: string
  user: string
  files: any[]
}

export function getChatList() {
  return http.get<void>('/chat/client')
}

export function getChat(id: number) {
  return http.get<void>(`/chat/client/${id}`)
}
