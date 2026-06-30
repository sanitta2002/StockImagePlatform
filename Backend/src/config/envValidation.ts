import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: number;
  MONGODB_URI: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  CLIENT_URL: string;
  REFRESH_TOKEN_MAX_AGE: number;
  JWT_RESET_SECRET: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  
}

const validateEnv = (): EnvConfig => {
  const requiredVars = [
    "MONGODB_URI",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET"
  
  ];

  for (const key of requiredVars) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return {
    PORT: Number(process.env.PORT) || 5000,
    MONGODB_URI: process.env.MONGODB_URI as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    REFRESH_TOKEN_MAX_AGE: Number(process.env.REFRESH_TOKEN_MAX_AGE) || 604800000,
    JWT_RESET_SECRET: process.env.JWT_RESET_SECRET as string,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
  };
};

export const env = validateEnv();
