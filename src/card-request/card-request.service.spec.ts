import { Test, TestingModule } from '@nestjs/testing';
import { CardRequestService } from './card-request.service';

describe('CardRequestService', () => {
  let service: CardRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardRequestService],
    }).compile();

    service = module.get<CardRequestService>(CardRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
