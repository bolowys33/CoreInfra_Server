import { ApiProperty } from '@nestjs/swagger';
import { Currency, FeeImpact, Frequency, AccountPad } from '@prisma/client';

export class FeeModel {
  @ApiProperty({
    title: 'Fee ID',
    description: 'The unique identifier of the fee',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    title: 'Fee Name',
    description: 'The name of the fee',
    example: 'Maintenance',
  })
  name: string;

  @ApiProperty({
    title: 'Fee Value',
    description: 'The value of the fee',
    example: 500,
  })
  value: number;

  @ApiProperty({
    title: 'Currency',
    description: 'The currency of the fee',
    enum: Currency,
    example: Currency.NGN,
  })
  currency: Currency;

  @ApiProperty({
    title: 'Frequency',
    description: 'The frequency of the fee charge',
    enum: Frequency,
    example: Frequency.MONTHLY,
  })
  frequency: Frequency;

  @ApiProperty({
    title: 'Fee Impact',
    description: 'How the fee impacts the card profile',
    enum: FeeImpact,
    example: FeeImpact.ISSUANCE,
  })
  impact: FeeImpact;

  @ApiProperty({
    title: 'Account Pad',
    description: 'The account padding type',
    enum: AccountPad,
    example: AccountPad.NONE,
  })
  accountPad: AccountPad;

  @ApiProperty({
    title: 'Linked Account',
    description: 'The linked account associated with the fee (optional)',
    example: '1234567890',
    required: false,
  })
  account?: string;
}

export class CardProfileModel {
  @ApiProperty({
    title: 'Card Profile ID',
    description: 'The unique identifier of the card profile',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    title: 'Card Name',
    description: 'The name of the card profile',
    example: 'Visa Gold',
  })
  name: string;

  @ApiProperty({
    title: 'BIN Prefix',
    description: 'The BIN prefix associated with the card profile',
    example: '412345',
  })
  binPrefix: string;

  @ApiProperty({
    title: 'Expiration (Months)',
    description: 'Expiration period in months',
    example: 36,
  })
  expiration: number;

  @ApiProperty({
    title: 'Description',
    description: 'A brief description of the card profile',
    example: 'Premium Visa Card',
  })
  description: string;

  @ApiProperty({
    title: 'Currency',
    description: 'The currency associated with the card profile',
    enum: Currency,
    example: Currency.NGN,
  })
  currency: Currency;

  @ApiProperty({
    title: 'Branch Blacklist',
    description: 'Branches where this card profile is blacklisted',
    example: 'Branch123',
  })
  branchBlacklist: string;

  @ApiProperty({
    title: 'Card Scheme Name',
    description: 'The name of the associated card scheme',
    example: 'Visa',
  })
  cardScheme: string;

  @ApiProperty({
    title: 'Created At',
    description: 'Timestamp when the card profile was created',
    example: '2024-02-20T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    title: 'Fees',
    description: 'A list of fees associated with the card profile',
    type: [FeeModel],
  })
  fees: FeeModel[];
}
