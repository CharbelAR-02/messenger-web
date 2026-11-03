import { useState } from 'react';
import { useAuth } from './context/AuthContext';

export default function RegisterForm() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
    } catch (err) {
      setError(err.response?.data?.errors ?? err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <input type="password" placeholder="Confirm Password" value={form.password_confirmation} onChange={e => setForm({ ...form, password_confirmation: e.target.value })} />
      <button type="submit">Register</button>
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
    </form>
  );
}