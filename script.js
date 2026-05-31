// --- 1. CONFIGURACIÓN DE GRÁFICOS (CHART.JS) ---
Chart.register(ChartDataLabels);

// Paletas de colores
const colors = [
    ['#047857', '#10b981', '#6ee7b7', '#d1fae5'], // Esmeraldas (Verdes)
    ['#1d4ed8', '#3b82f6', '#93c5fd', '#dbeafe'], // Azules Reales
    ['#0f766e', '#14b8a6', '#5eead4', '#ccfbf1'], // Turquesas/Teal
    ['#0369a1', '#0ea5e9', '#7dd3fc', '#e0f2fe'], // Celestes (Sky)
    ['#4338ca', '#6366f1', '#a5b4fc', '#e0e7ff']  // Índigos
];

const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom' },
        tooltip: {
            callbacks: {
                label: function(context) {
                    let value = context.raw;
                    let total = context.chart._metasets[context.datasetIndex].total;
                    let percentage = Math.round((value / total) * 100) + '%';
                    return ` ${context.label}: ${value} votos (${percentage})`;
                }
            }
        },
        datalabels: {
            color: '#ffffff',
            font: { weight: 'bold', size: 14 },
            formatter: (value, ctx) => {
                let sum = 0;
                let dataArr = ctx.chart.data.datasets[0].data;
                dataArr.map(data => { sum += data; });
                let percentage = (value * 100 / sum).toFixed(0) + "%";
                return value > 0 ? percentage : ''; 
            },
            textStrokeColor: 'rgba(0,0,0,0.5)',
            textStrokeWidth: 2
        }
    }
};

const surveyData = [
    { id: 'chart1', labels: ['A) ChatGPT', 'B) Gemini', 'C) Claude', 'D) Other'], colorIdx: 0, data: [6, 3, 2, 1] },
    { id: 'chart2', labels: ['A) Mathematics', 'B) English', 'C) Programming', 'D) Other'], colorIdx: 1, data: [4, 2, 5, 1] },
    { id: 'chart3', labels: ['A) Research papers', 'B) Math homework', 'C) Slide presentations', 'D) Programming projects'], colorIdx: 2, data: [3, 4, 1, 4] },
    { id: 'chart4', labels: ['A) Homework', 'B) Research', 'C) Studying', 'D) Personal problems'], colorIdx: 3, data: [5, 4, 3, 0] },
    { id: 'chart5', labels: ['A) Saving time', 'B) Better understanding', 'C) Faster homework', 'D) Better grades'], colorIdx: 4, data: [7, 2, 2, 1] },
    { id: 'chart6', labels: ['A) Creating laziness', 'B) Wrong information', 'C) Dependence', 'D) Less creativity'], colorIdx: 0, data: [4, 1, 5, 2] },
    { id: 'chart7', labels: ['A) Calculus', 'B) English', 'C) Programming', 'D) Other'], colorIdx: 1, data: [5, 1, 6, 0] },
    { id: 'chart8', labels: ['A) Writing essays', 'B) Solving problems', 'C) Making presentations', 'D) Searching info'], colorIdx: 2, data: [3, 5, 1, 3] },
    { id: 'chart9', labels: ['A) Engineering', 'B) Medical', 'C) Business', 'D) Culinary arts'], colorIdx: 3, data: [6, 2, 3, 1] },
    { id: 'chart10', labels: ['A) Homework help', 'B) Studying faster', 'C) Researching faster', 'D) Saving time'], colorIdx: 4, data: [4, 3, 2, 3] }
];

document.addEventListener("DOMContentLoaded", function() {
    surveyData.forEach(item => {
        const ctx = document.getElementById(item.id).getContext('2d');
        let dataConfig = {
            labels: item.labels,
            datasets: [{
                data: item.data,
                backgroundColor: colors[item.colorIdx],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: dataConfig,
            options: chartConfig
        });
    });

    generateGallery();
});

// --- 2. LÓGICA DEL REPRODUCTOR DE VIDEO ---
const video = document.getElementById('mainVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const speedBtn = document.getElementById('speedBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const videoOverlay = document.getElementById('videoOverlay');
const videoWrapper = document.getElementById('videoWrapper');

let playSpeeds = [1, 1.5, 2];
let currentSpeedIdx = 0;

function togglePlay() {
    if (video.paused) {
        video.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause fa-lg"></i>';
        videoOverlay.style.opacity = '0';
    } else {
        video.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play fa-lg"></i>';
        videoOverlay.style.opacity = '1';
    }
}

playPauseBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);

speedBtn.addEventListener('click', () => {
    currentSpeedIdx = (currentSpeedIdx + 1) % playSpeeds.length;
    video.playbackRate = playSpeeds[currentSpeedIdx];
    speedBtn.textContent = `${playSpeeds[currentSpeedIdx]}x Speed`;
    
    speedBtn.classList.add('bg-indigo-600');
    setTimeout(() => speedBtn.classList.remove('bg-indigo-600'), 200);
});

fullscreenBtn.addEventListener('click', () => {
    if (videoWrapper.requestFullscreen) {
        videoWrapper.requestFullscreen();
    } else if (videoWrapper.webkitRequestFullscreen) {
        videoWrapper.webkitRequestFullscreen();
    } else if (videoWrapper.msRequestFullscreen) {
        videoWrapper.msRequestFullscreen();
    }
});

// --- 3. LÓGICA DE LA GALERÍA DE IMÁGENES ---
function previewMainLogo(event) {
    const input = event.target;
    const preview = document.getElementById('mainLogoPreview');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// --- LÓGICA DEL MODAL ---
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const captionText = document.getElementById("modalCaption");

// Nueva función que recibe el nombre y carrera fijos
function openModal(imageSrc, name, career) {
    modal.style.display = "block";
    setTimeout(() => { modal.classList.add("show"); }, 10);
    
    modalImg.src = imageSrc;
    captionText.innerHTML = `<strong>${name}</strong><br><span class="text-sm text-gray-300">${career}</span>`;
    
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }, 300);
}

modal.addEventListener('click', function(e) {
    if(e.target === modal) { closeModal(); }
});

document.addEventListener('keydown', function(e) {
    if(e.key === "Escape" && modal.style.display === "block") { closeModal(); }
});