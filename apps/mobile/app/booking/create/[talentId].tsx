import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Button, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { apiFetch } from '../../../src/lib/api';

type TalentDetail = {
  id: string;
  slug: string;
  displayName: string;
  title: string;
  sessionTypes: Array<{
    id: string;
    title: string;
    durationMinutes: number;
    priceCents: number;
    currency: string;
  }>;
};

type Slot = {
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  priceCents: number;
  currency: string;
};

type BookingResponse = {
  id: string;
};

export default function BookingCreateScreen() {
  const router = useRouter();
  const { talentId } = useLocalSearchParams<{ talentId: string }>();
  const talentSlug = talentId;
  const [talent, setTalent] = useState<TalentDetail | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [notes, setNotes] = useState('Mobil demo rezervasyonu');
  const [acceptedConsent, setAcceptedConsent] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function loadBookingData() {
    if (!talentSlug) return;
    try {
      setLoading(true);
      setError('');
      const from = new Date().toISOString().slice(0, 10);
      const to = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      const [talentData, slotsData] = await Promise.all([
        apiFetch<TalentDetail>(`/talents/${talentSlug}`),
        apiFetch<{ items: Slot[] }>(`/talents/${talentSlug}/slots?from=${from}&to=${to}`),
      ]);
      setTalent(talentData);
      setSlots(slotsData.items ?? []);
      setSelectedSlot((slotsData.items ?? [])[0] ?? null);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Rezervasyon ekranı yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookingData().catch(() => null);
  }, [talentSlug]);

  const summary = useMemo(() => {
    if (!talent || !selectedSlot) return null;
    return {
      talentName: talent.displayName,
      startsAt: new Date(selectedSlot.startsAt).toLocaleString('tr-TR'),
      duration: selectedSlot.durationMinutes,
      price: `${(selectedSlot.priceCents / 100).toLocaleString('tr-TR')} ${selectedSlot.currency}`,
    };
  }, [selectedSlot, talent]);

  async function createBooking() {
    if (!selectedSlot || !talent) return;
    try {
      setSubmitting(true);
      setError('');
      const payload = {
        talentSlug: talent.slug,
        startsAt: selectedSlot.startsAt,
        durationMinutes: selectedSlot.durationMinutes,
        notes,
        acceptedCameraAudioConsent: acceptedConsent,
      };
      const booking = await apiFetch<BookingResponse>('/bookings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      router.replace(`/booking/${booking.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Rezervasyon oluşturulamadı.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Rezervasyon Oluştur</Text>
      {loading ? <ActivityIndicator size="large" /> : null}
      {error ? <Text style={{ color: '#b91c1c' }}>{error}</Text> : null}
      {!loading && talent ? (
        <>
          <Text>Uzman: {talent.displayName}</Text>
          <Text>Başlık: {talent.title}</Text>
          <Text>1. Slot seç</Text>
          {slots.length ? (
            slots.map((slot) => (
              <View
                key={slot.startsAt}
                style={{
                  borderWidth: 1,
                  borderColor: selectedSlot?.startsAt === slot.startsAt ? '#111827' : '#d1d5db',
                  borderRadius: 12,
                  padding: 12,
                  gap: 4,
                }}
              >
                <Text>{new Date(slot.startsAt).toLocaleString('tr-TR')}</Text>
                <Text>{slot.durationMinutes} dk · {(slot.priceCents / 100).toLocaleString('tr-TR')} {slot.currency}</Text>
                <Button title="Bu slotu seç" onPress={() => setSelectedSlot(slot)} />
              </View>
            ))
          ) : (
            <Text>Bu uzman için önümüzdeki 7 gün içinde uygun slot bulunamadı.</Text>
          )}
          <TextInput placeholder="Notunuz" value={notes} onChangeText={setNotes} style={{ borderWidth: 1, padding: 12 }} multiline />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Kamera/ses işleme onayı</Text>
            <Switch value={acceptedConsent} onValueChange={setAcceptedConsent} />
          </View>
          {summary ? (
            <View style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 4 }}>
              <Text>Özet</Text>
              <Text>Uzman: {summary.talentName}</Text>
              <Text>Tarih/Saat: {summary.startsAt}</Text>
              <Text>Süre: {summary.duration} dk</Text>
              <Text>Tutar: {summary.price}</Text>
            </View>
          ) : null}
          <Button
            title={submitting ? 'Rezervasyon oluşturuluyor...' : 'Mock ödeme ile tamamla'}
            disabled={!selectedSlot || !acceptedConsent || submitting}
            onPress={() => createBooking().catch(() => null)}
          />
        </>
      ) : null}
    </ScrollView>
  );
}
