/*----------------------------- Created by Lui Rabideau, due on 12/15/2023 -----------------------------*/
/* Incorporated into the design from W3schools: W3.CSS 4.15 December 2020 by Jan Egil and Borge Refsnes */
/*--------------------------------------- UHM ITM352 Assignment 3 --------------------------------------*/

const { error } = require('console');
const express = require('express');
const app = express();
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const session = require('express-session');
app.use(session({secret: "MySecretKey", resave: true, saveUninitialized: true}));

let userLoggedin = {};

const fs = require('fs');
const { type } = require('os');
let user_reg_data = {};
let user_data_filename = __dirname + '/user_data.json';
// if the user data file exists, read it and parse it
if (fs.existsSync(user_data_filename)){
    // get the filesize and print it out
    console.log(`${user_data_filename} has ${fs.statSync(user_data_filename).size} characters.`);
    // let user_reg_data = require('./user_data.json');
    let user_reg_data_JSON = fs.readFileSync(user_data_filename, 'utf-8');
    user_reg_data = JSON.parse(user_reg_data_JSON);
} else {
    console.log(`Error! ${user_data_filename} does not exist!`);
}

app.use(express.urlencoded({ extended: true })); // express decodes URL encoded data in the body
// ---------------- General Routing Begin --------------- //
// monitor all requests
app.all('*', function (request, response, next){
   console.log(request.method + ' to ' + request.path);
      // gives the user a cart if the user does not have one
      if (typeof request.session.cart == 'undefined'){
        request.session.cart = {};
        for(let prod_key in all_products){
           request.session.cart[prod_key] = {};
           for (let i in all_products[prod_key]){
              request.session.cart[prod_key]['quantity'+i] = 0;
           }
        }
     }
   next();
});

// process a route for the products.json stuff
const all_products = require(__dirname + "/products.json");
// making a products array within the server
app.get('/products.js', function(request, response, next){
   // the response will be js
   response.type('.js');
   // turning stuff into a string
   let products_str = `let all_products = ${JSON.stringify(all_products)}`;
   // sends the string
   response.send(products_str);
});

// process a route for the professionals.json stuff
professionals = require(__dirname + "/professionals.json");
// making a professionals array within the server
app.get('/professionals.js', function(request, response, next){
   // the response will be js
   response.type('.js');
   // turning stuff into a string
   let professionals_str = `let professionals = ${JSON.stringify(professionals)}`;
   // sends the string
   response.send(professionals_str);
});

// making a userInfo array within the server
app.get('/userLoggedin.js', function(request, response, next){
    // the response will be js
    response.type('.js');
    // turning stuff into a string
    let userLoggedin_str = `let userLoggedin = ${JSON.stringify(userLoggedin)}`;
    // sends the string
    response.send(userLoggedin_str);
 });

// sending back the cart 
app.post('/get_cart', function(request, response, next){
    // the response will be json
    response.type('json');
    // turning the cart into a JSON string and sending it
    response.send(JSON.stringify(request.session.cart));
 });
// ----------------- General Routing End ---------------- //

// --- Route all other GET requests to files in public -- //
app.use(express.static(__dirname + '/public'));
// start server
app.listen(8080, () => console.log(`listening on port 8080`));
// ------------------------------------------------------ //

// ----------------- Functions Begin -------------------- //
function validateQuantities(quantities, returnErrors){// the isNonNegInt function with name changes
    // assume no errors at first
    errors = [];
    if(quantities === ''){
       quantities = 0;
    };
    // Check if string is a number value
    if(Number(quantities) != quantities){ 
       errors.push('Not a number!');};
    // Check if it is non-negative
    if(quantities < 0){ 
       errors.push('Negative value!');}; 
    // Check that it is an integer
    if(parseInt(quantities) != quantities){ 
       errors.push('Not an integer!');}; 
    // if true will return errors, if not returns nothing
    return returnErrors ? errors : (errors.length == 0);
};

// ----------------- Functions End ---------------------- //

// --------------- Specific Routing Begin --------------- //
app.post('/login', function (request, response){
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    let the_username = request.body.username.toLowerCase();
    let the_password = request.body.password;
    // check if username is in user_data
    console.log(`${qs}`);
    console.log(`${the_username} is working`);
    if(typeof user_reg_data[the_username] !== 'undefined'){
       // check if the password matches the password in user_reg_data
       if(user_reg_data[the_username].password === the_password){
          console.log(`${the_username} is logged in!`);
          // send a username cookie to indicate logged in
          response.cookie("username", the_username, {expire: Date.now() + 5*1000});
          console.log(`1 ===== ${qs}`);
          if(qs == 'undefined'){
             userLoggedin[the_username] = true;
             response.redirect('./products.html')
          } else {
             //remove quantities from products.aval
             /*for(let i in products){
                if(qs.has(`quantity${i}`)){
                      qs4 = qs.get(`quantity${i}`);
                      products[i].aval -= qs4;
                };
             };*/
             // add new logged in user
             userLoggedin[the_username] = true;
             response.redirect(`./invoice.html?${qs}&email=${the_username}&name=${user_reg_data[the_username].name}&numUsersLoggin=${Object.entries(userLoggedin).length}`);
          }
       } else {
          response.redirect(`./login.html`)
       }
    } else { // else the user does not exist 
       response.send(`${the_username} does not exist! /login`);
    }
});

app.post('/register', function (request, response){
    // process a simple register form
    //make a new user
    let username = request.body.username.toLowerCase();
    user_reg_data[username] = {};
    user_reg_data[username].password = request.body.password;
    user_reg_data[username].username = request.body.username;  
    // add it to the user_data.json
    fs.writeFileSync(user_data_filename, JSON.stringify(user_reg_data));
    if(typeof user_reg_data[username] !== 'undefined' && typeof user_reg_data[username].password !== 'undefined' && typeof user_reg_data[username].username !== 'undefined'){
       //remove quantities from products.aval
       /*for(let i in products){
          if(qs.has(`quantity${i}`)){
             qs4 = qs.get(`quantity${i}`);
             products[i].aval -= qs4;
          };
       };*/
       // add new logged in user, place above the redirect
       userLoggedin[username] = true; 
       response.redirect(`./invoice.html?${qs}&email=${username}&name=${user_reg_data[username].name}&numUsersLoggin=${Object.entries(userLoggedin).length}`);   
    } else {
       response.redirect(`./register.html`)
    }
});

app.post("/get_cart", function (request, response){
    response.json(request.session.cart);
});    

// ----------------- Sepcific Routing End --------------- //