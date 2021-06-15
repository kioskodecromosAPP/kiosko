const express = require('express');
const app = express();
const router = express.Router();
const fetch = require('node-fetch');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const pokemon = require('pokemontcgsdk');
pokemon.configure({ apiKey: 'b00e4133-8d52-447c-96fa-0ef1007f84e3' });
const mysql = require('mysql');
let cookieCreada = false;

const fs = require('fs');
const { query } = require('express');
const data = fs.readFileSync('soluciones.json', 'utf-8');
let solucion = JSON.parse(data);

/*pokemon.set.find('sm1')
    .then(card => {
        console.log(card)
    });
pokemon.card.find('sm1-79')
    .then(card => {
        console.log(card)
    });
pokemon.card.where({q: 'set.id:sm1'})
    .then((cards) => {
        console.log(cards.count);
    })*/

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin',
    database: 'cromos'
});

try {
    connection.connect(function (err) {
        if (err) throw err;
    });
} catch (err) {
    console.log("Error al abrir la BD");
}

app.post('/getCarta', async function (req, res) {
    let card = await pokemon.card.find(req.body.idCarta);
    res.status(200).json(card);
})

app.post('/getCol', function (req, res) {
    console.log("MADREEE")
    let id = req.body.id;
    app.get('/getCol', function (req, res) {
        console.log("HIIJOOO")
        var string = JSON.stringify(id);
        var json = JSON.parse(string);

        console.log(json);
        res.send(json);
    })
})

app.post('/comprarCarta', function (req, res) {
    //PRIMERO HAY QUE QUITAR UNA UNIDAD A LA CARTA
    connection.query("UPDATE cromos SET NUMCOPIAS = (NUMCOPIAS - 1) WHERE ID =?", [req.body.id], async (err, result) => {
        if (err) {
            res.status(400).send();
        }
    })


    //DESPUES ASIGNAMOS EL ID DE LA CARTA AL USUARIO

    connection.query("UPDATE colecciones SET NUMCROMOS = (NUMCROMOS + ' ' + ? ) WHERE USUARIOEMAIL = ?", [req.body.id, req.body.email], async (er, result) => {
        if (err) {
            res.status(400).send();
        }
    })

})

app.post('/buscarColecciones', function (req, res) {
    //PRIMERO HAY QUE QUITAR UNA UNIDAD A LA CARTA
    connection.query("SELECT COUNT(*) as total FROM COLECCIONES WHERE EMAIL=?", [req.body.id], async (err, result) => {
        if (err) throw err;
        console.log(result);
        console.log(result[0].total);
        res.send(result[0].total);
    })


    //DESPUES ASIGNAMOS EL ID DE LA CARTA AL USUARIO

    connection.query("UPDATE colecciones SET NUMCROMOS = (NUMCROMOS + ' ' + ? ) WHERE USUARIOEMAIL = ?", [req.body.id, req.body.email], async (er, result) => {
        if (err) {
            res.status(400).send();
        }
    })

})

app.get('/getCartasMostrar', function (req, res) {

    connection.query("SELECT * FROM CROMOS", function (err, result) {
        try {
            if (err) throw err;
            if (result.length > 0) {
                let listaCartas = []
                for (let i = 0; i < result.length; i++) {
                    let string = JSON.stringify(result[i])
                    listaCartas.push(JSON.parse(string))

                }
                res.status(200).json(JSON.stringify(listaCartas));

            } else {
                console.log("ERROReeee")
                res.status(42);
            }
        } catch (e) {
            console.log(e)
        }
    });

})


app.get('/getNewCard', function (req, res) {
    connection.query("SELECT * FROM ALBUMES", async function (err, result) {
        try {
            if (err) throw err;
            if (result.length > 0) {
                // let numTotalCAlbum;
                let numRam = Math.floor(Math.random() * (result.length - 0));
                //console.log('set.id:' + result[numRam].ID)
                let response = await pokemon.card.where({ q: 'set.id:' + result[numRam].ID });
                let numTotal = await response.count;
                let listaCartas = []
                let listaId = []
                //console.log(numTotal+"NUMTOTAL");
                for (let i = 0; i < 6; i++) {
                    let id = result[numRam].ID + "-" + Math.floor(Math.random() * (numTotal - 1) + 1).toString();
                    if (listaId.indexOf(id) === -1) {
                        let card = await pokemon.card.find(id);
                        listaCartas.push(card)
                        listaId.push(id);
                    }
                }
                res.status(200).json(JSON.stringify(listaCartas));

            } else {
                console.log("ERROReeee")
                res.status(42);
            }
        } catch (e) {
            console.log(e)
        }
    });
})

function cookie() {
    cookieCreada = true;
}

async function comprobarIdUnico(email) {
    var unico = false;

    await connection.query("SELECT COUNT (*) as total FROM USUARIOS WHERE EMAIL=?", [email], (err, result) => {
        if (err) throw err;
        console.log(result);
        console.log(result[0].total);
        if (result[0].total == 0) {
            unico = true;
        }
    })

    return unico;
}


async function comprobarAlbum(id) {
    var existe = false;

    await connection.query("SELECT COUNT (*) as total FROM ALBUMES WHERE ID=?", [id], (err, result) => {
        if (err) throw err;
        console.log(result);
        console.log(result[0].total);
        if (result[0].total != 0) {
            existe = true;
        }
    })

    return existe;
}

app.post('/login', function (req, res) {
    connection.query("SELECT * FROM USUARIOS WHERE EMAIL= ? and CONTRASENYA = ?", [req.body.email, req.body.password], function (err, result, fields) {
        try {
            if (err) throw err;
            if (result.length != 0) {
                //console.log("Devuelvo true");
                res.status(200).send();
            } else {
                res.status(400).send();
            }
        } catch (e) {
            console.log("ERROR")
        }
    });

});


app.post('/colecciones', function (req, res) {

    connection.query("SELECT * FROM COLECCIONES WHERE USUARIOEMAIL=?", [req.body.email], async (err, result) => {
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        res.send(json);
    })


});

app.post('/actualizarPuntos', function (req, res) {
    connection.query("UPDATE usuarios SET PUNTOS = (PUNTOS - ?) WHERE EMAIL = ?", [req.body.puntos, req.body.email], async (err, result) => {
        if (err) {
            res.status(400).send();
        }
    })
});

app.post('/crearCol', function (req, res) {
    let aux = comprobarAlbum(req.body.id);

    if (aux == false) {
        req.status(300).send();
    } else {
        var query = connection.query('INSERT INTO COLECCIONES(NOMBRE,USUARIOEMAIL,ESTADO) VALUES(?, ?, ?)', [req.body.nombreColeccion, req.body.email, '0'], async (err, result) => {
            if (err) {
                res.status(400).send();
                throw err;
            }
            res.status(200).send();
            //console.log(query);
        })
    }
});

app.post('/registro', function (req, res) {
    console.log(req.body);
    //COMPROBAMOS QUE NO EXISTE UN EMAIL IGUAL
    let aux = comprobarIdUnico(req.body.email);
    //console.log(aux);
    if (aux == false) {
        res.status(300).send();
    } else {
        //GUARDAMOS AL USUARIO EN LA BASE DE DATOS

        var query = connection.query('INSERT INTO USUARIOS(NOMBRE,APELLIDOS,EMAIL,ESADMIN,CONTRASENYA,PUNTOS) VALUES(?, ?, ?, ?, ?,?)', [req.body.name, req.body.apellidos, req.body.email, '0', req.body.contrasenya, '0'], async (err, result) => {
            if (err) {
                res.status(400).send();
                throw err;
            }
            res.status(200).send();
            //console.log(query);
        })
    }

});

app.post('/datos', function (req, res) {

    connection.query("SELECT * FROM USUARIOS WHERE EMAIL=?", [req.body.email], async (err, result) => {
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        //console.log(json[0]);
        res.send(json[0]);
    })


});

function palabraCorrecta(respuesta) {
    var counter = 0;

    for (var i = 0; i < respuesta.length; i++) {
        var r = respuesta[i];

        if (solucion[0][i] == r) {
            counter++;
        }
    }
    return counter;
}

app.post('/preguntas', function (req, res) {
    console.log(req.body);
    const correcta = palabraCorrecta(req.body.respuestas);
    console.log(correcta);
    res.send(JSON.stringify(correcta))
});

app.post('/getCartasUsuario', function (req, res) {
    console.log(req.body.id)
    connection.query("SELECT * FROM ALBUMESUSUARIO WHERE IDCOLECCION =?", [req.body.id], async (err, result) => {
        var string = JSON.stringify(result);
        var json = JSON.parse(string);

        connection.query("SELECT * FROM CROMOSUSUARIO WHERE IDALBUM =?", [json[0].ID], async (err, result) => {
            var string = JSON.stringify(result);
            var json = JSON.parse(string);
            res.send(json);
            })
    })
})

app.post('/actividadesAdmin', function(req, res) {
    console.log(req.body);

    let aux = comprobarExisteColeccion(req.body.nombreCol);
    if (aux == false) {
        res.status(300).send();
    } else {
        var query = connection.query("UPDATE colecciones SET ESTADO = (?) WHERE NOMBRE = ?", [req.body.estado, req.body.nombreCol], async(err, result) => {
            if (err) {
                res.status(400).send();
                throw err;
            }
            res.status(200).send();
        })
    }

});

async function comprobarIdUnico(nombreCol) {
    var unico = false;

    await connection.query("SELECT COUNT (*) as total FROM COLECCIONES WHERE NOMBRE=?", [nombreCol], (err, result) => {
        if (err) throw err;
        console.log(result);
        console.log(result[0].total);
        if (result[0].total != 0) {
            unico = true;
        }
    })

    return unico;
}


connection.end;
app.listen(3000, () => {
    console.log("Server on port 3000");
});