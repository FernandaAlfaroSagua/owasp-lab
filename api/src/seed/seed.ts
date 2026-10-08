import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from './seed.service';

// `npm run seed` resets users, products and orders to the documented baseline.
async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn', 'log'] });
  await app.get(SeedService).reset();
  await app.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
