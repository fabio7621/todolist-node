const http = require("http");
const errorHandle = require('./errorHandle')
const { v4: uuidv4 } = require("uuid");
const { log } = require("console");
const todos = [];

const requestListener = (req, res) => {
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };
  let body = ""; //把接到的資料轉成字串
  req.on("data", (chunk) => {
    //分次搬運回來
    body += chunk;
  });
  if (req.url == "/todos" && req.method == "GET") {
    //更改路徑
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        "status": "success",
        "data": todos, //插入todos規格
      })
    );
    res.end();
  } else if (req.url == "/todos" && req.method == "POST") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title; //取到傳回來的內容
        if (title != undefined) {
          const todo = {
            title: title,
            id: uuidv4(),
          };
          todos.push(todo);
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              "status": "success",
              "data": todos,
            })
          );
          res.end();
        } else {
         errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  }else if (req.url == "/todos" && req.method == "DELETE"){
    todos.length = 0 ;  //最簡單把陣列清空的方法
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        "status": "success",
        "data": todos,
      })
    );
    res.end();
  }else if (req.url.startsWith("/todos/") && req.method == "DELETE"){
    const id = req.url.split('/').pop();
    const index = todos.findIndex(element => element.id == id); //找到對應資料索引值
    if(index!=-1){
      todos.splice(index,1);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          "status": "success",
          "data": todos,
        })
      );
      res.end();
    }else{
         errorHandle(res);
    }
   
  }
   else if (req.method == "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        "status": "false",
        "message": "無此網站路由",
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(3005);
