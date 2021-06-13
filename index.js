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
    await connection.connect(function(err) {
        if (err) throw err;
        connection.query("SELECT * FROM USUARIOS WHERE EMAIL=?", [email], async(err, result) => {
            if (err) throw err;

            //console.log(result.length)

            if (result.length) {
                if (email == result[0].EMAIL && password == result[0].CONTRASENYA) {
                    console.log("HE ENTRADO");
                    devuelve = true;
                    // return devuelve;
                }
            }
        });
    });
    connection.end;
    return devuelve;

}

function comprobarIdUnico(email) {
    var unico = false;
    connection.connect(function(err) {
        if (err) throw err;

        connection.query("SELECT * FROM USUARIOS WHERE EMAIL=?", [email], async(err, result) => {
            if (err) throw err;

            if (result.length == 0) {
                unico = true;
            }
        })
    })
    connection.end;
    return unico;
}

router.route('/')
    .post(function(req, res) {
        console.log(req.body);

        const promise = comprobarAutentificacion(req.body.email, req.body.password);

        promise.then(result =>{
            if (result) {
                res.status(200).send();
            } else {
                res.status(400).send();
            }
    
        })

    });

app.use('/login', router);

router.route('/resgitro')
    .post(function(req, res) {
        console.log(req.body);
        //COMPROBAMOS QUE NO EXISTE UN EMAIL IGUAL
        const aux = comprobarIdUnico(req.body.email);
        if (aux == false) {
            alert("Ya hay un usuario registrado con esta dirección de correo");
        } else {
            //GUARDAMOS AL USUARIO EN LA BASE DE DATOS
            connection.connect(function(err) {
                if (err) throw err;
                var query = connection.query('INSERT INTO USUARIOS(NOMBRE,APELLIDOS,EMAIL,ESADMIN,CONTRASENYA,PUNTOS) VALUES(?, ?, ?, ?, ?,?)', [req.body.name, req.body.apellidos, req.body.email, '0', req.body.contrasenya, '0'], async(err, result) => {
                    if (err) throw err;
                    console.log(query);
                })
            })
            connection.end;
        }
    });


var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '310100sR.',
    database: 'cromos'
});

app.listen(3000, () => {
    console.log("Server on port 3000");
});