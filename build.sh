rm -rf build/
npm run clean 2>/dev/null || true
npx node-gyp clean
npx node-gyp configure
npx node-gyp build
