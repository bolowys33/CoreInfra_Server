import { ApiProperty } from '@nestjs/swagger';
import { CardType } from '@prisma/client';
import { FeeModel } from './card-profile.model';

export class CardModel {
  @ApiProperty({
    title: 'Card  ID',
    description: 'The unique identifier of the card ',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    title: 'Card Holder',
    description: 'The name of the card holder',
    example: 'Taiwo Olubodun',
  })
  cardHolder: string;

  @ApiProperty({
    title: 'Batch Number',
    description: 'Batch number for the card',
    example: 1024,
  })
  batch: number;

  @ApiProperty({
    title: 'Card Type',
    description: 'Type of card',
    enum: CardType,
    example: CardType.DEBIT,
  })
  cardType: CardType;

  @ApiProperty({
    title: 'Pan ',
    description: 'The PAN (Primary Account Number) of the card',
  })
  pan: String;

  @ApiProperty({
    title: 'Expiration (Months)',
    description: 'Expiration period in months',
    example: 36,
  })
  expiry: number;

  @ApiProperty({
    title: 'Created At',
    description: 'Timestamp when the card was issued',
    example: '2024-02-20T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    title: 'Fees',
    description: 'A list of fees associated with the card',
    type: [FeeModel],
  })
  fees: FeeModel;
}
