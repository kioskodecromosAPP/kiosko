const express = require('express');
const app = express();
const router = express.Router();
const fetch = require('node-fetch');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mysql = require('mysql');


 async function comprobarAutentificacion(email, password) {
    var devuelve = false;
   await connection.connect(function (err) {
        if (err) throw err;
        connection.query("SELECT * FROM USUARIOS WHERE EMAIL=?", [email], async (err, result) => {
            if (err) throw err;

            //console.log(result.length)

            if(result.length){
                if (email == result[0].EMAIL && password == result[0].CONTRASENYA) {
                    console.log("HE ENTRADO");
                    devuelve = true;
                   // return devuelve;
                }
            }
        });
    });

    return devuelve;

}

router.route('/')
    .post(function (req, res) {
        console.log(req.body);

        const promise = comprobarAutentificacion(req.body.email, req.body.password);

        if (promise) {
            res.status(200).send();
        } else {
            res.status(400).send();
        }

    });

app.use('/login', router);



var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '310100sR.',
    database: 'cromos'
});

app.listen(3000, () => {
    console.log("Server on port 3000");
});