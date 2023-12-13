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

// process a route for invoice


// process a route for the products.json stuff
const all_products = require(__dirname + "/products.json");
app.get('/products.js', function(request, response, next){// making a products array within the server
   // the response will be js
   response.type('.js');
   // turning stuff into a string
   let products_str = `let all_products = ${JSON.stringify(all_products)}`;
   // sends the string
   response.send(products_str);
});

// process a route for the professionals.json stuff
professionals = require(__dirname + "/professionals.json");
app.get('/professionals.js', function(request, response, next){// making a professionals array within the server
   // the response will be js
   response.type('.js');
   // turning stuff into a string
   let professionals_str = `let professionals = ${JSON.stringify(professionals)}`;
   // sends the string
   response.send(professionals_str);
});

app.get('/userLoggedin.js', function(request, response, next){// making a userInfo array within the server
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

// --- Route all other requests to files in public -- //
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

app.post('/add_to_cart', function (request, response, next){// process purchase request (validate quantities, check quantity available)
   // determining what location the data was from
   let prod_key = request.body['location'];
   let products = all_products[prod_key];
   // getting and validating the quantity data
   let noInput = 0; // defined a variable to keep track of how many products have 0 or empty quanities
   let errors = {}; // assume no errors to begin with
   for (let i in products){ 
      let q = request.body[`quantity${i}`];
      // validate the quantities
      if (validateQuantities(q, false) == false){
         errors[`error_quantity${i}`] = validateQuantities(q, true);
      }
      // Check if there is enough avaliable, if not send error
      if(q > products[i].aval){
         errors[`error_quantity${i}`] = `There are not ${q} avaliable.`
      }
      // did the user select any item
      if((request.body[`quantity${i}`]) == 0 || (request.body[`quantity${i}`]) === ''){
         // if the quantity is 0 or empty, adds 1 to the noInput variable
         noInput++;
      } 
   };
   // this checks if all the product quantities were either 0 or empty
   if(noInput == products.length){
      //sends the error back to the page
         response.redirect(`./products.html?${prod_key}&error=NoInput`);
   }else{
      // if valid, send info to invoice
      qs = querystring.stringify(request.body);
      if (Object.entries(errors).length === 0) {
         // add purchases to session cart
         if(typeof request.session.cart[prod_key] === 'undefined'){
            request.session.cart[prod_key] = {};
         }
         for (let i in products) {
            if (typeof request.session.cart[prod_key][`quantity${i}`] != 'undefined') {
               request.session.cart[prod_key][`quantity${i}`] = 0;
            }
            request.session.cart[prod_key][`quantity${i}`] += Number(request.body[`quantity${i}`]);
         }
         // sending to invoice
         response.redirect(`./products.html?location=${prod_key}`)
      }
      // if invalid, redisplay products but with errors
      else{ 
         response.redirect(`./products.html?location=${prod_key}&${querystring.stringify(errors)}`);
         
      }
   }
});

app.post('/login', function (request, response){// Validates a users login, and redirects page to the page if invalid and to cart if valid
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    let the_username = request.body.username.toLowerCase();
    let the_password = request.body.password;
    if(typeof user_reg_data[the_username] !== 'undefined'){// check if username is in user_data
       if(user_reg_data[the_username].password === the_password){// check if the password matches the password in user_reg_data
          console.log(`${the_username} is logged in!`);
          response.cookie("username", the_username, {expire: Date.now() + 5*1000});// send a username cookie to indicate logged in
          response.cookie("name", user_reg_data[the_username].name, {expire: Date.now() + 5*1000});// make a name cookie
          response.cookie("loggedIn", X, {expire: Date.now() + 5*1000});// make a logged in cookie
          userLoggedin[the_username] = true;
          response.redirect(`./shoppingCart.html`);
       } else {
          response.redirect(`./login.html?passwordError`)
       }
    } else { // else the user does not exist 
       response.send(`/login.html?${the_username}Error`);
    }
});

app.post('/register', function (request, response){// Makes a new user while validating that info, then sends the new user to the shopping cart
    let username = request.body.username.toLowerCase();
    user_reg_data[username] = {};
    user_reg_data[username].password = request.body.password;
    user_reg_data[username].username = request.body.username;  
    // add it to the user_data.json
    fs.writeFileSync(user_data_filename, JSON.stringify(user_reg_data));
    if(typeof user_reg_data[username] !== 'undefined' && typeof user_reg_data[username].password !== 'undefined' && typeof user_reg_data[username].username !== 'undefined'){
       // add new logged in user, place above the redirect
       userLoggedin[username] = true; 
       response.redirect(`./shoppingCart.html`);   
    } else {
       response.redirect(`./register.html`)
    }
});

app.post("/get_cart", function (request, response){
    response.json(request.session.cart);
});    

app.post('/processToInvoice', function (request, response){// Validates that at least 1 item is being bought, and then sends user to the invoice page
   let neededCookie = getCookie("loggedIn");
   if(!checkCookie(neededCookie)){
      response.redirect(`./login.html`);
   }else{
      response.cookie("cfsc", 1, {expire: Date.now() + 5*1000});// make a came-from-shopping-cart cookie
      response.redirect(`./invoice.html`);
   };
});

app.get('/finalizePurchase', function (request, response){// Sends the email and then sends user to the thank you page
   response.cookie("invoice", 1, {expire: Date.now() + 5*1000});// make a came from invoice cookie
   response.redirect(`./thankYou.html`);
});

app.get('/logout', function(request, response){
   document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
   response.redirect(back);
});
// ----------------- Sepcific Routing End --------------- //
// ---------------- Cookie Functions Begin -------------- //

function setCookie(name, value, daysToLive){// Function to set a cookie
    var expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysToLive);
    var cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expirationDate.toUTCString() + "; path=/";
    document.cookie = cookie;
}
// Example: Set a cookie named "username" with the value "John Doe" that expires in 7 days
// setCookie("username", "John Doe", 7);

function getCookie(name){// Function to get the value of a cookie by name
    let cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(name + "=") === 0) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
}

function checkCookie(cookieName) {// Function to check if a cookie exists
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.indexOf(cookieName + "=") === 0) {
          return true; // Cookie found
      }
  }
  return false; // Cookie not found
}

// Example: Get the value of the "username" cookie
//var username = getCookie("username");
//console.log("Username: " + username);

// ----------------- Cookie Functions End --------------- //