import pg from 'pg';

const checkUserQuery = `SELECT * FROM users WHERE username = $1 AND password = $2`;
const findOneUserQuery = `SELECT * FROM users WHERE username = $1`;
const searchItemQuery = `SELECT * FROM items WHERE name = $1`;
const getAllItemQuery = `SELECT * FROM items`;
const addItemQuery = `INSERT INTO items (name, count, type, date) VALUES ($1, $2, $3, $4)`;
const changeItemQuery = `UPDATE items SET count = $1 WHERE name = $2`;
const getAllCategoryQuery = `SELECT name FROM categories ORDER BY count DESC`;
const changeCategoryCountQuery = `UPDATE categories SET count = $1 WHERE name = $2`;
const getCategoryQuery = `SELECT * FROM categories WHERE name = $1`;
const deleteItemQuery = `DELETE FROM items WHERE name = $1`;
const addCategoryQuery = `INSERT INTO categories (name, count) VALUES ($1, 0)`;

const createCategoryTableQuery = `CREATE TABLE IF NOT EXISTS categories (
    name VARCHAR(255) PRIMARY KEY,
    count INT
);`;

const createItemTableQuery = `CREATE TABLE IF NOT EXISTS items (
    name VARCHAR(255) PRIMARY KEY,
    count INT,
    type VARCHAR(255),
    date TIMESTAMP
);`;

const createUsersTableQuery = `CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255)
);`;


class DatabaseManager {
    static instance;

    constructor(){
        this.DBpool = null;
    }

    static getInstance(){
        if(!DatabaseManager.instance){
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }

    static createDBPool(host, port, name){
        const pool = new pg.Pool({
            host,
            port,
            database: name,
            user: process.env.POSTGRES_DB_USER,
            password: process.env.POSTGRES_DB_PASSWORD,
        });
        return pool;
    }

    async configureDB(host, port, name){
        this.DBpool = DatabaseManager.createDBPool(host, port, name);
    }

    initModels(){
        this.DBpool.query(createCategoryTableQuery, (err, res) => {
            if(err){
                console.log(`Error creating categories table: ${err}`);
            }
            else{
                console.log(`Created categories table`);
            }
        });
        this.DBpool.query(createItemTableQuery, (err, res) => {
            if(err){
                console.log(`Error creating items table: ${err}`);
            }
            else{
                console.log(`Created items table`);
            }
        });
        this.DBpool.query(createUsersTableQuery, (err, res) => {
            if(err){
                console.log(`Error creating users table: ${err}`);
            }
            else{
                console.log(`Created users table`);
            }
        });
    }

    async checkUser(username, password){
        return this.DBpool.
            query(checkUserQuery, [username, password])
            .then((queryResponse) => {
                return queryResponse.rows;
            });
    }

    async findOneUser(username){
        return this.DBpool.
            query(findOneUserQuery, [username])
            .then((queryResponse) => {
                return queryResponse.rows;
            });
    }

    async getAllItems(){
        return this.DBpool.query(getAllItemQuery)
            .then((queryResponse) => {
                return queryResponse.rows;
            });
    }

    async addItem(name, count, type, date){
        return this.DBpool.query(addItemQuery, [name, count, type, date])
            .then((queryResponse) => {
                return queryResponse.rows;
            });
    }

    async deleteItem(name){
        return this.DBpool.query(deleteItemQuery, [name])
            .then((queryResponse) => {
                return queryResponse.rows;
            });
    }

    async changeItem(name, count){
        return this.DBpool.query(changeItemQuery, [count, name])
            .then((queryResponse) => {
                return queryResponse.rows;
            });
    }
    async searchItem(name){
        return this.DBpool.query(searchItemQuery, [name])
            .then((queryResponse) => {
                return queryResponse.rows;
            });
    }
    async getAllCategories(){
        return this.DBpool.query(getAllCategoryQuery)
            .then((queryResponse) => {
                return queryResponse.rows;
            });
    }

    async getCategory(name){
        return this.DBpool.query(getCategoryQuery, [name])
            .then((queryResponse) => {
                return queryResponse.rows;
            });
    }

    async addCategory(name){
        return this.DBpool.query(addCategoryQuery, [name])
            .then((queryResponse) => {
                return queryResponse.rows;
            });
    }

    async changeCategoryCount(name, count){
        return this.DBpool.query(changeCategoryCountQuery, [count, name])
            .then((queryResponse) => {
                return queryResponse.rows;
            });
    };
}

export default DatabaseManager;