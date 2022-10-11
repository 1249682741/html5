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