import { ConfigService } from '@nestjs/config';
import { isArray, isObject } from 'class-validator';

const extractEnvVariable = (value: string): string => {
  const regex = /\${([^}]*)}/;
  const match = regex.exec(value);

  if (match) {
    const variableValue = match[1];
    const [envName, defaultValue] = variableValue?.split(':');
    return process.env[envName] ?? defaultValue;
  }
  return value;
};

const extensions = () => {
  const extractEnvVariables = (value) => {
    if (isArray(value)) {
      return value.map((val) => extractEnvVariables(val));
    }

    if (isObject(value)) {
      const result = {};
      for (const key in value) {
        result[key] = extractEnvVariables(value[key]);
      }
      return result;
    }

    return extractEnvVariable(value);
  };

  ConfigService.prototype.getAt = function (
    key: string,
    options?: Record<string, any>,
  ): any {
    const value = this.get(key, options);
    return extractEnvVariables(value);
  };
};

extensions();
