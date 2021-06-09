const { router } = require('express')

router.get("/", auth, async function(req, res) {

    let conn = req.getConnection;

    conn.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });

    conn.query(`SELECT * FROM USUARIOS WHERE EMAIL = ${req.user.id}`, async(err, filas) => {

        if (err) return console.error(err.message);
        if (!filas) {
            conn.query(`INSERT INTO usuarios (NOMBRE, APELLIDOS, EMAIL, ESADMIN, CONTRASENYA, PUNTOS) VALUES(?, ?, ?, ?, ?)`, [req.user.name, req.user.secondname, req.user.email, req.user.admin, req.user.points]);
            console.log('USUARIO NUEVO: ' + req.user.name);

        } else {
            console.log('YA ESTA REGISTRADO: ' + req.user.name);
        }
    });
})

module.exports = router;

conn.end();