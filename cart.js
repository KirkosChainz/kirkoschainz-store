const container = document.getElementById("products-container");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");

let cart = [];

// Render products
products.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>Price: $${product.price}</p>
        <button data-index="${index}" class="add-to-cart">Add to Cart</button>
    `;
    container.appendChild(card);
});

// Add to cart
container.addEventListener("click", e => {
    if (e.target.classList.contains("add-to-cart")) {
        const index = e.target.dataset.index;
        addToCart(products[index]);
    }
});

function addToCart(product) {
    cart.push(product);
    renderCart();
}

// Render cart
function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, idx) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - $${item.price}`;
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.dataset.index = idx;
        removeBtn.addEventListener("click", () => removeFromCart(idx));
        li.appendChild(removeBtn);
        cartItemsContainer.appendChild(li);
        total += item.price;
    });

    cartTotalEl.textContent = total;
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

// Checkout
checkoutButton.addEventListener("click", async () => {
    if (cart.length === 0) return alert("Your cart is empty!");

    const response = await fetch("https://your-netlify-site.netlify.app/.netlify/functions/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart })
    });

    const data = await response.json();
    window.location.href = data.url;
});
