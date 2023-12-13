/* Functions File for Lui Rabideau's Assignment 3 */

//tired of changing this in 5 different places
function headDeclarations(){
  document.write(`
    <link rel="stylesheet" href="./css/home.css">
    <link rel="icon" href="./images/letterR.png" type="image/png">
    <link rel="shortcut icon" href="./images/letterR.png" type="image/png">
    <script src="./products.js"></script>
  `)
}

// Define the generate item rows function in INVOICE_HTML
function generateInvoiceTable(){
  // form was submitted so process the invoice
for (let prod_key in shopping_cart) {
  let products = all_products[prod_key];
  for (let i in products) {
    a_qty = shopping_cart[prod_key][`quantity${i}`];
  //creates item rows
      let extended_price = a_qty * products[i].price;
      //checks for quantities = 0
      if(a_qty == 0){
        continue;
      }else{
      // the div class id="pop up" is IR5
        document.write(`
          <tr style="height: 100px;">
            <td><div class="image-container"><img src="${products[i].image}" style="width: 100%; height: 100%;">              
            <div class="popup">${products[i].description}</div></div>
            </td>
            <td>${products[i].brand}</td>
            <td>${a_qty}<div style="color:red;">${errors}</div></td>
            <td>$${products[i].price.toFixed(2)}</td>
            <td>$${extended_price.toFixed(2)}</td>
          </tr>`);
      }
    }    
      // Subtotal calculation takes place after every loop
      subtotal += extended_price;
  };
};

function invoicePersonalization(){
  console.log(user_reg_data[username].name);
  document.write(`
  <p>Hello ${user_reg_data[username].name}</p>
  `);
}

/*    <div class="w3-top">
    <div class="w3-bar w3-white w3-wide w3-padding w3-card">
     <a href="./index.html" class="w3-bar-item w3-button"><b>Ryer</b> Architects</a>
     <!-- Float links to the right. Hide them on small screens -->
     <div class="w3-right w3-hide-small dropdown">Products    
       <a class="dropdown-item" href="./products.html">New York</a>
       <a class="dropdown-item" href="./products.html">San Francisco</a>
       <a class="dropdown-item" href="./products.html">Chicago</a>
      </div>
      <div class="w3-right w3-hide-small">  
       <a href="./about.html" class="w3-bar-item w3-button">Our Team</a>
     </div>
    </div>
   </div>*/
// Makes a navbar so i dont have to code 20 different places
function navBar(){
    //if() {} else {}
    document.write(`
    <div class="w3-top">
    <div class="w3-bar w3-white w3-wide w3-padding w3-card">
     <a href="./index.html" class="w3-bar-item w3-button"><b>Ryer</b> Architects</a>
     <!-- Float links to the right. Hide them on small screens -->
     <div class="w3-right w3-hide-small">
       <a href="./products.html?location=NewYork" class="w3-bar-item w3-button">New York</a>
       <a href="./products.html?location=SanFran" class="w3-bar-item w3-button">San Francisco</a>
       <a href="./products.html?location=Chicago" class="w3-bar-item w3-button">Chicago</a>
       <a href="./about.html" class="w3-bar-item w3-button">Our Team</a>
       <a href="./login.html" class="w3-bar-item w3-button">Login</a>
     </div>
    </div>
   </div>
   `);
}
   /*     
   document.write(`
    <div class="w3-top">
    <div class="w3-bar w3-white w3-wide w3-padding w3-card">
     <a href="./index.html" class="w3-bar-item w3-button"><b>Ryer</b> Architects</a>
     <!-- Float links to the right. Hide them on small screens -->
     <div class="w3-right w3-hide-small">
       <a href="./products.html" class="w3-bar-item w3-button">Projects</a>
       <a href="./about.html" class="w3-bar-item w3-button">Our Team</a>
       <form></form><a href="./login.html" class="w3-bar-item w3-button">Logout</a>
     </div>
    </div>
   </div>
   `); */



// generates the sample products on the home page
function productHome(){
    for (let i in products){
        document.write(`
        <div class="w3-col l3 m6 w3-margin-bottom">
          <div class="w3-display-container">
            <div class="w3-display-topleft w3-black w3-padding">${products[i].date}</div>
            <img src="${products[i].image}" style="width:100%; height: auto; padding: 20px; margin: 10px;">  
          </div>
        </div>`)
    };
}

// Function to get the current date in the format YYYY-MM-DD
// Function from ChatGPT (I assume), type in "make me a function that gets todays date using javascript" and the function will come up
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function that generates the products on the products.html page
// Provides a place for active and normal errors to be featured
function productsTable(){
    for (let i in products){
        document.write(` 
            <div class="product-item">
                <img class="product-image" src="${products[i].image}">
                <div class="product-title">${products[i].brand}</div>
                <div class="product-description">${products[i].description}</div>
                <span class="product-price">$${products[i].price}</span>
                <div class="product-avaliability">Product Avaliability: ${products[i].aval}</div>
                <label id="quantity${i}_label"}">Quantity:</label>
                <div style="color: blue;" id="active_error${i}"></div>
                <input type="text" paceholder="0" id="textBox${i}" name="quantity${i}";"> 
                <label id="quantity${i}_cart_label"}">In cart: </label> 
               <div style="color: red;" id="error_message${i}"></div>
            </div>
        `)
    };
} 

function productsPageErrors(){
  // the following only occurs when the page is loaded (as opposed to the function after this which executes 10 times a sec)
  window.onload=function(){
  // intepretting the information given to us by the server
  let params = (new URL(document.location)).searchParams;
  // if the query string has Input, print the error and change the button
  console.log(`No iNPUT1`);
  if ((params.get(`error`)) === `NoInput`) { 
    console.log(`No iNPUT2`);
    document.getElementById(`leButton`).innerHTML = "No input: select some items to purchase";
  } else {
   for (let i in products) {
    // if the query string has an error values in it, print the error under the input box and then change the button accordingly
    if (params.has(`error_quantity${i}`)) {
      document.getElementById(`error_message${i}`).innerHTML = params.get(`error_quantity${i}`);
      if (params.get(`error_quantity${i}`)===`Not a number!`) { 
      document.getElementById(`leButton`).innerHTML = "Not a number: input a number";
      } else if (params.get(`error_quantity${i}`)===`Negative value!`) { 
      document.getElementById(`leButton`).innerHTML = "Negative value: input a positive value";
      } else if (params.get(`error_quantity${i}`)===`Not an integer!`) { 
      document.getElementById(`leButton`).innerHTML = "Not an integer: input a whole number";
      } else { 
      document.getElementById(`leButton`).innerHTML = "Unavaliable quantity";
      };
    };
   }; 
  }; 
  };
/* ----- IR2 ----- */
// calls the checkTextBox function every 1/10 of a second (found in functions)
// discovered this existed in October from W3 schools ( https://www.w3schools.com/jsref/met_win_setinterval.asp )
setInterval(checkTextBox, 100);
}

// Function that generates the professionals information on the our team/about page
function aboutPage(){
    for (let i in professionals) {
        document.write(`    
          <div class="w3-col l3 m6 w3-margin-bottom">
          <img src="${professionals[i].pfp}" style="width:100%">
          <h3>${professionals[i].name}</h3>
          <p class="w3-opacity">${professionals[i].position}</p>
          <p>${professionals[i].summary}</p>
          </div>
        `)
    };
}

// used in products.html
function checkTextBox() {
  // the loop is necessary so that all textboxes dont show the same thing
  for(let i in products){
    // getting the value from the textbox
    var textBoxValue = document.getElementById(`textBox${i}`).value;
    // if the textboxvalue is 0 or nothing, return empty '', else if return whatever the error is, else return a "you want--"
    if(textBoxValue === '' || textBoxValue == 0){
      document.getElementById(`active_error${i}`).innerHTML = "";
    } else if (Number(textBoxValue) != textBoxValue){
      document.getElementById(`active_error${i}`).innerHTML = "Active Error: Not a number!";
    } else if (textBoxValue < 0) {
      document.getElementById(`active_error${i}`).innerHTML = "Active Error: Negative value!";
    } else if (parseInt(textBoxValue) != textBoxValue) {
      document.getElementById(`active_error${i}`).innerHTML = "Active Error: Not an integer!";
    } else if (Number(textBoxValue) > 0) {
      document.getElementById(`active_error${i}`).innerHTML = `You want: ${textBoxValue}`;
    }
  };
}

// generate password function from CHATGPT
// Used prompt "recommend password function in textbox javascript and html"
function generateRandomPassword(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?/{}[]";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
}

// this function is called at the click of a button and it takes the value of the generatePassword function and returns it to a specificied elementID
function generatePassword() {
  const passwordField = document.getElementById("password");
  const generatedPassword = generateRandomPassword(10); // Change the length as needed
  passwordField.value = generatedPassword;
}

