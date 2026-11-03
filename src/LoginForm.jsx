import { useState } from 'react';
import { useAuth } from './context/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.errors ?? err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Login</button>
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
    </form>
  );
}