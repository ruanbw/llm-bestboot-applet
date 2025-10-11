import { http } from '@/http/http'

/**
 * 登录表单
 */
export interface IRegisterForm {
  username: string
  password: string
}

export function register(registerForm: IRegisterForm) {
  return http.post<void>('/auth/simple_signup', registerForm)
}
