import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState(''); const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/auth/reset/' + token, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }, body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (res.ok) { setMsg('Password reset. You can login now.'); navigate('/login'); } else setMsg(data.error || 'Error');
  };

  return <form onSubmit={submit}>
    <h3>Reset password</h3>
    <TextField label="New password" value={password} onChange={e => setPassword(e.target.value)} />
    <Button type="submit" variant="contained">Set password</Button>
    {msg && <div>{msg}</div>}
  </form>;
}
