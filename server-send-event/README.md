# HTML5 服务器发送事件 (Server-Send-Event)
允许网页获取来自服务器的更新

## Server-Sent事件-单向消息传递
Server-Sent事件是指网页自动获取来自服务器的更新。例如：Facebook/Twiter更新、股价更新、新的博文、赛事结果

## Server-Sent事件支持及通知
```js
if (typeof EventSource != 'undefined'){
  let source = new EventSource('http://localhost:3000/sse')
  source.onmessage = (evnet) => {
    app.innerHTML = app.innerHTML += event.data
  }
} else {
  console.log('not support EventSource');
}
```

### EventSource对象
| 事件 | 描述 |
| --   | --  |
|onopen|当通往服务器的连接被打开|
|onmessage|当接收消息|
|onerror|当发生错误|

## 服务端代码实例
> 设置请求头是重点：
> 
> 'Content-Type': 'text/event-stream'
> 
> 'Cache-Control': 'no-cache'

```js
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

app.get('/sse',(req, res)=>{
  res.header({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  });

  const interval = setInterval(() => {
    res.write("data: " + (new Date()) + "\n\n");
  }, 1000);

  setTimeout(() => {
    clearInterval(interval);
      res.write("event: close\n");
    }, 4000);
  })

app.listen('3000', () => {
  console.log('listen at http://localhost:3000');
})

````