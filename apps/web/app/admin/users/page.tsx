'use client';

import { useEffect, useState } from 'react';

export default function AdminUsersPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/admin/users`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then(setItems);
  }, []);

  return (
    <main style={{ padding: 32 }}>
      <h1>Kullanıcılar</h1>
      <table style={{ width: '100%', background: 'white' }}>
        <thead>
          <tr>
            <th>E-posta</th>
            <th>Ad Soyad</th>
            <th>Roller</th>
            <th>Kayıt tarihi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.email}</td>
              <td>{item.firstName} {item.lastName}</td>
              <td>{item.roles.join(', ')}</td>
              <td>{new Date(item.createdAt).toLocaleString('tr-TR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
