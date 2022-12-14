# WebSocket

## 特点
1. 建立在TCP协议上， 服务端比较容易实现
2. 与HTTP协议有良好的兼容性。默认端口也是80与443
3. 数据格式比较轻量，性能开销小，通信高效。
4. 可以发送文本，也可以发送二进制数据。
5. 没有同源限制， 客户端可与任意服务器通信
6. 协议的标识符是ws/wss

## 缺点
WebSocket是长连接，受网络限制较大，需要处理好重连。
WebSocket有很多坑，涉及到页面、定时推送、复杂的推送。比较容易出问题，不管是前端还是服务端。

## 具体连接方式
通过在请求头添加``Upgrade: WebSocket`` 及``通信密钥（Sec-WebSocket-Key）``, 使双方握手成功，建立全双工通信

## 掉线重连（心跳包）
websocket超时没有消息自动断开连接的应对措施。这时需要知道服务端设置的超时时间是多少，在小于超时时间内发送心跳包。两种方案：
- 客户端主动发送上行心跳包
- 服务端主动发送下行心跳包

### 心跳包机制
顾名思义，它像心跳一样每固定时间发一次，以告知服务器这个客户端还活着。事实上这是为了保持长连接，至于这个包一般是很小的包或者只包含包头的空包。

心跳包一般来说都是在逻辑层发送空的echo包来实现的。下一个定时器，在一定时间空隔下发送一个空包给客户端，然后客户端反馈一个同样的空包回来，服务器如果在一定时间内收不到客户端发送过来的反馈包，那只有认定掉线了。

在长连接下，有可能很长一段时间没有数据往来。理论上说，这个连接时一直保持连接的，但在实际情况中，如果中间节点出现什么故障时难以知道的。更要命的是，有的节点（防火墙）会自动把一定时间内没有数据交互的连接给断掉。此时就需要心跳包来保活

前端心跳检测步骤
1. 客户端每隔一个时间间隔发送一个探测包给服务器
2. 客户端发包时启动一个超时定时器
3. 服务器端接收到检测包，应该回应一个包
4. 若客户端收到服务器的应答包，说明服务器正常，删除超时定时器
5. 若客户端的超时定时器超时依然没收到应答包，说明服务器挂了

### 前端发送心跳包的主要代码
```js

```