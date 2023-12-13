/*----------------------------- Created by Lui Rabideau, due on 12/15/2023 -----------------------------*/
/* Incorporated into the design from W3schools: W3.CSS 4.15 December 2020 by Jan Egil and Borge Refsnes */
/*--------------------------------------- UHM ITM352 Assignment 3 --------------------------------------*/

/*---------------------------------- GENERAL FUNCTIONS USED EVERWHERE ----------------------------------*/
function faviconInfo(){//contains favicon and css information
    document.write(`
      <link rel="stylesheet" href="./css/home.css">
      <link rel="icon" href="./images/letterR.png" type="image/png">
      <link rel="shortcut icon" href="./images/letterR.png" type="image/png">
    `)
}
function navBar(){// Makes a navbar
    document.write(`
    <div class="w3-top">
    <div class="w3-bar w3-white w3-wide w3-padding w3-card">
     <a href="./index.html" class="w3-bar-item w3-button"><b>Ryer</b> Architects</a>
     <!-- Float links to the right. Hide them on small screens -->
     <div class="w3-right w3-hide-small">
       <a href="./products.html?location=NewYork" class="w3-bar-item w3-button">New York</a>
       <a href="./products.html?location=SanFran" class="w3-bar-item w3-button">San Francisco</a>
       <a href="./products.html?location=Chicago" class="w3-bar-item w3-button">Chicago</a>
       <a href="./team.html" class="w3-bar-item w3-button">Our Team</a>
       <a href="./login.html" class="w3-bar-item w3-button">Login</a>
     </div>
    </div>
   </div>
   `);
}

/*---------------------------------- PRODUCTS PAGE SPECIFIC FUNCTIONS ----------------------------------*/
function productsTable(){// Function that generates the products on the products.html page
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

function productsPageErrors(){// Interprets the errors from the query string and displays them
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
  // calls the checkTextBox function every 1/10 of a second (found in functions)
  // discovered this existed in October from W3 schools ( https://www.w3schools.com/jsref/met_win_setinterval.asp )
  setInterval(checkTextBox, 100);
}

function checkTextBox(){// Used in products.html to display the active errors in the textboxes
    for(let i in products){// the loop is necessary so that all textboxes dont show the same thing
      // getting the value from the textbox
      let textBoxValue = document.getElementById(`textBox${i}`).value;
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

/*---------------------------------- INVOICE PAGE SPECIFIC FUNCTIONS -----------------------------------*/

function generateInvoiceTable(){// The generate item rows function in INVOICE_HTML
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

/*---------------------------------------- TEAM PAGE FUNCTION ------------------------------------------*/
function teamTable(){// Function that generates the professionals information on the our team/about page
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

/*-------------------------------------- OTHER GENERAL FUNCTIONS ---------------------------------------*/
function getCurrentDate() {// Function to get the current date in the format YYYY-MM-DD
    // Function from ChatGPT using the "make me a function that gets todays date using javascript" prompt
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function generateRandomPassword(length){// Generate password function from CHATGPT, used prompt "recommend password function in textbox javascript and html"
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?/{}[]";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }
    return password;
}

function generatePassword(){// Used in conjunction with the function above. This function is called at the click of a button and it takes the value of the generatePassword function and returns it to a specificied elementID
  const passwordField = document.getElementById("password");
  const generatedPassword = generateRandomPassword(10); // Change the length as needed
  passwordField.value = generatedPassword;
}

/*------------------------------------------------------------------------------------------------------*/