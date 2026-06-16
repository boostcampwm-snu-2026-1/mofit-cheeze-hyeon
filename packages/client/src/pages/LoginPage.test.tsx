import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from './LoginPage'
import { supabase } from '../lib/supabase'
import { loadUserSession } from '../lib/AuthProvider'
import { useAuthStore } from '../store/auth'

// vi.hoisted: vi.mock 팩토리보다 먼저 실행되어야 하는 변수 선언
const mockNavigate = vi.hoisted(() => vi.fn())
const mockSetLoading = vi.hoisted(() => vi.fn())
const mockGetState = vi.hoisted(() => vi.fn())

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../lib/supabase', () => ({
  supabase: { auth: { signInWithPassword: vi.fn() } },
}))

vi.mock('../lib/AuthProvider', () => ({
  loadUserSession: vi.fn(),
}))

vi.mock('../store/auth', () => ({
  useAuthStore: Object.assign(
    vi.fn(() => ({ setLoading: mockSetLoading })),
    { getState: mockGetState }
  ),
}))

function renderPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('LoginPage', () => {
  it('이메일·비밀번호 입력창과 로그인 버튼이 렌더된다', () => {
    mockGetState.mockReturnValue({ user: null })
    renderPage()

    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
  })

  it('로그인 실패 시 서버 에러 메시지가 표시된다', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: '이메일 또는 비밀번호가 올바르지 않습니다.' } as never,
    })
    mockGetState.mockReturnValue({ user: null })
    renderPage()

    await userEvent.type(screen.getByLabelText('이메일'), 'test@example.com')
    await userEvent.type(screen.getByLabelText('비밀번호'), 'wrongpassword')
    await userEvent.click(screen.getByRole('button', { name: '로그인' }))

    await waitFor(() => {
      expect(
        screen.getByText('이메일 또는 비밀번호가 올바르지 않습니다.')
      ).toBeInTheDocument()
    })
  })

  it('모델로 로그인 성공 시 /discover 로 이동한다', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: { id: 'user-1' } as never, session: null },
      error: null,
    })
    vi.mocked(loadUserSession).mockResolvedValue(undefined)
    mockGetState.mockReturnValue({
      user: { id: 'user-1', role: 'model' },
      modelProfile: { id: 'profile-1' },
      designerProfile: null,
    })
    renderPage()

    await userEvent.type(screen.getByLabelText('이메일'), 'model@example.com')
    await userEvent.type(screen.getByLabelText('비밀번호'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: '로그인' }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/discover', { replace: true })
    })
  })

  it('디자이너로 로그인 성공 시 /matching/inbox 로 이동한다', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: { id: 'user-2' } as never, session: null },
      error: null,
    })
    vi.mocked(loadUserSession).mockResolvedValue(undefined)
    mockGetState.mockReturnValue({
      user: { id: 'user-2', role: 'designer' },
      modelProfile: null,
      designerProfile: { id: 'profile-2' },
    })
    renderPage()

    await userEvent.type(screen.getByLabelText('이메일'), 'designer@example.com')
    await userEvent.type(screen.getByLabelText('비밀번호'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: '로그인' }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/matching/inbox', { replace: true })
    })
  })
})
