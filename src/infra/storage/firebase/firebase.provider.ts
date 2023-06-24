import { Storage } from '@google-cloud/storage';
import { FirebaseConfig } from './dtos/firebase-config.dto';

export class FirebaseStorageProvider {
  private readonly storage: Storage;

  constructor(config: FirebaseConfig) {
    const options = {
      projectId: config?.projectId,
      credentials: {
        type: config?.type,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore,
        project_id: config?.projectId,
        private_key_id: config?.privateKeyId,
        private_key: config?.privateKey?.replace(/\\n/g, '\n'),
        client_email: config?.clientEmail,
        client_id: config?.clientId,
        auth_uri: config?.authUri,
        token_uri: config?.tokenUri,
        auth_provider_x509_cert_url: config?.authProviderX509CertUrl,
        client_x509_cert_url: config?.clientX509CertUrl,
      },
    };
    this.storage = new Storage(options);
  }

  async uploadFile(
    arquivo: Express.Multer.File,
    bucketName: string,
    fileName?: string,
  ): Promise<string> {
    const destinationFile = fileName ?? arquivo.originalname;

    await this.storage
      .bucket(bucketName)
      .file(destinationFile)
      .save(arquivo.buffer);

    const fileUrl = await this.getUploadedURL(bucketName, destinationFile);

    return fileUrl;
  }

  async downloadFile(filename: string, bucketname: string): Promise<Buffer> {
    const [response] = await this.storage
      .bucket(bucketname)
      .file(filename)
      .download();
    return response;
  }

  private async getUploadedURL(
    bucketName: string,
    destinationFile: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileRef = this.storage.bucket(bucketName).file(destinationFile);
      const config = {
        action: 'read',
        expires: '01-01-2040',
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      fileRef.getSignedUrl(config, function (err, url) {
        if (err) {
          reject(err);
        }

        resolve(url.split('?')[0]);
      });
    });
  }
}
