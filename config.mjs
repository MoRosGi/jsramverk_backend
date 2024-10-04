import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

export const config = {
    atlasUsername: process.env.ATLAS_USERNAME,
    atlasPassword: process.env.ATLAS_PASSWORD,
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
};
