import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseStorageProvider } from '@infra/storage/firebase/firebase.provider';
import { FirebaseConfig } from '@infra/storage/firebase/dtos/firebase-config.dto';
import {
  DownloadResponse,
  IStorage,
  UploadResponse,
} from '@app/storage/interfaces/storage.interface';

@Injectable()
export class FirebaseStorageService implements IStorage {
  private readonly provider: FirebaseStorageProvider;
  private readonly bucketName: string;
  constructor(configService: ConfigService) {
    const config = configService.getAt('storage.firebase') as FirebaseConfig;
    this.provider = new FirebaseStorageProvider(config);
    this.bucketName = config.bucketName;
  }

  async download(filemame: string): Promise<DownloadResponse> {
    const content = await this.provider.downloadFile(filemame, this.bucketName);
    return { content };
  }

  async upload(file: Express.Multer.File): Promise<UploadResponse> {
    const url = await this.provider.uploadFile(file, this.bucketName);
    return { url };
  }
}
