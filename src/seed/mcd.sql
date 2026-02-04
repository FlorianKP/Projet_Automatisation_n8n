-- Active: 1770194470499@@127.0.0.1@3306
CREATE TABLE ingredient (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    contenant_id INTEGER,
    FOREIGN KEY (contenant_id) REFERENCES Contenant(id)
);

CREATE TABLE Contenant (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
) ;

INSERT INTO Contenant (name) VALUES ('Frigo');
INSERT INTO Contenant (name) VALUES ('Placard');


INSERT INTO ingredient (name, type, quantity, contenant_id) VALUES ('Tomate', 'Legume', 5, 1);
INSERT INTO ingredient (name, type, quantity, contenant_id) VALUES ('Pates', 'Feculent', 2, 2);