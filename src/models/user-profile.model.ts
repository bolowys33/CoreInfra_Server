import { ApiProperty } from '@nestjs/swagger';

export class UserResponseModel {
  @ApiProperty({
    title: 'User ID',
    description: 'The ID of the User',
  })
  id: string;

  @ApiProperty({
    title: 'Full name',
    description: 'The name of the User',
  })
  name: string;

  @ApiProperty({
    title: 'Email',
    description: 'The email of the User',
  })
  email: string;

  @ApiProperty({
    title: 'Is Admin',
    description: 'If the user is an administrator or regular user',
  })
  isAdmin: boolean;
}

export class DashboardModel {
  @ApiProperty({
    title: 'Active Cards',
    description: 'Total number of active cards in the system',
    example: 100,
  })
  activeCard: number;

  @ApiProperty({
    title: 'Personalized Cards',
    description: 'Total number of personalized cards issued',
    example: 50,
  })
  personalizedCard: number;

  @ApiProperty({
    title: 'Instant Cards',
    description: 'Total number of instant cards issued',
    example: 30,
  })
  instantCard: number;

  @ApiProperty({
    title: 'Card Requests',
    description: 'Total number of card requests',
    example: 20,
  })
  cardRequest: number;
}

