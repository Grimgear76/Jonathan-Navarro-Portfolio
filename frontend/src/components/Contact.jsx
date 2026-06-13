import { useState } from 'react'
import emailjs from '@emailjs/browser'
import './Contact.css'

export function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Invalid email address'
  }
  if (!form.message.trim()) errors.message = 'Message is required'
  return errors
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setStatus('sending')

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name:    form.name,
          from_email:   form.email,
          message:      form.message,
          to_name:      'Jonathan',
          reply_to:     form.email,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section className="contact" id="contact">
        <div className="contact-container">
          <h2 className="section-label">// CONTACT</h2>
          <div className="contact-success" role="status" aria-live="polite">
            <p className="success-text">MESSAGE RECEIVED_</p>
            <p className="success-sub">I'll get back to you soon.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <h2 className="section-label">// CONTACT</h2>
        <div className="contact-layout">
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">NAME</label>
            <input
              id="name" name="name" type="text" value={form.name} onChange={handleChange}
              disabled={status === 'sending'}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && <span className="field-error" id="name-error" role="alert">{errors.name}</span>}
          </div>
          <div className="field">
            <label htmlFor="email">EMAIL</label>
            <input
              id="email" name="email" type="email" value={form.email} onChange={handleChange}
              disabled={status === 'sending'}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <span className="field-error" id="email-error" role="alert">{errors.email}</span>}
          </div>
          <div className="field">
            <label htmlFor="message">MESSAGE</label>
            <textarea
              id="message" name="message" rows={5} value={form.message} onChange={handleChange}
              disabled={status === 'sending'}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && <span className="field-error" id="message-error" role="alert">{errors.message}</span>}
          </div>
          <p className="field-error" role="alert" aria-live="assertive" style={{ marginBottom: status === 'error' ? '1rem' : 0 }}>
            {status === 'error' && 'Something went wrong — try emailing directly at jonathan63592@gmail.com'}
          </p>
          <button type="submit" className="btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
          </button>
        </form>

        <div className="contact-info">
          <p className="contact-info-label">// REACH ME DIRECTLY</p>
          <ul className="contact-info-list">
            <li>
              <span className="contact-info-key">EMAIL</span>
              <a href="mailto:jonathan63592@gmail.com" className="contact-info-val">jonathan63592@gmail.com</a>
            </li>
            <li>
              <span className="contact-info-key">LINKEDIN</span>
              <a href="https://linkedin.com/in/jonathan-navarro-44923b307" target="_blank" rel="noopener noreferrer" className="contact-info-val">jonathan-navarro-44923b307</a>
            </li>
            <li>
              <span className="contact-info-key">GITHUB</span>
              <a href="https://github.com/Grimgear76" target="_blank" rel="noopener noreferrer" className="contact-info-val">Grimgear76</a>
            </li>
            <li>
              <span className="contact-info-key">LOCATION</span>
              <span className="contact-info-val contact-info-plain">Rio Grande Valley, TX</span>
            </li>
          </ul>
        </div>
        </div>
      </div>
    </section>
  )
}
