// --- Sales Chart Logic (Existing) ---
const salesData = {
    year: {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        data: [150000, 180000, 210000, 190000, 240000],
        label: 'Ventas Anuales ($)'
    },
    month: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        data: [12000, 15000, 18000, 14000, 22000, 25000, 21000, 19000, 28000, 32000, 35000, 40000],
        label: 'Ventas Mensuales ($)'
    },
    week: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        data: [2500, 3200, 2800, 4100, 3900, 5200, 4800],
        label: 'Ventas Semanales ($)'
    },
    day: {
        labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
        data: [150, 300, 450, 200, 600, 800, 500],
        label: 'Ventas Diarias ($)'
    }
};

const ctx = document.getElementById('salesChart').getContext('2d');
const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(14, 165, 233, 0.5)');
gradient.addColorStop(1, 'rgba(14, 165, 233, 0.0)');

let currentChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: salesData.week.labels,
        datasets: [{
            label: salesData.week.label,
            data: salesData.week.data,
            borderColor: '#0ea5e9',
            backgroundColor: gradient,
            borderWidth: 3,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#0ea5e9',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#f8fafc',
                bodyColor: '#f8fafc',
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) { label += ': '; }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#e2e8f0', borderDash: [5, 5] },
                ticks: { color: '#64748b', callback: function (value) { return '$' + value / 1000 + 'k'; } }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#64748b' }
            }
        },
        interaction: { intersect: false, mode: 'index' },
    }
});

const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        updateChart(filter);
    });
});

function updateChart(period) {
    const data = salesData[period];
    currentChart.data.labels = data.labels;
    currentChart.data.datasets[0].data = data.data;
    currentChart.data.datasets[0].label = data.label;
    currentChart.update();
}

// --- Export Functionality ---
document.getElementById('exportBtn').addEventListener('click', () => {
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const data = salesData[activeFilter];

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Periodo,Ventas\n";

    data.labels.forEach((label, index) => {
        csvContent += `${label},${data.data[index]}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ventas_${activeFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// --- Category Pie Chart ---
const ctxPie = document.getElementById('categoryChart').getContext('2d');
new Chart(ctxPie, {
    type: 'doughnut',
    data: {
        labels: ['Electrónica', 'Muebles', 'Ropa', 'Alimentos'],
        datasets: [{
            data: [35, 25, 20, 20],
            backgroundColor: ['#0ea5e9', '#6366f1', '#10b981', '#f59e0b'],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#64748b' } }
        }
    }
});

// --- Leaflet Map ---
// Initialize map centered on a generic location (e.g., Mexico City or similar)
const map = L.map('fleetMap').setView([19.4326, -99.1332], 11);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Dummy Truck Markers
const trucks = [
    { lat: 19.4326, lng: -99.1332, name: "Camión 01 - Centro" },
    { lat: 19.4000, lng: -99.1500, name: "Camión 02 - Sur" },
    { lat: 19.4500, lng: -99.1200, name: "Camión 03 - Norte" },
    { lat: 19.3900, lng: -99.1800, name: "Camión 04 - Poniente" },
    { lat: 19.4200, lng: -99.0800, name: "Camión 05 - Oriente" }
];

trucks.forEach(truck => {
    L.marker([truck.lat, truck.lng])
        .addTo(map)
        .bindPopup(`<b>${truck.name}</b><br>En ruta`);
});

// --- Alerts Population ---
const alerts = [
    { type: 'critical', title: 'Stock Crítico: Laptops', msg: 'Quedan menos de 10 unidades en almacén central.' },
    { type: 'warning', title: 'Retraso en Ruta 5', msg: 'Tráfico pesado reportado en zona norte.' },
    { type: 'info', title: 'Mantenimiento Programado', msg: 'Camión 03 entra a servicio mañana.' }
];

const alertsList = document.getElementById('alertsList');
alerts.forEach(alert => {
    const div = document.createElement('div');
    div.className = `alert-item ${alert.type}`;
    div.innerHTML = `
        <div class="alert-content">
            <h4>${alert.title}</h4>
            <p>${alert.msg}</p>
        </div>
    `;
    alertsList.appendChild(div);
});

// --- Recent Shipments Table ---
const shipments = [
    { id: '#ORD-001', client: 'Tech Solutions Ltd', dest: 'Guadalajara, JAL', date: '2023-10-25', status: 'transit', statusText: 'En Tránsito' },
    { id: '#ORD-002', client: 'Muebles Modernos', dest: 'Monterrey, NL', date: '2023-10-24', status: 'delivered', statusText: 'Entregado' },
    { id: '#ORD-003', client: 'Moda Express', dest: 'CDMX, Centro', date: '2023-10-26', status: 'pending', statusText: 'Pendiente' },
    { id: '#ORD-004', client: 'Supermercados A1', dest: 'Puebla, PUE', date: '2023-10-25', status: 'transit', statusText: 'En Tránsito' },
    { id: '#ORD-005', client: 'Oficinas Centrales', dest: 'Querétaro, QRO', date: '2023-10-23', status: 'delivered', statusText: 'Entregado' }
];

const tableBody = document.getElementById('shipmentsTableBody');
shipments.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.client}</td>
        <td>${item.dest}</td>
        <td>${item.date}</td>
        <td><span class="status-badge status-${item.status}">${item.statusText}</span></td>
        <td><button class="btn-action">Ver</button></td>
    `;
    tableBody.appendChild(row);
});
