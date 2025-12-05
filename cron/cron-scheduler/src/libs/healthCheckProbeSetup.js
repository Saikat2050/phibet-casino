import * as fs from 'fs'

const DIR = './tmp'

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR)
}

fs.writeFileSync('./tmp/health_check_probe.txt', '')

process.on('exit', () => {
  fs.unlinkSync('./tmp/health_check_probe.txt')
})
