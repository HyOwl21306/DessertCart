const cards = document.querySelectorAll('.card-container');
const quantity = document.querySelector('.quantity');
const total = document.getElementById('total');

let cartItems = [];

const cartItemsContainer = document.getElementById('cart-items');

const emptyCart = document.getElementById('empty-cart');
const orderTotal = document.getElementById('order-total');
const carbonNeutral = document.getElementById('carbon-neutral');
const confirmbtn = document.getElementById('confirmbtn');



orderConfirm();


function updateCart() {
    let totalProduct = 0;
    document.querySelectorAll('.count').forEach((span) => {
        totalProduct += parseInt(span.textContent);
    })
    quantity.innerHTML = `Your Cart (${totalProduct})`;

    const hasItem = totalProduct > 0;

    emptyCart.classList.toggle('hidden', hasItem)
    orderTotal.classList.toggle('hidden', !hasItem)
    carbonNeutral.classList.toggle('hidden', !hasItem)
    confirmbtn.classList.toggle('hidden', !hasItem)

    total.innerHTML = `$${calcTotalPrice()}`;
    
}


function renderCart() {
    cartItemsContainer.innerHTML = '';

    cartItems.forEach(item => {

        const totalPrice = (item.quantity*item.price).toFixed(2);

        const itemHTML = `
            <div class="cart-item" data-name="${item.name}">
                <div class="mt-5 flex justify-between items-center">
                    <p class="font-semibold mb-2">${item.name}</p>
                    <button class="remove-btn hover:cursor-pointer">
                        <img class="delete" src="/images/icon-remove-item.svg">
                    </button>
                </div>
                <div class="flex mb-5">
                    <p class="cost">${item.quantity}x</p>
                    <p class="text-rezo-300 mx-3">@$${item.price.toFixed(2)}</p>
                    <p class="singleCost">$${totalPrice}</p>
                </div>  
                <hr class="text-rezo-100">
            </div>
            `;

        cartItemsContainer.insertAdjacentHTML("beforeend", itemHTML);

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
            const itemName = e.target.closest('.cart-item').dataset.name;

            cartItems = cartItems.filter(item => item.name !== itemName);

            const productCard = document.querySelector(`.card-container[data-name="${itemName}"`);
            if (productCard) {
                const countSpan = productCard.querySelector('.count');
                countSpan.textContent = '0';

                const btnCount = productCard.querySelector('.btn-counter');
                const productImg = productCard.querySelector('.product');
                btnCount.classList.add('hidden');
                productImg.classList.remove('border-redstyle', 'border-3');
            }

            renderCart();
            updateCart();

            });
        });
    });
}



cards.forEach(card => {
    const btn = card.querySelector(".btn");
    const btnCount = card.querySelector(".btn-counter");
    const countSpan = card.querySelector(".count")
    const product = card.querySelector(".product");

    const name = card.querySelector('.name').textContent;
    const price = card.querySelector('.cost').textContent;

    let count=0;

    btn.addEventListener('click', () => {
        count = 1;
        btnCount.classList.remove('hidden')
        product.classList.add('border-redstyle', 'border-3')
        countSpan.textContent = count;
        updateCardDisplay();
        addToCart(name, count, price);
        updateCart();
    })

    card.querySelector('.increase').addEventListener('click', () => {
        count++;
        countSpan.innerHTML = count;
        updateCardDisplay;
        addToCart(name, count, price);
        updateCart();
    })

    card.querySelector('.decrease').addEventListener('click', (e) => {
        if (count>0) count--;
        countSpan.innerHTML = count;
        updateCardDisplay();
        addToCart(name, count, price);

        const itemName = e.target.closest('.card-container').dataset.name;

        const cartItem = document.querySelector(`.cart-item[data-name="${itemName}"]`);
        if (cartItem&&countSpan.textContent==0) {
            cartItem.remove();
            cartItems = cartItems.filter(item => item.name != itemName);
        }
        updateCart();
    })

    function updateCardDisplay() {
        if (count==0) {
            btnCount.classList.add('hidden');
            product.classList.remove('border-redstyle', 'border-3');
            count=1;
            countSpan.innerHTML = 0;

        }
    }
});


function addToCart(name, quantity, price) {

    const priceValue = parseFloat(price.slice(1));
    const existingItemIndex = cartItems.findIndex(item => item.name == name);

    if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity = parseInt(quantity);
    } else {
        cartItems.push({
            name: name,
            quantity: parseInt(quantity),
            price: priceValue
        })
    }

    renderCart();
}

function calcTotalPrice() {
    let result = 0;
    document.querySelectorAll('.singleCost').forEach((item) => {
        result += parseFloat(item.textContent.slice(1));
    })
    return result.toFixed(2);
}

const modelOverlay =  document.querySelector('.overlay');
const bodyModel = document.getElementById('bodyModel');
const orderModel = document.getElementById('order-in-model');

function orderConfirm() {
    confirmbtn.addEventListener('click', () => {
        modelOverlay.classList.remove('hidden');
        renderModel();
        resetPage();
    })
    
}

function resetPage() {
    // cartItems = [];
    document.querySelectorAll('.count').forEach(span => {
        span.textContent = '0';
    })
    cartItemsContainer.innerHTML = '';
    updateCart();
    cards.forEach(card => {
        card.querySelector(".btn-counter").classList.add('hidden');
        card.querySelector(".product").classList.remove('border-redstyle', 'border-3');
    })
}

document.querySelector('.startBtn').addEventListener('click', ()=> {
    modelOverlay.classList.add('hidden');
    bodyModel.innerHTML = '';
})

function renderModel() {

    cartItems.forEach(item => {
        let linkimg = item.name.replaceAll(' ', '-');

        const innerModel = `
        <div class="flex items-center py-4 px-4 lg:px-8">
        <img class="size-13 rounded-sm me-5" src="/images/img-thumbnail/${linkimg}.jpg">

        <div class="w-full">
            <p class="font-semibold text-rezo-900 mb-1 lg:mb-3">${item.name}</p>
            <p class="cost me-3 w-fit inline text-sm">${item.quantity}x</p>
            <p class="text-rezo-300 inline text-sm font-medium">@$${item.price.toFixed(2)}</p>
        </div>
        <div class="">
            <p class="text-rezo-500 font-bold">$${(item.quantity*item.price).toFixed(2)}</p>
        </div>  

        </div>
        <hr class="text-rezo-100 mx-3">
        `
        bodyModel.insertAdjacentHTML('beforeend', innerModel);
    })

    orderModel.innerHTML = `$${calcTotalPrice()}`;

    cartItems = [];
}
