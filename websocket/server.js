const express = require('express')
const expressWs = require('express-ws')

const app = express()
expressWs(app)

app.ws('/ws', (ws, req) => {
  let count = 0
  setInterval(() => {
    count++
  }, 1000)
  let timer = setInterval(() => {
    ws.send(`发送数据--${count++}`)
    if (count > 5) {
      clearInterval(timer)
    }
  }, 1000)

  ws.on('message', (msg) => {
    // 对心跳包做出应答
    if (msg == 'heartbeat') {
      console.log(count)
      if (count > 10) {
        // 模拟服务器挂了的情况
        return
      }

      ws.send('')
    }
  })
})

app.listen(3000, () => {
  console.log('listen at http://localhost:3000')
})
