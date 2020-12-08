export type AppConfig = {
  projectName: string;
  root: string;
  entry: string;
  buildDirPath: string;
  mode: 'development' | 'production';
  env: 'development' | 'testing' | 'production';
  assetsPath: string;
  port: string | number;
  baseApiUrl: string;
};

export declare function getAppConfig(): AppConfig;
