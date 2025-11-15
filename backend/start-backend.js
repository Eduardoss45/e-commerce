const { spawn } = require('child_process');

// Inicia o backend (npm run start)
spawn('npm', ['run', 'start'], {
  stdio: 'inherit',
  shell: true,
});

// Inicia o ngrok na porta 3000
spawn('ngrok', ['http', '3000'], {
  stdio: 'inherit',
  shell: true,
});
