CREATE DATABASE cromos;
USE cromos;

CREATE TABLE USUARIOS(
    NOMBRE VARCHAR(70) NOT NULL,
    APELLIDOS VARCHAR(140) NOT NULL,
    EMAIL VARCHAR(150) NOT NULL,
    ESADMIN int default 0, /*Por defecto null*/
    CONTRASENYA VARCHAR(140) NOT NULL,
    PUNTOS NUMERIC NOT NULL,
    
	PRIMARY KEY (EMAIL)
);

CREATE TABLE COLECCIONES(
    NOMBRE VARCHAR(70) NOT NULL,
    ESTADO NUMERIC NOT NULL,
    VALIDEZ NUMERIC NOT NULL,
    NUMCROMOS NUMERIC NOT NULL,
    USUARIOEMAIL VARCHAR(70) NOT NULL,

	PRIMARY KEY (NOMBRE),
    CONSTRAINT FK_EMAILUSUARIO FOREIGN KEY(USUARIOEMAIL) REFERENCES USUARIOS(EMAIL)

);

CREATE TABLE ALBUMES(
    NOMBRE VARCHAR(70) NOT NULL,
    PRECIO NUMERIC NOT NULL,
    NOMBRECOLECCION VARCHAR(70) NOT NULL,
	PRIMARY KEY (NOMBRE),
    CONSTRAINT FK_NOMBRECOLECCION FOREIGN KEY (NOMBRECOLECCION) REFERENCES COLECCIONES(NOMBRE)
    
);

CREATE TABLE CROMOS(
    NOMBRE VARCHAR(70) NOT NULL,
    PRECIO NUMERIC NOT NULL,
    IMAGEN MEDIUMBLOB NOT NULL,
    NOMBRECOLECCION VARCHAR(70) NOT NULL,
    NOMBREALBUM VARCHAR(70) NOT NULL,
	PRIMARY KEY (NOMBRE),
    CONSTRAINT FK_NOMBRECOLECCION2cromosalbumes FOREIGN KEY (NOMBRECOLECCION) REFERENCES COLECCIONES(NOMBRE),
    CONSTRAINT FK_NOMBREALBUM FOREIGN KEY (NOMBREALBUM) REFERENCES ALBUMES(NOMBRE)

);

INSERT INTO USUARIOS(NOMBRE,APELLIDOS,EMAIL,ESADMIN,CONTRASENYA,PUNTOS) VALUES('PEPE','PANTANOS','pepepantanos@gmail.com','1','pepe123','0');




