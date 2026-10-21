/* =========================================================
   MenuKita - script.js
   Fitur: katalog, pencarian, keranjang, nomor meja, konfirmasi,
   nomor antrean, dan estimasi waktu tunggu.

   Penting: seluruh data masih berada di browser (front-end demo).
   Belum ada database/server yang membagikan pesanan ke dapur.
   ========================================================= */

// 1. DATA MENU DEMO
// Tambahkan menu baru dengan menyalin salah satu objek dan mengganti nilainya.
// price harus berupa angka, available: false berarti menu sedang habis.
const menus = [
  {
    id: 1,
    name: "Kopi Susu Gula Aren",
    price: 22000,
    category: "Kopi",
    description: "Espresso, susu segar, dan manis gula aren yang seimbang.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80",
    available: true,
    tag: "Favorit"
  },
  {
    id: 2,
    name: "Cappuccino",
    price: 24000,
    category: "Kopi",
    description: "Espresso dengan susu steamed dan lapisan foam yang lembut.",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=80",
    available: true,
    tag: "Klasik"
  },
  {
    id: 3,
    name: "Matcha Latte",
    price: 26000,
    category: "Non-Kopi",
    description: "Matcha dengan susu creamy untuk rasa yang lembut dan khas.",
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=80",
    available: true,
    tag: "Pilihan baru"
  },
  {
    id: 4,
    name: "Es Cokelat",
    price: 23000,
    category: "Non-Kopi",
    description: "Minuman cokelat dingin dengan rasa cokelat yang kaya.",
    image: "https://images.unsplash.com/photo-1542990253-0b8be7ec7c5f?auto=format&fit=crop&w=900&q=80",
    available: true,
    tag: "Manis"
  },
  {
    id: 5,
    name: "Nasi Goreng Kampung",
    price: 28000,
    category: "Makanan",
    description: "Nasi goreng gurih dengan telur dan pelengkap sederhana.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80",
    available: true,
    tag: "Mengenyangkan"
  },
  {
    id: 6,
    name: "Chicken Rice Bowl",
    price: 32000,
    category: "Makanan",
    description: "Nasi hangat dengan ayam berbumbu dan saus pilihan.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
    available: false,
    tag: "Segera hadir"
  },
  {
    id: 7,
    name: "Kentang Goreng",
    price: 18000,
    category: "Camilan",
    description: "Kentang goreng renyah, cocok untuk teman ngobrol.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80",
    available: true,
    tag: "Camilan"
  },
  {
    id: 8,
    name: "Croissant Butter",
    price: 21000,
    category: "Camilan",
    description: "Pastry berlapis yang renyah di luar dan lembut di dalam.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80",
    available: true,
    tag: "Fresh baked"
  },
  {
    id: 9,
    name: "Lemon Tea",
    price: 17000,
    category: "Non-Kopi",
    description: "Teh segar dengan sentuhan lemon yang ringan.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80",
    available: true,
    tag: "Segar"
  }
];

// 2. REFERENSI ELEMEN HTML
// querySelector mencari elemen berdasarkan id atau selector CSS.
const menuGrid = document.querySelector("#menu-grid");
const categoryList = document.querySelector("#category-list");
const searchInput = document.querySelector("#search-input");
const menuCount = document.querySelector("#menu-count");
const emptyState = document.querySelector("#empty-state");
const currentYear = document.querySelector("#current-year");

const headerCartCount = document.querySelector("#header-cart-count");
const cartItemsCount = document.querySelector("#cart-items-count");
const cartItemsContainer = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const clearCartButton = document.querySelector("#clear-cart-button");
const tableNumberInput = document.querySelector("#table-number");
const summaryQuantity = document.querySelector("#summary-quantity");
const summaryTotal = document.querySelector("#summary-total");
const confirmOrderButton = document.querySelector("#confirm-order-button");

const confirmationDialog = document.querySelector("#confirmation-dialog");
const closeDialogButton = document.querySelector("#close-dialog-button");
const finishOrderButton = document.querySelector("#finish-order-button");
const queueNumberElement = document.querySelector("#queue-number");
const queueTableElement = document.querySelector("#queue-table");
const waitTimeElement = document.querySelector("#wait-time");
const confirmedOrderList = document.querySelector("#confirmed-order-list");
const confirmedTotal = document.querySelector("#confirmed-total");
const toast = document.querySelector("#toast");

// 3. STATE SEMENTARA
// activeCategory menyimpan kategori filter yang dipilih.
// cart adalah array item yang saat ini berada di keranjang.
let activeCategory = "Semua";
let cart = [];
let nextQueueNumber = 1;
let toastTimeout;

// 4. FORMAT HARGA KE RUPIAH.
function formatRupiah(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(price);
}

// 5. TAMPILKAN PESAN KECIL, MISALNYA "MENU DITAMBAHKAN".
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  // Hentikan timeout sebelumnya agar pesan baru tidak tertutup terlalu cepat.
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

// 6. RENDER TOMBOL KATEGORI BERDASARKAN DATA MENU.
function renderCategories() {
  const uniqueCategories = [...new Set(menus.map((menu) => menu.category))];
  const categories = ["Semua", ...uniqueCategories];

  categoryList.innerHTML = categories.map((category) => {
    const isActive = category === activeCategory;
    return `
      <button
        class="category-button ${isActive ? "active" : ""}"
        type="button"
        data-category="${category}"
        aria-pressed="${isActive}"
      >${category}</button>
    `;
  }).join("");
}

// 7. MEMBUAT KARTU MENU.
// Tombol "Tambah ke keranjang" membawa id menu melalui data-add-id.
function createMenuCard(menu) {
  const availabilityText = menu.available ? "Tersedia" : "Habis";
  const availabilityClass = menu.available ? "" : "unavailable";

  return `
    <article class="menu-card">
      <div class="menu-image-wrap">
        <img
          class="menu-image"
          src="${menu.image}"
          alt="${menu.name}"
          loading="lazy"
          onerror="this.onerror=null; this.src='https://placehold.co/800x600/f1f0e8/315b43?text=MenuKita';"
        >
        <span class="menu-category">${menu.category}</span>
        <span class="availability-label ${availabilityClass}">${availabilityText}</span>
      </div>
      <div class="menu-card-content">
        <div class="menu-card-title-row">
          <h3>${menu.name}</h3>
          <span class="menu-price">${formatRupiah(menu.price)}</span>
        </div>
        <p class="menu-description">${menu.description}</p>
        <div class="menu-card-footer">
          <span class="menu-tag">✦ ${menu.tag}</span>
          <span>${menu.available ? "Siap dipesan" : "Sedang habis"}</span>
        </div>
        <button
          class="add-button"
          type="button"
          data-add-id="${menu.id}"
          ${menu.available ? "" : "disabled"}
        >${menu.available ? "+ Tambah ke keranjang" : "Menu sedang habis"}</button>
      </div>
    </article>
  `;
}

// 8. FILTER DAN TAMPILKAN MENU.
function renderMenus() {
  const keyword = searchInput.value.trim().toLocaleLowerCase("id-ID");

  const filteredMenus = menus.filter((menu) => {
    const matchesCategory =
      activeCategory === "Semua" || menu.category === activeCategory;

    const searchableText =
      `${menu.name} ${menu.category} ${menu.description}`.toLocaleLowerCase("id-ID");
    const matchesKeyword = searchableText.includes(keyword);

    return matchesCategory && matchesKeyword;
  });

  menuGrid.innerHTML = filteredMenus.map(createMenuCard).join("");
  menuCount.textContent = filteredMenus.length;

  const hasResults = filteredMenus.length > 0;
  emptyState.hidden = hasResults;
  menuGrid.hidden = !hasResults;
}

// 9. TAMBAHKAN MENU KE KERANJANG.
// Jika menu sudah ada, jumlahnya bertambah; jika belum, buat item baru.
function addToCart(menuId) {
  const menu = menus.find((item) => item.id === Number(menuId));

  // Cegah penambahan menu yang tidak ditemukan atau sedang habis.
  if (!menu || !menu.available) {
    showToast("Menu tersebut sedang tidak tersedia.");
    return;
  }

  const existingItem = cart.find((item) => item.id === menu.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...menu, quantity: 1 });
  }

  renderCart();
  showToast(`${menu.name} ditambahkan ke keranjang.`);
}

// 10. UBAH JUMLAH ITEM ATAU HAPUS ITEM DARI KERANJANG.
// action dapat bernilai "increase", "decrease", atau "remove".
function updateCartItem(menuId, action) {
  const item = cart.find((cartItem) => cartItem.id === Number(menuId));
  if (!item) return;

  if (action === "increase") {
    item.quantity += 1;
  } else if (action === "decrease") {
    item.quantity -= 1;

    // Jika jumlah menjadi nol, item otomatis dikeluarkan dari keranjang.
    if (item.quantity <= 0) {
      cart = cart.filter((cartItem) => cartItem.id !== item.id);
    }
  } else if (action === "remove") {
    cart = cart.filter((cartItem) => cartItem.id !== item.id);
  }

  renderCart();
}

// 11. HITUNG JUMLAH TOTAL ITEM DAN TOTAL HARGA.
function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// 12. TAMPILKAN KERANJANG DAN RINGKASAN HARGA.
function renderCart() {
  const totalQuantity = getCartQuantity();
  const totalPrice = getCartTotal();
  const hasItems = cart.length > 0;

  // Nomor di header menghitung jumlah satuan, bukan jumlah jenis menu.
  headerCartCount.textContent = totalQuantity;
  cartItemsCount.textContent = totalQuantity;
  summaryQuantity.textContent = totalQuantity;
  summaryTotal.textContent = formatRupiah(totalPrice);

  cartEmpty.hidden = hasItems;
  cartItemsContainer.hidden = !hasItems;
  clearCartButton.disabled = !hasItems;
  confirmOrderButton.disabled = !hasItems;

  cartItemsContainer.innerHTML = cart.map((item) => `
    <article class="cart-row">
      <img class="cart-thumb" src="${item.image}" alt="${item.name}"
        onerror="this.onerror=null; this.src='https://placehold.co/160x160/f1f0e8/315b43?text=Menu';">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${formatRupiah(item.price * item.quantity)}</p>
        <div class="quantity-controls" aria-label="Ubah jumlah ${item.name}">
          <button class="quantity-button" type="button" data-cart-action="decrease" data-cart-id="${item.id}" aria-label="Kurangi ${item.name}">−</button>
          <span class="quantity-number">${item.quantity}</span>
          <button class="quantity-button" type="button" data-cart-action="increase" data-cart-id="${item.id}" aria-label="Tambah ${item.name}">+</button>
        </div>
      </div>
      <button class="remove-button" type="button" data-cart-action="remove" data-cart-id="${item.id}">Hapus</button>
    </article>
  `).join("");
}

// 13. EVENT DELEGATION UNTUK TOMBOL KATEGORI.
categoryList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;
  renderCategories();
  renderMenus();
});

// 14. EVENT DELEGATION UNTUK TOMBOL TAMBAH MENU.
menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-add-id]");
  if (!button) return;

  addToCart(button.dataset.addId);
});

// 15. EVENT DELEGATION UNTUK TOMBOL +, −, DAN HAPUS PADA KERANJANG.
cartItemsContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-cart-action]");
  if (!button) return;

  updateCartItem(button.dataset.cartId, button.dataset.cartAction);
});

// 16. KOSONGKAN SELURUH KERANJANG DENGAN KONFIRMASI SEDERHANA.
clearCartButton.addEventListener("click", () => {
  if (cart.length === 0) return;

  const userAgrees = window.confirm("Kosongkan semua menu dari keranjang?");
  if (!userAgrees) return;

  cart = [];
  renderCart();
  showToast("Keranjang berhasil dikosongkan.");
});

// 17. PENCARIAN LANGSUNG SAAT PENGGUNA MENGETIK.
searchInput.addEventListener("input", renderMenus);

// Pintasan "/" untuk fokus ke kolom pencarian.
document.addEventListener("keydown", (event) => {
  const isTyping =
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement;

  if (event.key === "/" && !isTyping) {
    event.preventDefault();
    searchInput.focus();
  }
});

// 18. PERKIRAAN WAKTU TUNGGU DEMO.
// Estimasi contoh: 10 menit dasar + 5 menit untuk setiap jenis menu.
// Ini bukan perhitungan dapur real-time.
function calculateWaitEstimate(orderItems) {
  const numberOfMenuTypes = orderItems.length;
  const minimumMinutes = 10 + numberOfMenuTypes * 5;
  const maximumMinutes = minimumMinutes + 5;

  return `${minimumMinutes}–${maximumMinutes} menit`;
}

// 19. KONFIRMASI PESANAN.
// Sebelum konfirmasi, validasi keranjang dan nomor meja.
// Setelah konfirmasi, tampilkan nomor antrean serta ringkasan pesanan.
confirmOrderButton.addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Tambahkan setidaknya satu menu terlebih dahulu.");
    return;
  }

  const tableNumber = Number(tableNumberInput.value);

  // Nomor meja harus berupa bilangan bulat positif.
  if (
    !tableNumberInput.value.trim() ||
    !Number.isInteger(tableNumber) ||
    tableNumber < 1 ||
    tableNumber > 999
  ) {
    tableNumberInput.focus();
    showToast("Masukkan nomor meja yang valid (1–999).");
    return;
  }

  // Salin keranjang agar ringkasan tidak berubah ketika keranjang dikosongkan.
  const confirmedItems = cart.map((item) => ({ ...item }));
  const orderTotal = confirmedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Nomor urut ini hanya dihitung di browser. Refresh/HP lain dapat mengulang nomor.
  const queueNumber = `A${String(nextQueueNumber).padStart(3, "0")}`;
  nextQueueNumber += 1;

  // Isi tiket antrean.
  queueNumberElement.textContent = queueNumber;
  queueTableElement.textContent = `Meja ${tableNumber}`;
  waitTimeElement.textContent = calculateWaitEstimate(confirmedItems);
  confirmedTotal.textContent = formatRupiah(orderTotal);

  // Buat ringkasan isi pesanan yang telah dikonfirmasi.
  confirmedOrderList.innerHTML = confirmedItems.map((item) => `
    <div class="confirmed-order-line">
      <span>${item.name} × ${item.quantity}</span>
      <strong>${formatRupiah(item.price * item.quantity)}</strong>
    </div>
  `).join("");

  // Keranjang dikosongkan setelah konfirmasi berhasil di demo.
  cart = [];
  renderCart();

  // Tampilkan dialog. Metode showModal() membuat dialog dapat diakses dengan keyboard.
  confirmationDialog.showModal();
});

// 20. TUTUP DIALOG. Tombol "Selesai" juga membersihkan input nomor meja.
function closeConfirmationDialog() {
  if (confirmationDialog.open) {
    confirmationDialog.close();
  }
  tableNumberInput.value = "";
  showToast("Terima kasih. Silakan ikuti instruksi pelayan.");
}

closeDialogButton.addEventListener("click", closeConfirmationDialog);
finishOrderButton.addEventListener("click", closeConfirmationDialog);

// 21. TAHUN OTOMATIS DI FOOTER.
currentYear.textContent = new Date().getFullYear();

// 22. TAMPILKAN DATA AWAL SAAT HALAMAN PERTAMA KALI DIBUKA.
renderCategories();
renderMenus();
renderCart();

/*
  BATASAN PENTING:
  - Ini prototipe front-end; pesanan tidak terkirim ke dapur atau kasir.
  - Nomor antrean dibuat lokal, bukan nomor global untuk semua pelanggan.
  - Estimasi waktu tunggu hanya rumus demo, bukan waktu akurat.
  - Untuk operasional nyata, simpan pesanan di backend/database online.
    Server perlu membuat nomor antrean secara terpusat, memvalidasi stok,
    menyimpan waktu pesanan, dan menampilkan status dari pihak cafe.
*/
