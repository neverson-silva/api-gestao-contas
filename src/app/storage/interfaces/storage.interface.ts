export interface UploadResponse {
  url: string;
}
export interface DownloadResponse {
  content: Buffer;
}
export interface IStorage {
  upload(file: Express.Multer.File): Promise<UploadResponse>;
  download(filemame: string): Promise<DownloadResponse>;
}
