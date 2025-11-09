/**
 * Flipcart Checkout Page JS
 * Dummy checkout with order summary + confirmation
 */

const VIEW_CART_API = "http://localhost/flipcart/backend/cart/view_cart.php";

document.addEventListener("DOMContentLoaded", () => {
  loadSummary();
  document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);
});

async function loadSummary() {
  const customer = JSON.parse(localStorage.getItem("customer") || "null");
  const user_id = customer && customer.id ? customer.id : 999;
  const table = document.getElementById("summaryTable");
  const totalBox = document.getElementById("totalPrice");

  try {
    const res = await fetch(`${VIEW_CART_API}?user_id=${user_id}`);
    const data = await res.json();

    if (!res.ok || !data.success) throw new Error(data.error);
    const cart = data.cart || [];
    if (!cart.length) {
      table.innerHTML = "<tr><td colspan='3'>Your cart is empty.</td></tr>";
      return;
    }

    table.innerHTML = cart
      .map(
        (item) => `
      <tr>
        <td><img src="http://localhost${item.image_url}" width="60"></td>
        <td>${item.name}</td>
        <td>₹${item.subtotal}</td>
      </tr>`
      )
      .join("");

    totalBox.textContent = `₹${data.total.toFixed(2)}`;
  } catch (err) {
    console.error(err);
    table.innerHTML = "<tr><td colspan='3'>Error loading cart.</td></tr>";
  }
}

function placeOrder() {
  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const pincode = document.getElementById("pincode").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !address || !city || !pincode || !phone) {
    alert("Please fill in all address details!");
    return;
  }

  // Dummy confirmation
  alert("✅ Order placed successfully!\nYour order will be delivered soon.");
  window.location.href = "index.html";
}
