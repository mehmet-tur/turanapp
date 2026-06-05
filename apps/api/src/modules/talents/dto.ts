import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class SessionTypeInputDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @IsIn([15, 30, 45, 60])
  durationMinutes!: number;

  @IsInt()
  @Min(1000)
  priceMinor!: number;

  @IsString()
  @IsIn(['TRY', 'USD'])
  currency!: string;
}

export class TalentApplyDto {
  @IsString()
  publicName!: string;

  @IsString()
  headline!: string;

  @IsString()
  @MaxLength(5000)
  bio!: string;

  @IsString()
  @IsIn(['ENTERTAINMENT', 'EXPERTISE'])
  segment!: 'ENTERTAINMENT' | 'EXPERTISE';

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  categoryIds!: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SessionTypeInputDto)
  sessionTypes!: SessionTypeInputDto[];
}

export class AvailabilityRuleDto {
  @IsInt()
  @Min(1)
  @Max(7)
  weekday!: number;

  @Matches(/^\d{2}:\d{2}$/)
  startTime!: string;

  @Matches(/^\d{2}:\d{2}$/)
  endTime!: string;

  @IsString()
  timezone!: string;
}
