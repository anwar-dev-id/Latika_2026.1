/* =========================================================
   MenuKita - script.js
   Logika interaktif website berada di file ini.
   Catatan: data di bawah adalah data contoh untuk demonstrasi.
   ========================================================= */

// 1. Daftar menu contoh.
// Untuk menambah menu, salin satu objek dan ubah nilai propertinya.
// Properti:
// - id: identitas unik menu
// - name: nama makanan/minuman
// - price: harga dalam rupiah (angka, tanpa titik)
// - category: kategori menu
// - description: penjelasan singkat
// - image: alamat gambar
// - available: true berarti tersedia, false berarti habis
// - tag: label kecil untuk ditampilkan pada kartu
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

// 2. Mengambil elemen HTML yang akan dikendalikan oleh JavaScript.
const menuGrid = document.querySelector("#menu-grid");
const categoryList = document.querySelector("#category-list");
const searchInput = document.querySelector("#search-input");
const menuCount = document.querySelector("#menu-count");
const emptyState = document.querySelector("#empty-state");
const currentYear = document.querySelector("#current-year");

// 3. Menyimpan kategori yang sedang dipilih.
// Nilai "Semua" berarti tampilkan semua kategori.
let activeCategory = "Semua";

// 4. Mengubah angka harga menjadi format rupiah, misalnya 22000 menjadi Rp22.000.
function formatRupiah(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(price);
}

// 5. Membuat tombol kategori berdasarkan kategori yang ada pada data menu.
// Set otomatis menghindari kategori yang sama muncul berulang kali.
function renderCategories() {
  const uniqueCategories = [...new Set(menus.map((menu) => menu.category))];
  const categories = ["Semua", ...uniqueCategories];

  categoryList.innerHTML = categories
    .map((category) => {
      const isActive = category === activeCategory;

      // Atribut aria-pressed membantu teknologi bantu mengetahui tombol aktif.
      return `
        <button
          class="category-button ${isActive ? "active" : ""}"
          type="button"
          data-category="${category}"
          aria-pressed="${isActive}"
        >
          ${category}
        </button>
      `;
    })
    .join("");
}

// 6. Membuat kartu HTML untuk satu menu.
// Semua teks yang digunakan berasal dari data contoh di atas.
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
          <span>${menu.available ? "Siap dipesan" : "Tanyakan ke pelayan"}</span>
        </div>
      </div>
    </article>
  `;
}

// 7. Menampilkan menu sesuai kategori dan kata kunci pencarian.
function renderMenus() {
  const keyword = searchInput.value.trim().toLocaleLowerCase("id-ID");

  // filter() mengambil hanya menu yang memenuhi kedua syarat berikut.
  const filteredMenus = menus.filter((menu) => {
    const matchesCategory =
      activeCategory === "Semua" || menu.category === activeCategory;

    // Cari pada nama, kategori, dan deskripsi agar pencarian lebih berguna.
    const searchableText =
      `${menu.name} ${menu.category} ${menu.description}`.toLocaleLowerCase("id-ID");
    const matchesKeyword = searchableText.includes(keyword);

    return matchesCategory && matchesKeyword;
  });

  // Ubah data menu menjadi kumpulan kartu HTML.
  menuGrid.innerHTML = filteredMenus.map(createMenuCard).join("");

  // Perbarui jumlah hasil sesuai menu yang sedang ditampilkan.
  menuCount.textContent = filteredMenus.length;

  // Jika hasil kosong, sembunyikan grid dan tampilkan pesan yang sesuai.
  const hasResults = filteredMenus.length > 0;
  emptyState.hidden = hasResults;
  menuGrid.hidden = !hasResults;
}

// 8. Event delegation: satu listener menangani semua tombol kategori.
categoryList.addEventListener("click", (event) => {
  const clickedButton = event.target.closest("button[data-category]");

  // Abaikan klik yang bukan berasal dari tombol kategori.
  if (!clickedButton) return;

  activeCategory = clickedButton.dataset.category;
  renderCategories();
  renderMenus();
});

// 9. Perbarui hasil saat pengguna mengetik di kolom pencarian.
searchInput.addEventListener("input", renderMenus);

// 10. Pintasan tombol "/" untuk langsung fokus ke kolom pencarian.
// Jangan aktifkan pintasan ketika pengguna sedang mengetik di input lain.
document.addEventListener("keydown", (event) => {
  const isTyping =
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement;

  if (event.key === "/" && !isTyping) {
    event.preventDefault();
    searchInput.focus();
  }
});

// 11. Tampilkan tahun saat ini secara otomatis di footer.
currentYear.textContent = new Date().getFullYear();

// 12. Jalankan fungsi awal agar kategori dan menu muncul saat halaman dibuka.
renderCategories();
renderMenus();

/*
  CATATAN PENTING UNTUK PENGEMBANG:
  - Ini adalah demo front-end. Data menu disimpan di array JavaScript.
  - Mengubah data pada file ini memerlukan perubahan kode dan publikasi ulang.
  - Belum ada dashboard admin, database online, keranjang, atau pembayaran.
  - Untuk dipakai banyak cafe/perangkat, sambungkan ke backend/database dan
    atur autentikasi serta izin agar hanya pemilik yang dapat mengubah menu.
*/
