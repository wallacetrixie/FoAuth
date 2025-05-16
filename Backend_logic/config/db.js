import mysql from 'mysql2' 
const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"auth",
});
db.connect((err)=>{
    if(err) throw err;
    console.log(" database Connected...");
})
module.exports=db;