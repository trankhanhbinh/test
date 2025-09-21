const TILE_SIZE = 20; // kích thước mỗi ô (pixel)

function drawMap(mapData, container) {
    const rows = mapData.map.length;
    const cols = mapData.map[0].length;
    const canvas = document.createElement("canvas");
    canvas.width = cols * TILE_SIZE;
    canvas.height = rows * TILE_SIZE;
    const ctx = canvas.getContext("2d");

            // Vẽ map
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cell = mapData.map[y][x];
            if (cell === 1) {
                ctx.fillStyle = mapData.wall_color;
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } 
            else if (cell === 2) {
                ctx.fillStyle = "#444"; // nhà ma
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } 
            else {
                ctx.fillStyle = "black"; // đường
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                // Hạt nhỏ
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc(x * TILE_SIZE + TILE_SIZE/2, y * TILE_SIZE + TILE_SIZE/2, 2, 0, Math.PI*2);
                ctx.fill();
            }
        }
    }
}
container.appendChild(canvas);

// --- Draw each map only once until all have appeared ---
function getNextMapIndex() {
    const totalMaps = MAPS.length;
    let shown = [];
    try {
        shown = JSON.parse(localStorage.getItem('shownMaps') || '[]');
    } catch (e) {
        shown = [];
    }
    
    // Reset if all maps have been shown
    if (shown.length >= totalMaps) {
        shown = [];
    }
    
    // Get available indices
    const available = [];
    for (let i = 0; i < totalMaps; i++) {
        if (!shown.includes(i)) available.push(i);
    }
            
    // Pick random from available
    const idx = available[Math.floor(Math.random() * available.length)];
    shown.push(idx);
    localStorage.setItem('shownMaps', JSON.stringify(shown));
    return idx;
}

const container = document.getElementById("mapContainer");
const nextMapIdx = getNextMapIndex();
drawMap(MAPS[nextMapIdx], container);