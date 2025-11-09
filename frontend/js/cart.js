/**
 * Flipcart - Cart Page JS (Final)
 */
const VIEW_CART_API = "http://localhost/flipcart/backend/cart/view_cart.php";

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  document.getElementById("checkoutBtn").addEventListener("click", goToCheckout);
});

async function loadCart() {
  const customer = JSON.parse(localStorage.getItem("customer") || "null");
  const user_id = customer && customer.id ? customer.id : 999;

  const cartContainer = document.getElementById("cartItems");
  const subtotalBox = document.getElementById("subtotal");
  const totalBox = document.getElementById("grandTotal");

  cartContainer.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

  try {
    const res = await fetch(`${VIEW_CART_API}?user_id=${user_id}`);
    const data = await res.json();
    console.log("Cart data:", data);

    if (!res.ok || !data.success) throw new Error(data.error || "Cart fetch failed");

    const cart = data.cart || [];

    if (cart.length === 0) {
      const tableContainer = document.querySelector(".cart-table");
      tableContainer.innerHTML = `
        <div class='empty-cart'>
          <h2>Your cart is empty 🛒</h2>
          <p><a href='index.html' style='color:#2874f0;text-decoration:none;font-weight:500;'>Continue Shopping</a></p>
        </div>`;
      subtotalBox.textContent = "₹0.00";
      totalBox.textContent = "₹0.00";
      return;
    }

    // ✅ Replace loading text with rows
    cartContainer.innerHTML = cart
      .map(
        (item) => `
        <tr>
          <td><img src="http://localhost${item.image_url}" alt="${item.name}" width="60"></td>
          <td>${item.name}</td>
          <td>₹${item.price}</td>
          <td>${item.quantity}</td>
          <td>₹${item.subtotal}</td>
        </tr>`
      )
      .join("");

    subtotalBox.textContent = `₹${data.total.toFixed(2)}`;
    totalBox.textContent = `₹${data.total.toFixed(2)}`;
  } catch (err) {
    console.error("Cart error:", err);
    cartContainer.innerHTML =
      "<tr><td colspan='5'>⚠️ Error loading cart data. Check backend path.</td></tr>";
  }
}

// Proceed to checkout
function goToCheckout() {
  const customer = JSON.parse(localStorage.getItem("customer") || "null");
  if (!customer || !customer.id) {
    alert("Please log in to proceed to checkout!");
    window.location.href = "login.html";
    return;
  }
  window.location.href = "checkout.html";
}
