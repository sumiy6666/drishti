```javascript
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function VerifyEmail() {
  const { token } = useParams();
  const [msg, setMsg] = useState('Verifying...');
  useEffect(() => {
    fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/auth/verify/' + token, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(r => r.json()).then(d => setMsg(d.message || 'Email verified')).catch(() => setMsg('Verification failed'));
  }, []);
  return <div>{msg}</div>;
}
```
