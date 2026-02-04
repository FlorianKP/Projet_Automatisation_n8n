-- Active: 1770190098723@@127.0.0.1@3306
CREATE TABLE ingredient (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    contenant_id INTEGER,
    FOREIGN KEY (contenant_id) REFERENCES contenants(id)
    quantity INTEGER NOT NULL DEFAULT 0
    
)

CREATE TABLE Contenant (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
) 
