// Mock Product Data
let products = [
    { id: 1, name: 'Laptop Gamer X1', sku: 'ELE-001', category: 'Electrónica', stock: 5, price: 1200.00, img: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Silla Ergonómica', sku: 'MUE-002', category: 'Muebles', stock: 45, price: 250.00, img: 'https://via.placeholder.com/40' },
    { id: 3, name: 'Monitor 27"', sku: 'ELE-003', category: 'Electrónica', stock: 12, price: 300.00, img: 'https://via.placeholder.com/40' },
    { id: 4, name: 'Escritorio Madera', sku: 'MUE-004', category: 'Muebles', stock: 8, price: 450.00, img: 'https://via.placeholder.com/40' },
    { id: 5, name: 'Teclado Mecánico', sku: 'ELE-005', category: 'Electrónica', stock: 25, price: 80.00, img: 'https://via.placeholder.com/40' },
    { id: 6, name: 'Camiseta Polo', sku: 'ROP-006', category: 'Ropa', stock: 100, price: 25.00, img: 'https://via.placeholder.com/40' },
    { id: 7, name: 'Snacks Mix', sku: 'ALI-007', category: 'Alimentos', stock: 200, price: 5.00, img: 'https://via.placeholder.com/40' }
];

// --- Render Table ---
const tableBody = document.getElementById('inventoryTableBody');

function renderTable() {
    tableBody.innerHTML = '';
    products.forEach(prod => {
        const row = document.createElement('tr');

        // Determine Stock Status
        let statusClass = 'stock-high';
        let statusText = 'En Stock';

        if (prod.stock === 0) {
            statusClass = 'stock-low';
            statusText = 'Agotado';
        } else if (prod.stock < 10) {
            statusClass = 'stock-low';
            statusText = 'Bajo Stock';
        } else if (prod.stock < 30) {
            statusClass = 'stock-med';
            statusText = 'Regular';
        }

        row.innerHTML = `
            <td><img src="${prod.img}" alt="${prod.name}" class="product-img"></td>
            <td>${prod.name}</td>
            <td>${prod.sku}</td>
            <td>${prod.category}</td>
            <td>${prod.stock}</td>
            <td>$${prod.price.toFixed(2)}</td>
            <td><span class="stock-badge ${statusClass}">${statusText}</span></td>
            <td>
                <button class="btn-action">Editar</button>
                <button class="btn-action" style="color: #ef4444;">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    updateKPIs();
}

// --- KPIs ---
function updateKPIs() {
    const totalProducts = products.length;
    const lowStock = products.filter(p => p.stock < 10).length;
    const totalValue = products.reduce((acc, curr) => acc + (curr.stock * curr.price), 0);

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('lowStockCount').textContent = lowStock;
    document.getElementById('totalValue').textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalValue);
}

// --- Charts ---
const ctxCat = document.getElementById('stockCategoryChart').getContext('2d');
const ctxStat = document.getElementById('stockStatusChart').getContext('2d');

// Initial Chart Data
new Chart(ctxCat, {
    type: 'bar',
    data: {
        labels: ['Electrónica', 'Muebles', 'Ropa', 'Alimentos'],
        datasets: [{
            label: 'Stock Total',
            data: [42, 53, 100, 200],
            backgroundColor: '#0ea5e9',
            borderRadius: 4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
    }
});

new Chart(ctxStat, {
    type: 'doughnut',
    data: {
        labels: ['En Stock', 'Bajo Stock', 'Agotado'],
        datasets: [{
            data: [5, 2, 0], // Dummy initial counts based on mock data
            backgroundColor: ['#10b981', '#ef4444', '#94a3b8'],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
    }
});

// --- Modal Logic ---
const modal = document.getElementById('productModal');
const addBtn = document.getElementById('addProductBtn');
const closeBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const form = document.getElementById('addProductForm');

function openModal() {
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
    form.reset();
}

addBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Close on click outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// --- Add Product Logic ---
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newProduct = {
        id: products.length + 1,
        name: document.getElementById('prodName').value,
        sku: document.getElementById('prodSKU').value,
        category: document.getElementById('prodCategory').value,
        stock: parseInt(document.getElementById('prodStock').value),
        price: parseFloat(document.getElementById('prodPrice').value),
        img: 'https://via.placeholder.com/40'
    };

    products.push(newProduct);
    renderTable();
    closeModal();
    alert('Producto agregado exitosamente (Prototipo)');
});

// Initial Render
renderTable();
