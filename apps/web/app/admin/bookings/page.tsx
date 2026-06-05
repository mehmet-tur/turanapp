'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '../../../components/AdminShell';
import { Badge } from '../../../components/Badge';
import { PageHeader } from '../../../components/PageHeader';

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

  async function setStatus(id: string, status: string) {
    const token = sessionStorage.getItem('admin_token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/admin/bookings/${id}/status`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setItems((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  return (
    <AdminShell>
      <PageHeader title="Rezervasyonlar" description="Durum yönetimi ve demo operasyon kontrolleri." />
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
              <td><Badge>{item.status}</Badge></td>
              <td>{(item.priceMinor / 100).toLocaleString('tr-TR')} {item.currency}</td>
              <td>
                <select defaultValue={item.status} onChange={(event) => setStatus(item.id, event.target.value)}>
                  {['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'REFUNDED', 'CANCELLED_BY_CUSTOMER'].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
