export interface AuthorizePaymentInput {
  bookingId: string;
  customerId: string;
  amountMinor: number;
  currency: string;
  platformFeeMinor: number;
  talentPayoutMinor: number;
}

export interface AuthorizePaymentResult {
  provider: 'MOCK' | 'IYZICO';
  providerReference: string;
  status: 'AUTHORIZED';
  rawProviderResponse?: unknown;
}

export interface RefundPaymentInput {
  paymentIntentId: string;
  providerReference?: string;
  amountMinor: number;
  reason?: string;
}

export interface RefundPaymentResult {
  status: 'REFUNDED';
  rawProviderResponse?: unknown;
}

export interface CapturePaymentInput {
  paymentIntentId: string;
  providerReference?: string;
  amountMinor: number;
}

export interface CapturePaymentResult {
  status: 'CAPTURED';
  rawProviderResponse?: unknown;
}

export interface PaymentProviderPort {
  authorize(input: AuthorizePaymentInput): Promise<AuthorizePaymentResult>;
  capture(input: CapturePaymentInput): Promise<CapturePaymentResult>;
  refund(input: RefundPaymentInput): Promise<RefundPaymentResult>;
}
