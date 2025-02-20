import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum SchemeName {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  VERVE = 'VERVE',
}

export enum PanLength {
  SIXTEEN = 16,
  NINETEEN = 19,
}

export class CreateCardSchemeDto {
  @ApiProperty({ enum: SchemeName, description: 'Card scheme name' })
  @IsEnum(SchemeName)
  name: SchemeName;

  @ApiProperty({
    enum: PanLength,
    description: 'Length of the PAN (Primary Account Number)',
    example: 16,
  })
  @IsEnum(PanLength, { message: 'panLength must be either 16 or 19' })
  panLength: PanLength;
}

export class UpdateCardSchemeDto {
  @ApiPropertyOptional({ enum: SchemeName, description: 'Card scheme name' })
  @IsEnum(SchemeName)
  @IsOptional()
  name?: SchemeName;

  @ApiPropertyOptional({
    enum: PanLength,
    description: 'Length of the PAN (Primary Account Number)',
    example: 16,
  })
  @IsEnum(PanLength, { message: 'panLength must be either 16 or 19' })
  @IsOptional()
  panLength?: PanLength;
}
