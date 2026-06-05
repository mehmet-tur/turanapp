import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class BookingConsentDto {
  @IsString()
  type!: string;

  @IsString()
  version!: string;

  @IsBoolean()
  accepted!: boolean;
}

export class BookingQuoteDto {
  @IsString()
  talentId!: string;

  @IsString()
  sessionTypeId!: string;

  @IsDateString()
  startsAt!: string;

  @IsString()
  timezone!: string;
}

export class BookingCreateDto extends BookingQuoteDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  customerNote?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BookingConsentDto)
  consents!: BookingConsentDto[];
}

export class CancelBookingDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
