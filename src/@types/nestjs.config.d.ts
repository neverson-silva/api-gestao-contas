import '@nestjs/config';

declare module '@nestjs/config' {
  interface ConfigService {
    getAt<T>(key: string, options?: Record<string, any>): T | any;
  }
}
