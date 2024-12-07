const mysql=require('mysql2');
require('dotenv').config();
const db=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    database:process.env.DB,
    password:process.env.DB_PASSWORD,
    port:3306
});

db.connect((err)=>{
    if(err){
        console.log("error in connecting database",err)
    }
    else{
       console.log("Successfully connected Database.") ;
       const query=`SELECT 1`;
       db.query(query,(err,result)=>{
        if(err){
            console.log("error");
        }
        else{
            console.log(result);
        }
       })
       console.log({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB,
        password: process.env.DB_PASSWORD,
        port: process.env.PORT
    }); 
    }
})
module.exports=db;
