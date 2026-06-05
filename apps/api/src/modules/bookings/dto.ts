import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class BookingQuoteDto {
  @IsString()
  talentSlug!: string;

  @IsDateString()
  startsAt!: string;

  @IsInt()
  @Min(15)
  durationMinutes!: number;
}

export class BookingCreateDto extends BookingQuoteDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsBoolean()
  acceptedCameraAudioConsent!: boolean;
}

export class CancelBookingDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
