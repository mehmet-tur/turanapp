'use client';

import { useEffect, useState } from 'react';

export default function AdminBookingsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/admin/bookings`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then(setItems);
  }, []);

  return (
    <main style={{ padding: 32 }}>
      <h1>Rezervasyonlar</h1>
      <table style={{ width: '100%', background: 'white' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Müşteri</th>
            <th>Uzman</th>
            <th>Başlangıç</th>
            <th>Durum</th>
            <th>Tutar</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id.slice(0, 8)}</td>
              <td>{item.customer.firstName} {item.customer.lastName}</td>
              <td>{item.talent.publicName}</td>
              <td>{new Date(item.startsAt).toLocaleString('tr-TR')}</td>
              <td>{item.status}</td>
              <td>{(item.priceMinor / 100).toLocaleString('tr-TR')} {item.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
