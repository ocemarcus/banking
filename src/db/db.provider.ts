import { Inject } from '@nestjs/common';
import db from './db.client';

export const DB_PROVIDER = 'DbProvider';

export const InjectDb = () => Inject(DB_PROVIDER);

export const dbProvider = {
  provide: DB_PROVIDER,
  useValue: db,
};