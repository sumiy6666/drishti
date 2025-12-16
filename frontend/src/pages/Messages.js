import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';

export default function Messages() {
  const [inbox, setInbox] = useState([]); const [conv, setConv] = useState([]); const [otherId, setOtherId] = useState(''); const [text, setText] = useState('');
  const token = localStorage.getItem('token');

  const loadInbox = async () => {
    const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/messages/inbox', { headers: { Authorization: 'Bearer ' + token, 'ngrok-skip-browser-warning': 'true' } });
    const data = await res.json();
    setInbox(data || []);
  };

  useEffect(() => { loadInbox(); }, []);

  const loadConv = async (userId) => {
    setOtherId(userId);
    const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/messages/conversations/' + userId, { headers: { Authorization: 'Bearer ' + token, 'ngrok-skip-browser-warning': 'true' } });
    const data = await res.json();
    setConv(data || []);
  };

  const send = async () => {
    await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token, 'ngrok-skip-browser-warning': 'true' }, body: JSON.stringify({ to: otherId, text }) });
    setText(''); loadConv(otherId); loadInbox();
  };

  return <Box>
    <h3>Messages</h3>
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ width: 250 }}>
        <h4>Inbox</h4>
        {inbox.map(i => <div key={i._id}><button onClick={() => loadConv(i._id)}>{JSON.stringify(i._id)}</button></div>)}
      </div>
      <div style={{ flex: 1 }}>
        <h4>Conversation</h4>
        {conv.map(m => <div key={m._id}><b>{m.from}</b>: {m.text}</div>)}
        <TextField fullWidth value={text} onChange={e => setText(e.target.value)} />
        <Button variant="contained" onClick={send}>Send</Button>
      </div>
    </div>
  </Box>;
}
