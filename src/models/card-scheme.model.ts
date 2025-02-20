import { ApiProperty } from '@nestjs/swagger';

export class CardSchemeModel {
  @ApiProperty({
    title: 'Scheme ID',
    description: 'The ID of the Scheme',
  })
  id: string;

  @ApiProperty({
    title: 'Scheme name',
    description: 'The name of the scheme',
  })
  name: string;

  @ApiProperty({
    title: 'Pan Length',
    description: 'Length of the PAN (Primary Account Number)',
  })
  panLength: number;
}
