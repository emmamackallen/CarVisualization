const express = require("express");
const app = express();
app.use(express.static('public'));

app.get('/start',(res,req)=>{
    
})
app.listen(3000);

