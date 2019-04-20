let express = require('express');
let http = require('http');
let path = require('path');

let app = express();
let server = http.Server(app);

let io = require('socket.io')(server);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

app.get('/main', (req, res) => {
    res.render('main', {msg:'Welcome to express 4!'});
});

let nickList = ['A', 'B', 'C', 'D', 'E'];
//소켓 작업
io.on('connection', (socket) =>{
    console.log(socket.id);
    console.log("클라이언트 접속");
    let idx = Math.floor(Math.random() * nickList.length);
    let randomNick = nickList[idx];
    socket.nickname = randomNick;

    socket.on('change', (data)=>{
        let name = data.name;
        io.emit('server-msg', {text: `${socket.nickname}님이 ${name} 으로 변경하였습니다.`});
        socket.nickname = name;
    });

    socket.on('gondr', (data)=>{
        let msg = `${socket.nickname} : ${data.text}`;
        io.emit('server-msg', {text: msg});
    })

    socket.on('disconnect', ()=>{
        console.log("유저 연결 종료");
    });
});

server.listen(10500, ()=>{
    console.log("서버가 10500포트에서 실행중입니다.");
});