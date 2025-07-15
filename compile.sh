# working
mkdir -p build/Release

g++ -o build/Release/pty.o -c src/unix/pty.cc \
  -I/opt/nodejs/include/node \
  -I$HOME/.cache/node-gyp/$(node -v)/include/node \
  -Inode_modules/node-addon-api \
  -I/opt/freeware/include \
  -std=gnu++17 -D_GLIBCXX_USE_CXX11_ABI=0 \
  -fPIC -pthread -Wall -Wextra -Wno-unused-parameter \
  -maix64 -O3 -fno-omit-frame-pointer

# Link the shared library
g++ -shared -maix64 \
  -Wl,-bimport:/opt/nodejs/include/node/node.exp \
  -pthread \
  -lpthread \
  -lstdc++ \
  -o build/Release/pty.node \
  build/Release/pty.o \
  -L$HOME/local/lib \
    $HOME/local/lib/libutil.so.2


