const child = require('child_process')

const URLS = [
  'rtsp://admin:12345678@192.168.100.119/ch01.264',
  'rtsp://admin:12345678@192.168.100.129/ch01.264',
  'rtsp://admin:12345678@192.168.100.125/ch01.264',
  'rtsp://admin:12345678@192.168.100.6/ch01.264',
  'rtsp://admin:12345678@192.168.100.16/ch01.264'
]

/**
 * get video stream codec
 * @param {string} url
 * @returns {Promise<string>} codec type in string
 * @example
 * const myStreamCodec = await getStreamType('rtsp://192.168.0.1:554')
 * console.log(myStreamCodec) // h264
 */
function getStreamType (url) {
  const command = `ffprobe -v quiet -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 "${url}"`
  return new Promise((resolve, reject) => {
    child.exec(command, (err, codec) => {
      if (err !== null) {
        reject(err)
        return
      }
      resolve(codec)
    })
  })
}

async function main () {
  const str = await getStreamType(URLS[2])
  console.log('haha', str)
}

main()
