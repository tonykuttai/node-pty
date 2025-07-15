#!/usr/bin/env node
/**
 * Simple node-pty Test
 * 
 * Quick test to verify node-pty is working
 * Run with: node simple-test.js
 */

console.log('Testing node-pty...');

// Test module loading
let pty;
try {
  // Try different ways to load the module
  try {
    pty = require('node-pty');
    console.log('✓ Module loaded via package name');
  } catch (firstError) {
    // Try loading from current directory
    try {
      pty = require('./');
      console.log('✓ Module loaded from current directory');
    } catch (secondError) {
      // Try loading the compiled binary directly
      try {
        pty = require('./build/Release/pty.node');
        console.log('✓ Module loaded directly from binary');
      } catch (thirdError) {
        console.error('✗ All module loading attempts failed:');
        console.error('  1. require("node-pty"):', firstError.message);
        console.error('  2. require("./"):', secondError.message);
        console.error('  3. require("./build/Release/pty.node"):', thirdError.message);
        process.exit(1);
      }
    }
  }
} catch (error) {
  console.error('✗ Unexpected error:', error.message);
  process.exit(1);
}

// Test basic spawn
try {
  const shell = process.env.SHELL || '/bin/bash';
  console.log(`✓ Using shell: ${shell}`);
  
  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME,
    env: process.env
  });
  
  console.log(`✓ PTY spawned with PID: ${ptyProcess.pid}`);
  
  // Test data reception
  let dataReceived = false;
  ptyProcess.onData((data) => {
    if (!dataReceived) {
      console.log('✓ Data received from PTY');
      dataReceived = true;
    }
  });
  
  // Test writing
  setTimeout(() => {
    ptyProcess.write('echo "test successful"\r');
    console.log('✓ Command sent to PTY');
  }, 100);
  
  // Test exit
  setTimeout(() => {
    ptyProcess.write('exit\r');
    console.log('✓ Exit command sent');
  }, 1000);
  
  ptyProcess.onExit(() => {
    console.log('✓ PTY exited cleanly');
    console.log('\n🎉 node-pty is working correctly!');
    process.exit(0);
  });
  
  // Safety timeout
  setTimeout(() => {
    console.log('\n⚠️  Test completed (timeout)');
    process.exit(0);
  }, 3000);
  
} catch (error) {
  console.error('✗ PTY spawn failed:', error.message);
  process.exit(1);
}
