const pty = require('./');

console.log('=== Basic node-pty AIX Test ===');
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);

try {
  // Test spawn with bash
  console.log('\n1. Testing spawn...');
  const shell = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.cwd(),
    env: process.env
  });

  console.log('✓ Spawn successful');
  console.log('PID:', shell.pid);
  console.log('Process:', shell.process);

  let outputReceived = false;
  
  shell.on('data', (data) => {
    if (!outputReceived) {
      console.log('✓ First data received:', JSON.stringify(data.substring(0, 50)));
      outputReceived = true;
    }
  });

  shell.on('exit', (code, signal) => {
    console.log(`✓ Shell exited with code: ${code}, signal: ${signal}`);
    process.exit(0);
  });

  // Send a simple command
  setTimeout(() => {
    console.log('2. Sending test command...');
    shell.write('echo "Hello AIX PTY Test"\n');
  }, 500);

  // Test resize
  setTimeout(() => {
    console.log('3. Testing resize...');
    shell.resize(100, 50);
    console.log('✓ Resize completed');
  }, 1000);

  // Exit cleanly
  setTimeout(() => {
    console.log('4. Exiting...');
    shell.write('exit\n');
  }, 2000);

} catch (error) {
  console.error('✗ Test failed:', error);
  process.exit(1);
}
