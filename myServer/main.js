const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(cors());
let myProduct = [];
let myTempProduct = [];
let myShoppingCart = [];
let myTempShoppingCart = [];

//Returns the full list of elements
app.get('/products', (req, res) => {
    myTempProduct = [];
    const row = fs.readFileSync('products.json');
    myTempProduct = JSON.parse(row);
    res.send(myTempProduct);    
});

//Adds a new element to the list
app.post('/products', (req,res) => {
    let rowData;
    const parameters = req.query;
    if(fs.existsSync('products.json')) {
        myProductNext = {
            id: parameters.id,
            name : parameters.name,
            description : parameters.description,
            price : parameters.price,
            inStock : parameters.inStock
        }
        rowData = fs.readFileSync('products.json');
        myTempProduct = JSON.parse(rowData);
        myTempProduct.push(myProductNext);
        fs.writeFileSync('products.json', JSON.stringify(myTempProduct));
    }else {
        myProduct.push({
            id: parameters.id,
            name : parameters.name,
            description : parameters.description,
            price : parameters.price,
            inStock : parameters.inStock
        });
        fs.writeFileSync('products.json', JSON.stringify(myProduct));
    }
    myProduct = [];
    res.send({message: "Element has been added"})
})

//Delete element from the list
app.delete('/products/:elementId', (req, res) => {
    const elementId = req.params.elementId;
    let rowData;
    myTempProduct = [];
    rowData = fs.readFileSync('products.json');
    myTempProduct = JSON.parse(rowData);

    myTempProduct.splice(elementId, 1);
    fs.writeFileSync('products.json', JSON.stringify(myTempProduct));
    res.send({message: "Element has been deleted"})
})

//Adds an element to the shopping-cart list
let tempId, tempName, tempPrice, howMany = 0;
app.post('/products/shopping-cart/:elementId', (req, res) => {
    const elementId = req.params.elementId;
    let rowData;
    myTempProduct = [];
    const row = fs.readFileSync('products.json');
    myTempProduct = JSON.parse(row);
    tempId = myTempProduct[elementId].id;
    tempName = myTempProduct[elementId].name;
    tempPrice = myTempProduct[elementId].price;

    if(fs.existsSync('shoppingCart.json')) {
        myShoppingCartNext = {
            id: tempId,
            name: tempName,
            price: tempPrice
        }
        rowData = fs.readFileSync('shoppingCart.json');
        myTempShoppingCart = JSON.parse(rowData);
        myTempShoppingCart.push(myShoppingCartNext);
        fs.writeFileSync('shoppingCart.json', JSON.stringify(myTempShoppingCart));
    } else {
        myShoppingCart.push({
            id: tempId,
            name: tempName,
            price: tempPrice
        });
        fs.writeFileSync('shoppingCart.json', JSON.stringify(myShoppingCart));
    }
    res.send({message:" Product added successsfylly"})
})

//Returns the fill list of elements from shopping-cart
app.get('/products/shopping-cart', (req, res) => {
    myTempShoppingCart = [];
    const row = fs.readFileSync('shoppingCart.json');
    myTempShoppingCart = JSON.parse(row);
    res.send(myTempShoppingCart);   
});

//Delete element from the shopping-cart list
app.delete('/products/shopping-cart/:elementId', (req, res) => {
    const elementId = req.params.elementId;
    let rowData;
    myTempShoppingCart = [];
    rowData = fs.readFileSync('shoppingCart.json');
    myTempShoppingCart = JSON.parse(rowData);
    myTempShoppingCart.splice(elementId, 1);
    fs.writeFileSync('shoppingCart.json', JSON.stringify(myTempShoppingCart));
    res.send({message: "Element has been deleted"})
})

app.listen(3000);