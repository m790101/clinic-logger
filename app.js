const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const amqp = require("amqplib/callback_api");

dotenv.config();
const app = express();

const PORT = process.env.PORT;

const corsOptions = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

let fs = require("fs");
let path = require("path");

// 根據檔案來增加channel
let channelsPath = path.join(__dirname, "./channels");
let files = fs.readdirSync("./channels");
let channelConfigs = files
  .filter((file) => {
    return file.match(/.+\.js$/g);
  })
  .map((file) => {
    return require(path.join(channelsPath, file));
  })
  .filter(({ exchange, topic, handler }) => {
    if (!exchange || !topic || !handler) {
      return false;
    }
    return true;
  });

// 沒有可用的 channel 設定
if (channelConfigs.length == 0) {
  console.log("[exit] please config js files in /channels");
  console.log(
    "[exit] 在/channels目錄下，設定你的訊息處理器，檔名需.js為結尾才會被讀取"
  );
  process.exit(1);
}

(async () => {
  for (config of channelConfigs) {
    const { exchange: queue, topic: sessionId, handler } = config;

    amqp.connect("amqp://localhost", function (error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function (error1, channel) {
        if (error1) {
          throw error1;
        }

        var queue = process.env.SERVICEBUS_CHANNEL;

        channel.assertQueue(queue, {
          durable: false,
        });

        console.log(
          " [*] Waiting for messages in %s. To exit press CTRL+C",
          queue
        );

        channel.consume(
          queue,
          function (msg) {
            // handler(data);
            console.log(" [x] Received %s", msg.content.toString());
          },
          {
            noAck: true,
          }
        );
      });
    });
  }
})();

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });
