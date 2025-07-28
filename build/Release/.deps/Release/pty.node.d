cmd_Release/pty.node := ln -f "Release/obj.target/pty.node" "Release/pty.node" 2>/dev/null || (rm -rf "Release/pty.node" && cp -pPRf "Release/obj.target/pty.node" "Release/pty.node")
