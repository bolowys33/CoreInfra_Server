import { ApiProperty } from '@nestjs/swagger';
import { Status, CardType } from '@prisma/client';
import { CardProfileModel } from './card-profile.model';

export class CardRequestModel {
  @ApiProperty({
    title: 'Card Request ID',
    description: 'The unique identifier of the card request',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    title: 'Branch',
    description: 'The branch where the request was initiated',
    example: 'Lagos HQ',
  })
  branch: string;

  @ApiProperty({
    title: 'Batch Number',
    description: 'Batch number for the card request',
    example: 1024,
  })
  batch: number;

  @ApiProperty({
    title: 'Status',
    description: 'Current status of the card request',
    enum: Status,
    example: Status.PENDING,
  })
  status: Status;

  @ApiProperty({
    title: 'Card Type',
    description: 'Type of card requested',
    enum: CardType,
    example: CardType.DEBIT,
  })
  cardType: CardType;

  @ApiProperty({
    title: 'Initiator Name',
    description: 'The name of the user who initiated the request',
    example: 'John Doe',
  })
  initiator: string;

  @ApiProperty({
    title: 'Card Charges',
    description: 'The amount of charges required for each card in NGN',
    example: '₦1,500',
  })
  charges: string;

  @ApiProperty({
    title: 'Is Downloaded',
    description: 'Indicates if the request file has been downloaded',
    example: false,
  })
  isDownloaded: boolean;

  @ApiProperty({
    title: 'Is Sent',
    description: 'Indicates if the request has been sent for processing',
    example: false,
  })
  isSent: boolean;

  @ApiProperty({
    title: 'Created At',
    description: 'Timestamp when the request was created',
    example: '2024-02-20T12:00:00.000Z',
  })
  createdAt: Date;
}
