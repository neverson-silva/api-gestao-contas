import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { storageProviders } from '@app/storage/storage.provider';

@Module({
  imports: [ConfigModule],
  providers: storageProviders,
  exports: storageProviders,
})
export class StorageModule {}
