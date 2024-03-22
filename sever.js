const http = require('http');

const { v4:uuidv4 } =require('uuid');
const todos =[];

const requestListener = (req, res)=>{
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    let body="";     
    req.on('data',chunk=>{
        body+=chunk;
    })
    req.on('end',()=>{
        console.log(body);
    })
    if(req.url=="/todos" && req.method == "GET"){  //更改路徑
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,  //插入todos規格
        }));
        res.end();
    }
    else if(req.url=="/todos" && req.method=="POST"){
        res.writeHead(200,headers);
        res.write(JSON.stringify({
          "status": "success",
          "data": todos, 
        }));
        res.end();
    }
    else if(req.method == "OPTIONS"){
      res.writeHead(200,headers);
      res.end();
    }
    else{
        res.writeHead(404,headers);
        res.write(JSON.stringify({
            "status": "false",
            "message": "無此網站路由"
        }));
        res.end();
    }
    
}

const server = http.createServer(requestListener);
server.listen(3005);