const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const _ = require("lodash");
const http= require("http");
const socketio= require("socket.io");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser,userLeave,getRoomUsers} = require("./utils/users");
const dotenv=require("dotenv");
const mysql= require("mysql");
const bcrypt = require("bcryptjs");
const { result } = require("lodash");
const jwt = require("jsonwebtoken");
const cookieParser=require("cookie-parser");
const { nextTick } = require("process");







dotenv.config({
    path:"./.env",
});


// const db=mysql.createConnection({
//     host:process.env.DATABASE_HOST,
//     user:process.env.DATABASE_USER,
//     password:process.env.DATABASE_PASS,
//     database:process.env.DATABASE,
// });

// db.connect((err)=>{
//     if(err){
//         console.log(err);
//     }else{
//         console.log("MySQL Connection Success");
//     }
// });


const app = express();
const server=http.createServer(app);
const io= socketio(server);


app.set("view engine","ejs");
app.set("views","./views")
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



const botName="Helper Bot";

// run when an client connects

io.on("connection",socket=>{

    socket.on("joinRoom",({username, room})=>{
       
        const user= userJoin(socket.id, username,room);

        socket.join(user.room);
         
    //welcome current user
    socket.emit("message",formatMessage(botName,"Welcome to the communication page"));    //single client

    
     // Broadcast when a user connects
     socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`));                                      //all clients except the one who is connecting
   

     //Send users and room info
     io.to(user.room).emit("roomUsers",{
        room: user.room,
        users: getRoomUsers(user.room)
     })

    })
   
     //Listen for chat Message
     socket.on("chatMessage",(msg)=>{

        const user=getCurrentUser(socket.id);
        io.to(user.room).emit("message",formatMessage(user.username,msg));
    
     })

     
     // Runs when client disconnects
     
     socket.on("disconnect",()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit("message",formatMessage(botName,`${user.username} has left the chat`));


            //Send users and room info
        io.to(user.room).emit("roomUsers",{
            room: user.room,
            users: getRoomUsers(user.room)
            })
        }
        

       
     });


}) 




app.get("/",function(req,res){
    
    res.render('page/login',{msg:""});
});



app.get("/home", function(req,res){
    
    res.render('page/home');
});

app.get("/login",function(req,res){
    res.render('page/login',{msg:""});
});


app.get("/signup",function(req,res){
    res.render('page/signup',{msg:""});
});

app.get("/designer",function(req,res){                         //opens the chat application 
    res.render("page/index")
})

app.get("/join",function(req,res){                         //opens the chat application 
    res.render("page/index")
})

app.get("/materials",function(req,res){                         //opens the chat application 
    res.render("page/material")
})

app.get("/chat",function(req,res){
    res.render("page/chat");
})

app.get("/index",function(req,res){
    res.render('page/index');
});



app.post("/signup",function(req,res){
  
    const name= req.body.name;
    const username= req.body.username;
    const email= req.body.email;
    const password= req.body.password;
    const msg="";
    // db.query("select email from users where email=?",[email],async (error,result)=>{
    //     if(error){
    //         console.log(error);
    //     }
    //     if(result.length>0){
    //        console.log(result);
    //          return res.render("page/signup",{msg:'Email id already exits'});
    //     }

    //     let hashedPassword = await bcrypt.hash(password,8);
        
    //     db.query("insert into users set ?",{name:name,username:username,email:email,password:hashedPassword},(error,result)=>{
    //         if(error){
    //             console.log(error);
    //         }
    //         else{
    //             console.log(result);
    //             return  res.render("page/signup",{msg:'User Registration Success'});  
    //         }
           
    //     });
    // })
    res.render("page/login",{msg:""});
});








app.post("/login",async function(req,res){                                             //to add new data and log in
    //  try{
        
    //     const email= req.body.email;
    //     const password= req.body.password;
        
    //     const msg="";
    //     if(!email || !password){
    //         return res.status(400).render("page/login",{msg:"Please Enter Your Email and Password"});
    //     }
        
    //    db.query("select * from users where email=?",[email],async(error,result)=>{
    //          console.log(result);
    //          if(!result.result <= 0 ){
    //             return res.status(401).render("page/login",{msg:"Email or Password incorrect.."});
    //          }
    //          else{
    //             if(!(await bcrypt.compare(password,result[0].PASSWORD))){
    //                 return res.status(401).render("page/login",{msg:"Email or Password incorrect.."});
    //             }
    //             else{
    //                 const id= result[0].ID;
    //                 const token = jwt.sign({id: id},process.env.JWT_SECRET,{
    //                     expiresIn: process.env.JWT_EXPIRES_IN,
    //                 });
    //                 console.log("The token is "+ token);
    //                 const cookieOptions={
    //                     expires : new Date(
    //                         Date.now() + 
    //                         process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
    //                         ),
    //                         httpOnly: true,
    //                 }
    //                 res.cookie("Suresh",token,cookieOptions);
    //                 res.status(200).redirect("/home");
    //             }
    //          }
    //    });

    //  }catch(error){
    //     console.log(error);
    //  }
})




const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));