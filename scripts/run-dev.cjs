const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')

const projectRoot = path.resolve(__dirname, '..')
const lockPath = path.join(projectRoot, '.next', 'dev', 'lock')

if (fs.existsSync(lockPath)) {
  try {
    fs.unlinkSync(lockPath)
    console.log('Oude dev-lock verwijderd.')
  } catch (_) {}
}

const isWin = process.platform === 'win32'
const child = spawn(isWin ? 'npx.cmd' : 'npx', ['next', 'dev', '-p', '3000'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: false,
})

child.on('exit', (code) => process.exit(code ?? 0))
