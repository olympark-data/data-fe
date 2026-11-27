// 백엔드 API 호출 공통 함수. 주소는 항상 /api 로 시작한다.
// 로컬은 Vite 개발 서버가, 서버는 nginx가 /api 를 백엔드로 넘겨 준다.

export type ApiResponse<T> = {
  success: boolean
  data: T | null
  message: string | null
  code: string | null
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { Accept: 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${path}`)
  }
  return (await res.json()) as T
}
