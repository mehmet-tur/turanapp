export interface CreateVideoSessionInput {
  bookingId: string;
  talentId: string;
  userId: string;
  startsAt: Date;
  endsAt: Date;
}

export interface CreateVideoSessionResult {
  roomId: string;
  userJoinToken: string;
  talentJoinToken: string;
  provider: 'MOCK' | 'AGORA';
}

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
  createSession(input: CreateVideoSessionInput): Promise<CreateVideoSessionResult>;
  createRoom(input: CreateVideoRoomInput): Promise<CreateVideoRoomResult>;
  createToken(input: CreateVideoTokenInput): Promise<CreateVideoTokenResult>;
}
