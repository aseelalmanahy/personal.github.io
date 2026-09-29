import { cp, rm } from 'node:fs/promises';

const SRC = 'src';
const DIST = 'dist';

try {
  await rm(DIST, { recursive: true, force: true });
  await cp(SRC, DIST, { recursive: true });
  console.log(`Copied ${SRC}/ to ${DIST}/`);
} catch (error) {
  console.error(`Build failed: ${error.message}`);
  process.exit(1);
}
