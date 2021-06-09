const express = require('express');
const app = express();
const router = express.Router();
const fetch = require('node-fetch');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


function comprobarAutentificacion(email,password){
    if(email == "123" && password == "root"){
        return true;
    }else{
        return false;
    }
}

router.route('/')
    .post(function(req,res){
       console.log(req.body);
        
       const autentificacion = comprobarAutentificacion(req.body.email, req.body.password);

       if(autentificacion){
           res.status(300).send();
       }else{
           res.status(400).send();
       }

    })

app.use('/login',router);

app.listen(3000,() => {
    console.log("Server on port 3000");
});
