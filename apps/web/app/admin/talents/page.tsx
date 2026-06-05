'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '../../../components/AdminShell';
import { Badge } from '../../../components/Badge';
import { PageHeader } from '../../../components/PageHeader';

export default function AdminTalentsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/admin/talents`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then(setItems);
  }, []);

  async function review(id: string, decision: 'APPROVE' | 'REJECT') {
    const token = sessionStorage.getItem('admin_token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/admin/talents/${id}/${decision === 'APPROVE' ? 'approve' : 'reject'}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify(decision === 'APPROVE' ? {} : { reason: 'Profil bilgileri yetersiz.' }),
    });
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <AdminShell>
      <PageHeader title="Uzman Başvuruları" description="Onayla, reddet ve mevcut uzman listesini gözden geçir." />
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
              <td><Badge>{item.status}</Badge></td>
              <td>{new Date(item.createdAt).toLocaleString('tr-TR')}</td>
              <td>
                <button onClick={() => review(item.id, 'APPROVE')}>Approve</button>
                <button onClick={() => review(item.id, 'REJECT')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
