import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsEnum,
  IsOptional,
  IsUUID,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Currency, FeeImpact, Frequency, AccountPad } from '@prisma/client';

class FeeDto {
  @ApiProperty({ example: 'Maintenance', description: 'The name of the fee' })
  @IsString()
  name: string;

  @ApiProperty({ example: 500, description: 'The value of the fee' })
  @IsInt()
  value: number;

  @ApiProperty({
    enum: Currency,
    example: Currency.NGN,
    description: 'The currency of the fee',
  })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({
    enum: Frequency,
    example: Frequency.MONTHLY,
    description: 'The frequency of the fee',
  })
  @IsEnum(Frequency)
  frequency: Frequency;

  @ApiProperty({
    enum: FeeImpact,
    example: FeeImpact.ISSUANCE,
    description: 'How the fee impacts the card',
  })
  @IsEnum(FeeImpact)
  impact: FeeImpact;

  @ApiProperty({
    enum: AccountPad,
    example: AccountPad.NONE,
    description: 'The account padding option',
  })
  @IsEnum(AccountPad)
  accountPad: AccountPad;

  @ApiPropertyOptional({
    example: '1234567890',
    description: 'The account associated with the fee (optional)',
  })
  @IsOptional()
  @IsString()
  account?: string;
}

export class CreateCardProfileDto {
  @ApiProperty({
    example: 'Visa Gold',
    description: 'The name of the card profile',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '412345',
    description: 'The BIN prefix for the card profile',
  })
  @IsString()
  binPrefix: string;

  @ApiProperty({
    example: 36,
    description: 'Expiration period in months (Minimum: 36 months)',
  })
  @IsInt()
  @Min(36, { message: 'Expiration must be at least 36 months (3 years)' })
  expiration: number;

  @ApiProperty({
    example: 'Premium Visa Card',
    description: 'A description of the card profile',
  })
  @IsString()
  description: string;

  @ApiProperty({
    enum: Currency,
    example: Currency.NGN,
    description: 'The currency of the card profile',
  })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({
    example: 'Branch123',
    description: 'Blacklist branches for this card profile',
  })
  @IsString()
  branchBlacklist: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The ID of the associated card scheme',
  })
  @IsUUID()
  cardSchemeId: string;

  @ApiPropertyOptional({
    type: [FeeDto],
    description: 'List of fees associated with the card profile (optional)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeeDto)
  fees?: FeeDto[];
}

export class UpdateCardProfileDto extends PartialType(CreateCardProfileDto) {
  @ApiPropertyOptional({
    description: 'Fields that can be updated in a card profile',
  })
  fees?: CreateCardProfileDto['fees'];
}
