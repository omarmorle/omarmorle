const content = {};

// Inicializa EmailJS
emailjs.init("cprK59ae2xhl_L9kK"); // Reemplaza YOUR_USER_ID con tu user_id

// Función para mostrar el modal con un mensaje
function showModal(title, message) {
    const resultModalTitle = document.getElementById("result-modal-title");
    const resultModalMessage = document.getElementById("result-modal-message");

    resultModalTitle.textContent = title;
    resultModalMessage.textContent = message;

    const resultModal = new bootstrap.Modal(document.getElementById("result-modal"));
    resultModal.show();
}

// Selecciona el formulario
const contactForm = document.getElementById('contact-form');

// Escucha el evento 'submit' del formulario
contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Enviar el correo electrónico utilizando EmailJS
    emailjs.sendForm("service_qlm5v6n", "template_1zbutjj", contactForm)
        .then((result) => {
            console.log("¡Correo enviado exitosamente!", result);

            // Muestra el modal con un mensaje de éxito
            showModal("Éxito / Success", "Tu mensaje ha sido enviado exitosamente. / Your message has been sent successfully.");

            // Borra los campos del formulario
            contactForm.reset();
        }, (error) => {
            console.log("Error al enviar el correo:", error);

            // Muestra el modal con un mensaje de error
            showModal("Error", "Ha ocurrido un error al enviar tu mensaje. Por favor, inténtalo de nuevo.");
        });
});

async function loadContent(language) {
    const response = await fetch(`../txt/content_${language}.txt`);
    const text = await response.text();
    const lines = text.split('\n');

    lines.forEach((line) => {
        const [key, value] = line.split('|');
        content[key] = value;
    });

    updateContent();
}

function updateContent() {
    for (const key in content) {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = content[key];
        }
    }

    // Actualiza las imágenes
    const language = document.getElementById('language-switch').checked ? 'en' : 'es';
    const topLangsImg = document.getElementById('top-langs');
    const githubStatsImg = document.getElementById('github-stats');

    // Actualiza los marcadores de posición del formulario
    document.getElementById('name-input').placeholder = content['nombre_input_' + language];
    document.getElementById('email-input').placeholder = content['correo_input_' + language];
    document.getElementById('message-input').placeholder = content['mensaje_input_' + language];
    // Actualiza el valor del botón "submit"
    document.getElementById('enviar-input').value = content['enviar_input_' + language];

    topLangsImg.src = `https://github-readme-stats.vercel.app/api/top-langs?username=omarmorle&show_icons=true&locale=${language}&theme=dark#gh-dark-mode-only`;
    githubStatsImg.src = `https://github-readme-stats.vercel.app/api?username=omarmorle&show_icons=true&locale=${language}&theme=dark#gh-dark-mode-only`;
}

document.getElementById('language-switch').addEventListener('change', (e) => {
    if (e.target.checked) {
        loadContent('en');
    } else {
        loadContent('es');
    }
});

// Carga el contenido en español al inicio
loadContent('es');

document.addEventListener('DOMContentLoaded', () => {
    // Resto de tu código JavaScript

    const languageChartData = {
        labels: ['C++', 'ColdFusion', 'Java', 'JavaScript', 'PHP', 'Python', 'Spring'],
        datasets: [
            {
                label: 'Dominio',
                data: [90, 70, 85, 90, 90, 80, 60],
                backgroundColor: 'transparent',
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)',
                ],
                borderWidth: 3,
            },
        ],
    };

    const languageChartConfig = {
        type: 'bar',
        data: languageChartData,
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: {
                        color: 'white', // Cambiar el color de los ticks del eje X
                    },
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: {
                        color: 'white', // Cambiar el color de los ticks del eje Y
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
            elements: {
                bar: {
                    borderSkipped: false,
                },
            },
        },
    };


    const languageChartCanvas = document.getElementById('languageChart');
    const languageChart = new Chart(languageChartCanvas, languageChartConfig);
});

function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

async function loadProjects(language) {
    const response = await fetch(`../json/projects_${language}.json`);
    const projects = await response.json();
    const contentResponse = await fetch(`../json/content_${language}.json`);
    const content = await contentResponse.json();
    const container = document.querySelector("#projects-container .carousel-inner");
    const modalsContainer = document.getElementById("modals-container");

    container.innerHTML = '';
    modalsContainer.innerHTML = '';

    const chunkSize = 3;

    // Repetir proyectos hasta que el número total sea un múltiplo de chunkSize
    while (projects.length % chunkSize !== 0) {
        projects.push(...projects.slice(0, chunkSize - (projects.length % chunkSize)));
    }

    const projectChunks = chunkArray(projects, chunkSize);

    projectChunks.forEach((chunk, chunkIndex) => {
        const activeClass = chunkIndex === 0 ? 'active' : '';

        let carouselItemContent = '';

        chunk.forEach((project, index) => {
            carouselItemContent += `
            <div class="col-md-4">
                <div class="card" data-tilt>
                    <img src="${project.image}" alt="user" class="imgcard">
                    <h3>${project.name}</h3>
                    <div class="icons">
                        <a href="${project.github}" target="_blank">
                            <i class="fab fa-github"></i>
                        </a>
                    </div>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#projectModal-${chunkIndex * chunkSize + index}">
                        ${content.view_more}
                    </button>
                </div>
            </div>
            `;
        });

        const carouselItem = `
        <div class="carousel-item ${activeClass}">
            <div class="row w-100 mx-auto">
                ${carouselItemContent}
            </div>
        </div>
        `;

        container.innerHTML += carouselItem;
    });

    projects.forEach((project, index) => {
        const tags = project.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ');

        const modal = `
        <div class="modal fade" id="projectModal-${index}" tabindex="-1" aria-labelledby="projectModalLabel-${index}" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="projectModalLabel-${index}" style="color: black;">${project.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${content.close}"></button>
                    </div>
                    <div class="modal-body">
                        <p style="color: black;">${project.desc}</p>
                        <div class="tags">${tags}</div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${content.close}</button>
                    </div>
                </div>
            </div>
        </div>
        `;

        modalsContainer.innerHTML += modal;
    });
}


document.getElementById('language-switch').addEventListener('change', (e) => {
    const language = e.target.checked ? 'en' : 'es';
    loadContent(language);
    loadProjects(language);
});

// Carga el contenido y los proyectos en español al inicio
loadContent('es');
loadProjects('es');