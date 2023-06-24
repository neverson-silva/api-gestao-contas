import { Provider } from '@nestjs/common';
import { FirebaseStorageService } from '@app/storage/services/firebase-storage.service';

export const storageProviders: Provider[] = [
  { provide: 'IStorage', useClass: FirebaseStorageService },
];
