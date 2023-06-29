let isDrawing = false;
let startX, startY;
let currentSquare;
let completedRotations = 0;
let rotatingSquares = new Set();

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const createSquare = (x, y, width, height) => {
    const square = document.createElement('div');
    square.className = 'square';
    square.style.width = `${width}px`;
    square.style.height = `${height}px`;
    square.style.backgroundColor = getRandomColor();
    square.style.top = `${y}px`;
    square.style.left = `${x}px`;
    square.addEventListener('dblclick', handleDoubleClick);
    document.body.appendChild(square);
    return square;
};

const handleMouseMove = (event) => {
    if (!isDrawing) return;
    const x = Math.min(event.clientX || event.touches[0].clientX, startX);
    const y = Math.min(event.clientY || event.touches[0].clientY, startY);
    const width = Math.abs((event.clientX || event.touches[0].clientX) - startX);
    const height = Math.abs((event.clientY || event.touches[0].clientY) - startY);
    currentSquare.style.width = `${width}px`;
    currentSquare.style.height = `${height}px`;
    currentSquare.style.top = `${y}px`;
    currentSquare.style.left = `${x}px`;
};

const handleMouseDown = (event) => {
    if (isDrawing) return;
    isDrawing = true;
    startX = event.clientX || event.touches[0].clientX;
    startY = event.clientY || event.touches[0].clientY;
    currentSquare = createSquare(startX, startY, 0, 0);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
};

const handleMouseUp = () => {
    if (!isDrawing) return;
    isDrawing = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('touchmove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchend', handleMouseUp);

    const minWidth = 1;
    const minHeight = 1;
    if (parseInt(currentSquare.style.width) < minWidth || parseInt(currentSquare.style.height) < minHeight) {
        currentSquare.parentNode.removeChild(currentSquare);
    }

    currentSquare = null;
};

const handleDoubleClick = (event) => {
    const square = event.target;
    rotatingSquares.add(square);
    rotateSquare(square);
};

const rotateSquare = (square) => {
    let rotation = 0;
    const interval = setInterval(() => {
        rotation += 10;
        square.style.transform = `rotate(${rotation}deg)`;
        if (rotation === 360) {
            clearInterval(interval);
            completedRotations++;
            if (completedRotations === rotatingSquares.size) {
                rotatingSquares.forEach(square => square.parentNode.removeChild(square));
                rotatingSquares.clear();
                completedRotations = 0;
            }
        }
    }, 30);
};

document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('touchstart', handleMouseDown);
