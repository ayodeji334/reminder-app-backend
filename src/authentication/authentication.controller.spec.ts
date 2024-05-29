import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticiationController } from './authentication.controller';
import { AuthenticiationService } from './authentication.service';

describe('AuthenticiationController', () => {
  let controller: AuthenticiationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticiationController],
      providers: [AuthenticiationService],
    }).compile();

    controller = module.get<AuthenticiationController>(
      AuthenticiationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
