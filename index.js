const fileUpload = require('express-fileupload');
const express = require('express');
const app = express();
const admin_details = require('./models/admin'); 
const data = require('./models/data'); 
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
var cors = require('cors');
var bodyParser = require('body-parser');

app.use(express.json());
app.use(express.urlencoded());// always write first as a middle ware
app.use(cors());
app.use(cookieparser());

// default options
app.use(fileUpload());


//data base
const URI = "mongodb+srv://vkpatel9628:vkp7853@cluster0.qgkuxnl.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(URI);
    //   useUnifiedTopology: true,
    //   useNewUrlParser: true});
const db = mongoose.connection;

db.on('error',console.error.bind(console,'Error into coonect to the database'));

db.once('open',function()
{
    console.log("/////Database is connected sucessfully/////");
});





app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})
 
app.get('/data',async function(req,res)
{
  try{

    let temp = await data.find({});
    return res.json(temp)
  }
  catch(err)
  {
    console.log(err);
    return res.json({
      status : "error",
      error : "Something went wrong"
    })
  }
});


app.get('/adminlogin',async function(req,res)
{
  if (req.body.Username && req.body.Password) {
      const temp = await admin_details.findOne({Username : req.body.Username});
      if(temp!= null)
      {
      if(temp.Password == req.body.Password)
      {
          return res.json({
            status : "ok",
            Username : temp.Username
          });
      }
      else{
        return res.json({
          status : "error",
          error : "Password is incorrect"
        })
      }
    }
    else{
      return res.json({
        status : "error",
        error : "User not found"
      })
    }


    } 
else {
    return res.json({
        error: "Some problem in required Fields!!!",
        status: "error"
    });
}
})
app.post('/upload', function (req, res) {
    let sampleFile;
    let uploadPath;
 
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
 
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.file;
    console.log(__dirname);
    uploadPath = __dirname + '/uploads/' + sampleFile.name;
 
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);
        else{
          let temp = new data({
            Filename : sampleFile.name,
            Path : uploadPath
          })
          temp.save();
          return res.json({
            status : "ok",
            result : "File uploaded successfully"
          })
        }
    });
});
 
app.listen(8000, function (err) {
  if (err) {
      console.log("Error to start server!!!");
      return;
  }
  console.log("Server is running on the port: ", 8000);
})