#!/bin/bash

# Create build directory
mkdir -p build/Release

# Compile the source
echo "Compiling source..."
g++ -o build/Release/pty.o -c src/unix/pty.cc \
  -I/opt/nodejs/include/node \
  -I$HOME/.cache/node-gyp/$(node -v)/include/node \
  -Inode_modules/node-addon-api \
  -I/opt/freeware/include \
  -I$HOME/local/portlibforaix/include \
  -std=gnu++17 -D_GLIBCXX_USE_CXX11_ABI=0 \
  -fPIC -pthread -Wall -Wextra -Wno-unused-parameter \
  -maix64 -O3 -fno-omit-frame-pointer

# Link the shared library
echo "Linking shared library..."
g++ -shared -maix64 \
  -Wl,-bimport:/opt/nodejs/include/node/node.exp \
  -pthread \
  -lpthread \
  -lstdc++ \
  -o build/Release/pty.node \
  build/Release/pty.o \
  -L$HOME/local/portlibforaix/lib \
  $HOME/local/portlibforaix/lib/libutil.so.2 \
  -lpthread \
  -lstdc++

echo "Build completed successfully!"
echo "Module created: build/Release/pty.node"

# Test the module
echo "Testing module..."
node -e "
try {
  const pty = require('./build/Release/pty.node');
  console.log('✓ Module test passed!');
} catch (error) {
  console.error('✗ Module test failed:', error.message);
  process.exit(1);
}"

echo "🎉 node-pty native module is ready!"
