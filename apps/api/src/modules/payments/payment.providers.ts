import { Injectable } from '@nestjs/common';
import {
  AuthorizePaymentInput,
  AuthorizePaymentResult,
  CapturePaymentInput,
  CapturePaymentResult,
  PaymentProviderPort,
  RefundPaymentInput,
  RefundPaymentResult,
} from './payment-provider.interface';

@Injectable()
export class MockPaymentProvider implements PaymentProviderPort {
  async authorize(input: AuthorizePaymentInput): Promise<AuthorizePaymentResult> {
    return {
      provider: 'MOCK',
      providerReference: `mock_auth_${input.bookingId}_${Date.now()}`,
      status: 'AUTHORIZED',
      rawProviderResponse: { mocked: true, input },
    };
  }

  async capture(input: CapturePaymentInput): Promise<CapturePaymentResult> {
    return {
      status: 'CAPTURED',
      rawProviderResponse: { mocked: true, input },
    };
  }

  async refund(input: RefundPaymentInput): Promise<RefundPaymentResult> {
    return {
      status: 'REFUNDED',
      rawProviderResponse: { mocked: true, input },
    };
  }
}

@Injectable()
export class IyzicoPaymentProvider implements PaymentProviderPort {
  async authorize(): Promise<AuthorizePaymentResult> {
    throw new Error('Iyzico provider is not implemented in Phase 1');
  }

  async capture(): Promise<CapturePaymentResult> {
    throw new Error('Iyzico provider is not implemented in Phase 1');
  }

  async refund(): Promise<RefundPaymentResult> {
    throw new Error('Iyzico provider is not implemented in Phase 1');
  }
}
