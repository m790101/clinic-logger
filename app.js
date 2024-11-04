const express = require('express') 
const dotenv = require('dotenv');
const cors = require('cors')


dotenv.config();
const app = express();

const PORT = process.env.PORT;


const corsOptions = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions))
app.use(express.json());


app.get("/", (req, res) => { 
  res.status(200).send("Hello World");
}); 


app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
})