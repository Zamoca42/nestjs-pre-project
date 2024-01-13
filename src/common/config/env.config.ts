import { ConfigModuleOptions } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsString, validateSync } from 'class-validator';

export const envConfigOptions: ConfigModuleOptions = {
  envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
  isGlobal: true,
  validate,
};

enum Environment {
  Dev = 'dev',
  Production = 'production',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  ALLOWED_ORIGINS: string;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  DATABASE_USER: string;

  @IsString()
  DATABASE_PASS: string;

  @IsString()
  DATABASE_HOST: string;

  @IsString()
  APP_SERVER_PORT: string;

  @IsString()
  DATABASE_PORT: string;

  @IsString()
  TZ: string;
}

function validate(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
