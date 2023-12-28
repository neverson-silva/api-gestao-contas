export interface App {
  app: {
    auth: {
      secret: string;
      signOptions: {
        expiresIn: string;
      };
    };
    http: {
      host: string;
      port: number;
    };
  };
  database: DatabaseConfig;
  environment: {
    TZ: string;
  };
  storage: {
    firebase: FirebaseConfig;
  };
}

export interface DatabaseConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  timezone: string;
  logging: boolean | string[];
  entities: string[];
  synchronize: boolean;
  ssl: {
    rejectUnauthorized: boolean;
  };
  extra: {
    options: string;
    connectTimeout: number;
    sslmode: string;
  };
}

export interface FirebaseConfig {
  bucketName: string;
  projectId: string;
  type: string;
  privateKeyId: string;
  privateKey: string;
  clientEmail: string;
  clientId: string;
  authUri: string;
  tokenUri: string;
  authProviderX509CertUrl: string;
  ClientX509CertUrl: string;
}
