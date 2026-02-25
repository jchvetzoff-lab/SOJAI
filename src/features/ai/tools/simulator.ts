import { flags } from '@/config/flags';

function delay(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withToolSimulation<T>(runner: () => Promise<T>): Promise<T> {
  await delay(flags.demoLatencyMs);

  if (flags.randomFailRate > 0 && Math.random() < flags.randomFailRate) {
    throw new Error('Simulated tool failure (demo randomFailRate).');
  }

  return runner();
}
