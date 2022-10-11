class Socket {
  // 锁定重连
  lockReconnect = false
  timer = null
  serverTimer = null
  defaultOption = {
    duration: 30000,
    onMessage: () => {},
    onOpen: () => {},
    onError: () => {},
  }

  constructor(opt) {
    let options = Object.assign({}, this.defaultOption, opt)
    this.url = options.url
    this.duration = options.duration
    this.onOpen = options.onOpen
    this.onMessage = options.onMessage
    this.onError = options.onError
    this.connect()
  }

  connect() {
    this.socket = new WebSocket(this.url)
    this.lockReconnect = false

    this.socket.onopen = (event) => {
      console.log('socket', this)
      this.heartbeatCheck()
      this.onOpen()
    }

    this.socket.onmessage = (event) => {
      this.heartbeatCheck()
      this.onMessage(event)
    }

    this.socket.onclose = () => {
      console.log('connect close', this.lockReconnect)
      if (this.lockReconnect) {
        this.connect()
      }
    }

    this.socket.onerror = () => {
      console.log('connect error', event.data)
      this.onError()
    }
  }

  /**
   * 心跳包
   */
  heartbeatCheck() {
    this.timer && clearTimeout(this.timer)
    this.serverTimer && clearTimeout(this.serverTimer)
    this.timer = setTimeout(() => {
      this.socket.send('heartbeat')
      // 服务器响应超时既为服务器挂了。关闭WebSocket
      this.serverTimer = setTimeout(() => {
        this.lockReconnect = true
        this.socket.close()
      }, this.duration)
    }, this.duration)
  }

  /**
   * 手动关闭WebSocket
   */
  destory() {
    this.lockReconnect = false
    if (this.socket) {
      this.socket.close()
    }
    this.timer && clearTimeout(this.timer)
    this.serverTimer && clearTimeout(this.serverTimer)
  }
}
