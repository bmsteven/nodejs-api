const express = require( "express" )
const path = require( "path" )
const bodyParser = require( "body-parser" )
const app = express()
const mysql = require( "mysql" )

app.use( bodyParser.json() )

let db = mysql.createConnection( {
    host: "localhost",
    user: "root",
    password: "thomst5v5nson",
    database: "commerce"
} )

db.connect( err => {
    if ( err ) throw err
    console.log( "Database connected" )
} )

app.get( "/", ( req, res ) => {
    res.sendFile( path.join( __dirname, "views", "index.html" ) )
} )

app.get( "/create-database", ( req, res ) => {
    let sql = "create database commerce"

    db.query( sql, ( err, results ) => {
        if ( err ) throw err
        if ( results ) {
            res.json( { results } )
        } else {
            res.json( { msg: "Internal server error" } )
        }
    } )
} )

app.get( "/create-users-table", ( req, res ) => {
    let sql = "create table users(id int auto_increment Primary key, name varchar(255), email varchar(255), password varchar(255), createdAt varchar(255) )"
    db.query( sql, ( err, results ) => {
        if ( err ) throw err
        if ( results ) {
            res.json( { results } )
        } else {
            res.json( { msg: "Internal server error" } )
        }
    } )
} )

app.post( "/register", async ( req, res ) => {
    // const { name, email, password } = req.body
    let name = req.body.name
    let email = req.body.email
    let password = req.body.password
    let createdAt = new Date()
    let emailCheck = `select email from users where email = '${email}'`
    let sql = `insert into users values(id,?,?,?,?)`
    db.query( emailCheck, ( err, results ) => {
        if ( err ) throw err
        if ( results && results.length > 0 ) {
            res.json( { msg: "Email is in use" } )
        } else if ( results && results.length === 0 ) {
            db.query( sql, [name, email, password, createdAt], ( err, results ) => {
                if ( err ) throw err
                if ( results ) {
                    res.json( { results, msg: "Registered successfully" } )
                } else {
                    res.json( { msg: "Internal server error" } )
                }
            } )
        } else {
            res.json( { msg: "Internal server error" } )
        }
    } )
} )

let PORT = 5000

app.listen( PORT, ( err ) => {
    if ( err ) {
        console.log( err )
    } else {
        console.log( `Server running on port ${PORT}` )
    }
} )