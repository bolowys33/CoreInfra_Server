import { ApiProperty } from '@nestjs/swagger';
import { Issue } from '@prisma/client';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class CreateCardDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the card request',
  })
  @IsUUID()
  cardRequestId: string;

  @ApiProperty({
    example: 'PERSONALIZED',
    description: 'The issue type of the card',
    enum: Issue,
  })
  @IsString()
  @IsEnum(Issue)
  issueType: Issue;
}
