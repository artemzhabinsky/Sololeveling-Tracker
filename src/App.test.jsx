import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from './App.jsx'

describe('App routing', () => {
  it.each([
    ['/', /дашборд|уровень/i],
    ['/tasks', /задачи/i],
    ['/shop', /магазин/i],
    ['/analytics', /аналитика/i],
  ])('renders the expected heading for %s', (path, heading) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
  })
})
