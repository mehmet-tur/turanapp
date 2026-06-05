import { Injectable } from '@nestjs/common';
import {
  CreateVideoSessionInput,
  CreateVideoSessionResult,
  CreateVideoRoomInput,
  CreateVideoRoomResult,
  CreateVideoTokenInput,
  CreateVideoTokenResult,
  VideoProviderPort,
} from './video-provider.interface';

@Injectable()
export class MockVideoProvider implements VideoProviderPort {
  async createSession(input: CreateVideoSessionInput): Promise<CreateVideoSessionResult> {
    return {
      roomId: `mock-room-${input.bookingId}`,
      userJoinToken: `mock-user-token-${input.bookingId}`,
      talentJoinToken: `mock-talent-token-${input.bookingId}`,
      provider: 'MOCK',
    };
  }

  async createRoom(input: CreateVideoRoomInput): Promise<CreateVideoRoomResult> {
    return {
      provider: 'MOCK',
      channelName: `booking_${input.bookingId}`,
      providerRoomId: `mock_room_${input.bookingId}`,
    };
  }

  async createToken(input: CreateVideoTokenInput): Promise<CreateVideoTokenResult> {
    return {
      provider: 'MOCK',
      channelName: input.channelName,
      token: `mock-token-${input.bookingId}-${input.userId}`,
      uid: input.userId,
      expiresAt: input.expiresAt,
    };
  }
}

@Injectable()
export class AgoraVideoProvider implements VideoProviderPort {
  async createSession(input: CreateVideoSessionInput): Promise<CreateVideoSessionResult> {
    return {
      roomId: `agora-room-${input.bookingId}`,
      userJoinToken: '',
      talentJoinToken: '',
      provider: 'AGORA',
    };
  }

  async createRoom(input: CreateVideoRoomInput): Promise<CreateVideoRoomResult> {
    return { provider: 'AGORA', channelName: `booking_${input.bookingId}` };
  }

  async createToken(): Promise<CreateVideoTokenResult> {
    throw new Error('Agora token generation is not implemented in Phase 1');
  }
}
