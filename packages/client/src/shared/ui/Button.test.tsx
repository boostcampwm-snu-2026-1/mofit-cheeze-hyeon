import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('자식 텍스트를 렌더링한다', () => {
    render(<Button>클릭</Button>)
    expect(screen.getByRole('button', { name: '클릭' })).toBeInTheDocument()
  })

  it('onClick 핸들러를 호출한다', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>클릭</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disabled 상태에서는 클릭이 동작하지 않는다', async () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>클릭</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})
