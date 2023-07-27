const {usersTable} = require('../schemas/users');
const {tasksTable} = require('../schemas/tasks');
const {friendsTable} = require('../schemas/friends');
const {poolTable} = require('../schemas/pool')

const BE_PORT = "8080";

const DB_TABLES = {
    user: usersTable.name,
    task: tasksTable.name,
    friend: friendsTable.name,
    pool: poolTable
};

const ERRORS = {
    DB: {"Message" : "Database Error!"},
    SERVER: {"Message" : "Internal Server Error!"},
    TOKEN : {"Message" : "Token not found!"},
    NOT_FOUND: item => {
        return {"Message" : `${item} not found!`};
    },
    AUTH: {"Message" : "Authentication failed!"},
};

const DEFAULT_RESPONSE = {"Message" : "Default Response!"};

module.exports = {BE_PORT, DB_TABLES, ERRORS, DEFAULT_RESPONSE};