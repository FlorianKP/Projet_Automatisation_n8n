import Database from 'better-sqlite3';

const db = new Database('C:\\Users\\Pierr\\Desktop\\Projet-Gy\\n8n-project\\Projet_Automatisation_n8n\\src\\seed\\sqlite.db');
const stmt = db.prepare('SELECT i.id, i.name, i.type, i.quantity FROM ingredient i JOIN Contenant c ON c.id = i.contenant_id WHERE c.name = ? ORDER BY i.name ASC');

const rows = stmt.all('Frigo');
console.log(rows);