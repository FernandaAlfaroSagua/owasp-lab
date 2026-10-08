import { ValueTransformer } from 'typeorm';

// Postgres returns numeric columns as strings; expose them as numbers.
export const numericTransformer: ValueTransformer = {
  to: (value?: number) => value,
  from: (value?: string | null) => (value == null ? value : parseFloat(value)),
};
