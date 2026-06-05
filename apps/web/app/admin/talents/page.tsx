'use client';

import { useEffect, useState } from 'react';

export default function AdminTalentsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    fetch(`${process.env.NEXT_PUBLIC_WEB_API_URL ?? 'http://localhost:4000/api'}/admin/talents`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then(setItems);
  }, []);

  async function review(id: string, decision: 'APPROVE' | 'REJECT') {
    const token = sessionStorage.getItem('admin_token');
    await fetch(`${process.env.NEXT_PUBLIC_WEB_API_URL ?? 'http://localhost:4000/api'}/admin/talents/${id}/review`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify(decision === 'APPROVE' ? { decision } : { decision, reason: 'Profil bilgileri yetersiz.' }),
    });
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <main style={{ padding: 32 }}>
      <h1>Uzman Başvuruları</h1>
      <table style={{ width: '100%', background: 'white', borderRadius: 16, padding: 16 }}>
        <thead>
          <tr>
            <th>Public name</th>
            <th>Segment</th>
            <th>Headline</th>
            <th>Status</th>
            <th>Created at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.publicName}</td>
              <td>{item.segment}</td>
              <td>{item.headline}</td>
              <td>{item.status}</td>
              <td>{new Date(item.createdAt).toLocaleString('tr-TR')}</td>
              <td>
                <button onClick={() => review(item.id, 'APPROVE')}>Approve</button>
                <button onClick={() => review(item.id, 'REJECT')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
