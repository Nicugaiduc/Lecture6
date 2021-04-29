window.onload = function() {
    showShoppingCartList();
    showGroceryList();
}

//ADD NEW PRODUCT TO GROCERY LIST
const addProduct = async () => {
    const productName = document.querySelector('.product-name');
    const productDescription = document.querySelector('.product-description');
    const productPrice = document.querySelector('.product-price');
    const inStock = document.querySelector('.inStock-btn').checked;
    const id = Date.now();

    if(productName.value === "" || productDescription.value === "" || productPrice.value === "") {
        alert("Complete all the inputs!!!");
        return false;
    }
    let numbers = /^[0-9]+$/;
    if(!productPrice.value.match(numbers)){
        alert("Only numbers in Product Price input");
        return false;
    }


    await fetch(`http://localhost:3000/products?id=${id}&name=${productName.value}&description=${productDescription.value}&price=${productPrice.value}&inStock=${inStock}`, {
        method: 'POST'
    });
    showGroceryList();
    productName.value = '';
    productDescription.value = '';
    productPrice.value = '';
    document.querySelector('.inStock-btn').checked = false;
};

document.querySelector('.addProduct-btn').onclick = addProduct;

//SHOW PRODUCST TO PAGE
let myProducts = [];
const showGroceryList = async () => {
    const rowData = await fetch(`http://localhost:3000/products`);
    myProducts = await rowData.json();
    //console.log(myProducts);
    let newElement = '';

    myProducts.forEach((element, index)=>{
        if(element.inStock === "true") {
            inStock = "In Stock";
            dis = '';
        } else {
            inStock = "Not In Stock";
            dis = 'disabled';
        }
        newElement += `<div class="grocery-item" id="${element.id}">`+
        `<div class="close-btn" onclick="deleteGroceryProduct(${index})">`+
            '<svg height="15px" viewBox="0 0 329.26933 329" width="15px" xmlns="http://www.w3.org/2000/svg"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"/></svg>'+
        '</div>'+
        `<h2 class="title">${element.name}</h2>`+
        `<p class="description">${element.description}</p>`+
        `<p class="price">Price: ${element.price}$</p>`+
        `<p class="stock">${inStock}</p>`+
        `<button class="buy-btn" ${dis} onclick="addProductToShoppingCart(${index})">Buy</button>`+
    '</div>';
    });
    document.getElementById("grocery-list").innerHTML = newElement;
}

//DELETE PRODUCT FROM PAGE
const deleteGroceryProduct = async (id) => {
    await fetch(`http://localhost:3000/products/${id}`, {
        method: 'DELETE'
    });
    showGroceryList();
}

//ADD PRODUCT TO SHOPPING CART
const addProductToShoppingCart = async (id) => {
    await fetch(`http://localhost:3000/products/shopping-cart/${id}`, {
        method: 'POST'
    });
    showShoppingCartList();
}

// SHOW SHOPPING CART
const shoppingCart  = document.querySelector('.shopping-cart-img');
const shoppingCartContainer = document.querySelector('.shopping-cart')
shoppingCart.addEventListener('click', ()=> {
    shoppingCartContainer.classList.toggle('show');
});

//SHOW PRODUCT FROM SHOPPING CART
let myShoppingCartList = [];
const showShoppingCartList = async() => {
    let totalPrice = 0;
    const rowData = await fetch(`http://localhost:3000/products/shopping-cart`);
    myShoppingCartList = await rowData.json();
    console.log(myShoppingCartList);
    let newElement = '';

    myShoppingCartList.forEach((element, index)=>{
        totalPrice += parseInt(element.price);
        newElement += '<div class="shopping-cart-item">'+
        `<h3 class="title">${element.name}</h3>`+
        `<p class="price">Price: ${element.price}$</p>`+
        `<div class="close-btn" onclick = "deleteItemFromShoppingCart(${index})">`+
            '<svg height="15px" viewBox="0 0 329.26933 329" width="15px" xmlns="http://www.w3.org/2000/svg"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"/></svg>'+
        '</div>'+
    '</div>';
    });
    document.getElementById("shopping-cart-container").innerHTML = newElement;
    document.getElementById("total-price").innerHTML = `Total price: ${totalPrice} $`;
}

//DELETE PRODUCT FROM SHOPPING CART
const deleteItemFromShoppingCart = async (id) => {
    await fetch(`http://localhost:3000/products/shopping-cart/${id}`, {
        method: 'DELETE'
    });
    showShoppingCartList();
}