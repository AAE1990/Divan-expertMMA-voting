import { DynamicModule, Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderOptionSymol, TypeAsyncOptions, TypeOptions } from './provider.constants';

@Module({})
export class ProviderModule {
  public static register(options: TypeOptions): DynamicModule {
    return {
      module: ProviderModule,
      providers: [
        {
          useValue: options.services,
          provide: ProviderOptionSymol
        },
        ProviderService
      ],
      exports: [ProviderService]
    }
  }

  public static registerAsync(options: TypeAsyncOptions): DynamicModule {
    return {
      module: ProviderModule,
      imports: options.imports,
      providers: [
        {
          useFactory: options.useFactory,
          provide: ProviderOptionSymol,
          inject: options.inject
        },
        ProviderService
      ],
      exports: [ProviderService]
    }
  }
}
