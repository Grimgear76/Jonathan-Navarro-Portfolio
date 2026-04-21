import { useState } from 'react'
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
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="contact" id="contact">
        <div className="contact-container">
          <h2 className="section-label">// CONTACT</h2>
          <div className="contact-success">
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
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">NAME</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className="field">
            <label htmlFor="email">EMAIL</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="field">
            <label htmlFor="message">MESSAGE</label>
            <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} />
            {errors.message && <span className="field-error">{errors.message}</span>}
          </div>
          <button type="submit" className="btn-primary">SEND MESSAGE</button>
        </form>
      </div>
    </section>
  )
}
