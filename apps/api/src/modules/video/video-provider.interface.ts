export interface CreateVideoRoomInput {
  bookingId: string;
  startsAt: Date;
  endsAt: Date;
  recordingEnabled: boolean;
}

export interface CreateVideoRoomResult {
  provider: 'MOCK' | 'AGORA';
  channelName: string;
  providerRoomId?: string;
}

export interface CreateVideoTokenInput {
  bookingId: string;
  channelName: string;
  userId: string;
  role: 'publisher' | 'subscriber';
  expiresAt: Date;
}

export interface CreateVideoTokenResult {
  provider: 'MOCK' | 'AGORA';
  channelName: string;
  token: string;
  uid: string;
  expiresAt: Date;
}

export interface VideoProviderPort {
  createRoom(input: CreateVideoRoomInput): Promise<CreateVideoRoomResult>;
  createToken(input: CreateVideoTokenInput): Promise<CreateVideoTokenResult>;
}
