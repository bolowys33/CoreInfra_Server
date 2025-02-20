import { ApiProperty } from '@nestjs/swagger';

export class ResponseModel<T> {
  @ApiProperty({
    description: 'Status of the API Call',
    title: 'API Status Response',
  })
  isSuccessful: boolean;

  @ApiProperty({
    description:
      'API response message. This will be the display message in case of an error or where a message needs to be displayed',
    title: 'API Status Response Message',
  })
  message: string;

  @ApiProperty({
    title: 'API Response Data',
    description:
      'API Response Data. This is the data of dto for any API Request. This will be empty if we do not expect any data',
  })
  data?: T;
}
