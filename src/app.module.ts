import { AutenticacaoModule } from '@app/autenticacao/autenticacao.module';
import { ContaModule } from '@app/conta/conta.module';
import { DashboardModule } from '@app/dashboard/dashboard.module';
import { FaturaModule } from '@app/fatura/fatura.module';
import { PessoaModule } from '@app/pessoa/pessoa.module';
import { TotalPessoaModule } from '@app/total-pessoa/total-pessoa.module';
import { DatabaseConfig } from '@config/app.config';
import configuration from '@config/configuration';
import { AllExceptionFilter } from '@filters/allException.filter';
import { AuthenticationGuard } from '@guards/authentication.guard';
import { AuthorizationGuard } from '@guards/authorization.guard';
import { TransformInterceptor } from '@infra/interceptors/transformer.interceptor';
import { CustomLogger } from '@infra/loggers/typeorm.logger';
import {
  ClassSerializerInterceptor,
  ConsoleLogger,
  Module,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { StorageModule } from './app/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      ignoreEnvFile: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      extraProviders: [ConfigService],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const database: DatabaseConfig =
          configService.getAt<DatabaseConfig>('database');
        return {
          ...database,
          namingStrategy: new SnakeNamingStrategy(),
          logger: new CustomLogger(),
        } as any;
      },
    }),
    AutenticacaoModule,
    PessoaModule,
    FaturaModule,
    DashboardModule,
    ContaModule,
    TotalPessoaModule,
    StorageModule,
  ],
  controllers: [],
  providers: [
    ConsoleLogger,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
