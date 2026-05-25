import { spawn } from 'node:child_process';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
let shuttingDown = false;

const processes = [
  ['backend', ['--prefix', 'backend', 'run', 'dev']],
  ['frontend', ['--prefix', 'frontend', 'run', 'dev']],
].map(([name, args]) => {
  const child = spawn(npmCommand, args, {
    cwd: process.cwd(),
    env: process.env,
    shell: false,
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (chunk) => process.stdout.write(`[${name}] ${chunk}`));
  child.stderr.on('data', (chunk) => process.stderr.write(`[${name}] ${chunk}`));
  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    console.error(`[${name}] exited with ${signal || code}`);
    shutdown(code || 1);
  });

  return child;
});

function shutdown(code = 0) {
  shuttingDown = true;
  for (const child of processes) {
    if (!child.killed) child.kill();
  }
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
