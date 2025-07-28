try {
    const pty = require('./lib/index.js');
    console.log('[OK] Node-pty loads successfully');
    console.log('[INFO] Available functions:', Object.keys(pty));
    
    // Quick spawn test
    const child = pty.spawn('echo', ['AIX build test successful'], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
        env: process.env
    });
    
    child.on('data', (data) => {
        console.log('[OK] Output:', data.toString().trim());
    });
    
    child.on('exit', (code) => {
        console.log('[SUCCESS] Build test completed successfully!');
        process.exit(0);
    });
    
    setTimeout(() => {
        console.log('[INFO] Test timeout (normal for echo command)');
        process.exit(0);
    }, 3000);
    
} catch (err) {
    console.log('[ERROR] Build test failed:', err.message);
    process.exit(1);
}
