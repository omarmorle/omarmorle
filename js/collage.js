const descriptions = [];
const descriptionsEn = [];

document.addEventListener('DOMContentLoaded', async () => {
    const collageContainer = document.querySelector('.collage-container');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const modalText = document.getElementById('modal-text');
    const imageContainer = document.querySelector('.image-container');

    async function loadDescriptions() {
        const response = await fetch('../txt/descriptions_es.txt');
        const text = await response.text();
        const lines = text.split('\n');
        const response_en = await fetch('../txt/descriptions_en.txt');
        const text_en = await response_en.text();
        const lines_en = text_en.split('\n');
        lines.forEach((line) => descriptions.push(line));
        lines_en.forEach((line) => descriptionsEn.push(line));
    }

    await loadDescriptions();

    function createImageElement(src, description, rotation, zIndex, top, left) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = description;
        img.style.transform = `rotate(${rotation}deg)`;
        img.style.zIndex = zIndex;
        img.style.top = `${top}%`;
        img.style.left = `${left}%`;
        img.classList.add('collage-img');

        img.addEventListener('mouseover', () => {
            img.style.transform = `scale(1.5) rotate(${rotation}deg)`;
        });

        img.addEventListener('mouseout', () => {
            img.style.transform = `rotate(${rotation}deg)`;
        });

        img.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImg.src = src;
            modalImg.style.transform = 'rotate(0deg)';
            modalText.textContent = description;
        });

        return img;
    }

    function rearrangeImages(language) {
        console.log(language);
        imageContainer.innerHTML = '';
        const totalImages = 29; // Cambiar esto al número total de imágenes
        const shuffledIndices = Array.from({ length: totalImages }, (_, i) => i + 1).sort(() => Math.random() - 0.5);

        // Cuadrícula imaginaria
        const gridSize = 6; // Aumenta el tamaño de la cuadrícula para acomodar más imágenes
        const gridPositions = Array.from({ length: gridSize * gridSize }, (_, i) => i).sort(() => Math.random() - 0.5);

        const margin = 2; // Porcentaje de margen adicional alrededor del contenedor

        for (let i = 0; i < totalImages; i++) { // Cambiar esto al número total de imágenes
            const src = `../images/image${shuffledIndices[i]}.jpg`;
            const description = (language === 'en') ? descriptionsEn[shuffledIndices[i] - 1] : descriptions[shuffledIndices[i] - 1];
            const rotation = Math.floor(Math.random() * 360);
            const zIndex = shuffledIndices[i];
            const gridPosition = gridPositions[i];
            const maxImageSize = 20; // Tamaño máximo de las imágenes incluido el margen
            const cellSize = (100 - 2 * margin) / gridSize;
            const top = margin + cellSize * Math.floor(gridPosition / gridSize) + Math.random() * (cellSize - maxImageSize);
            const left = margin + cellSize * (gridPosition % gridSize) + Math.random() * (cellSize - maxImageSize);

            const img = createImageElement(src, description, rotation, zIndex, top, left);
            imageContainer.appendChild(img);
        }
    }

    document.getElementById('language-switch').addEventListener('change', (e) => {
        if (e.target.checked) {
            rearrangeImages('en');
        } else {
            rearrangeImages('es');
        }
    });




    rearrangeImages();


    modal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
});