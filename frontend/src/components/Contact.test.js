import { describe, it, expect } from 'vitest'
import { validate } from './Contact'

describe('validate', () => {
  it('returns name error for empty name', () => {
    const errors = validate({ name: '', email: 'a@b.com', message: 'hi' })
    expect(errors.name).toBeTruthy()
  })

  it('returns email error for empty email', () => {
    const errors = validate({ name: 'Jon', email: '', message: 'hi' })
    expect(errors.email).toBeTruthy()
  })

  it('returns email error for invalid email format', () => {
    const errors = validate({ name: 'Jon', email: 'notvalid', message: 'hi' })
    expect(errors.email).toBeTruthy()
  })

  it('returns message error for empty message', () => {
    const errors = validate({ name: 'Jon', email: 'jon@test.com', message: '' })
    expect(errors.message).toBeTruthy()
  })

  it('returns no errors for valid form', () => {
    const errors = validate({ name: 'Jon', email: 'jon@test.com', message: 'Hello there' })
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('returns no errors for email with subdomain', () => {
    const errors = validate({ name: 'Jon', email: 'jon@mail.example.com', message: 'Hi' })
    expect(errors.email).toBeUndefined()
  })
})
