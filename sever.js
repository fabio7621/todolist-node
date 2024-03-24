const http = require("http");

const { v4: uuidv4 } = require("uuid");
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
        status: "success",
        data: todos, //插入todos規格
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
              status: "success",
              data: todos,
            })
          );
          res.end();
        } else {
          res.writeHead(400, headers);
          res.write(
            JSON.stringify({
              status: "false",
              message: "欄位未填寫正確",
            })
          );
          res.end();
        }
      } catch (error) {
        console.log(error, "程式錯誤");
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: "false",
            message: "欄位未填寫正確",
          })
        );
        res.end();
      }
    });
  } else if (req.method == "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "false",
        message: "無此網站路由",
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(3005);
