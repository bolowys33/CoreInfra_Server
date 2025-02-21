import { ApiProperty } from '@nestjs/swagger';
import { CardType, Status } from '@prisma/client';
import { IsEnum, IsInt, IsString, IsUUID } from 'class-validator';

export class CreateCardRequestDto {
  @ApiProperty({
    example: 'Main Branch',
    description: 'Branch requesting the card',
  })
  @IsString()
  branch: string;

  @ApiProperty({
    example: 'DEBIT',
    enum: CardType,
    description: 'Type of card requested',
  })
  @IsEnum(CardType)
  cardType: CardType;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the card profile',
  })
  @IsUUID()
  cardProfileId: string;
}

export class UpdateCardStatusDto {
  @ApiProperty({
    example: 'READY',
    enum: Status,
    description: 'Updated status of the card request',
  })
  @IsEnum(Status)
  status: Status;
}
