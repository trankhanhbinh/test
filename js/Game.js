// --- GAME ENGINE & UTILS ---

function cloneMap(mapData) {
  return structuredClone(mapData);
}

function findRandomSpawnPoint(mapData) {
  let validSpots = [];
  for (let y = 0; y < mapData.length; y++) {
    for (let x = 0; x < mapData[0].length; x++) {
      // Chỉ lấy đường đi (0), tránh tường (1) và nhà ma (2)
      if (mapData[y][x] === 0) {
        validSpots.push({ x: x, y: y });
      }
    }
  }
  if (validSpots.length === 0) return { x: 1, y: 1 };

  const randomIndex = Math.floor(Math.random() * validSpots.length);
  return validSpots[randomIndex];
}

function startGame() {
  // 1. Reset Loop
  if (gameInterval) clearInterval(gameInterval);

  // 2. Chọn Map Ngẫu Nhiên (Logic cũ của bạn)
  const totalMaps = MAPS.length;
  let shown = [];
  try {
    shown = JSON.parse(localStorage.getItem("shownMaps") || "[]");
  } catch (e) {
    shown = [];
  }
  if (shown.length >= totalMaps) shown = [];

  const available = [];
  for (let i = 0; i < totalMaps; i++) {
    if (!shown.includes(i)) available.push(i);
  }
  const idx = available[Math.floor(Math.random() * available.length)];
  shown.push(idx);
  localStorage.setItem("shownMaps", JSON.stringify(shown));

  const selectedMap = MAPS[idx];
  currentMap = cloneMap(selectedMap.map);
  currentWallColor = selectedMap.wall_color || "#09f";

  // 3. Reset State
  score = 0;
  gameOver = false;
  document.getElementById("scoreDisplay").textContent = `Score: 0`;

  // Resize Canvas
  canvas.width = currentMap[0].length * TILE_SIZE;
  canvas.height = currentMap.length * TILE_SIZE;

  // 4. Spawn Pac-Man (Random + Xóa kẹo)
  const spawn = findRandomSpawnPoint(currentMap);
  pacMan.x = spawn.x;
  pacMan.y = spawn.y;
  pacMan.dx = 0;
  pacMan.dy = 0;
  pacMan.nextDx = 0;
  pacMan.nextDy = 0;
  pacMan.rotation = "right";
  currentMap[pacMan.y][pacMan.x] = 3; // Xóa kẹo để điểm là 0

  // 5. Spawn Ghosts
  ghosts = spawnGhosts(currentMap);

  // 6. Start Loop ( Chỉnh tốc độ ở đây)
  gameInterval = setInterval(gameLoop, 200);
}

function gameLoop() {
  if (gameOver) return;
  update();
  draw();
}

function update() {
  updatePacman(); // Logic Pacman nằm ở file Pacman.js
  // updateGhosts(); // Logic Ma sẽ thêm sau
}

function draw() {
  // Xóa màn hình
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const rows = currentMap.length;
  const cols = currentMap[0].length;

  // Vẽ Map
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = currentMap[y][x];
      // Vẽ nền đen
      if (cell !== 1) {
        ctx.fillStyle = "black";
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }

      if (cell === 1) {
        ctx.fillStyle = currentWallColor;
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      } else if (cell === 2) {
        ctx.fillStyle = "#444";
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      } else if (cell === 0) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(
          x * TILE_SIZE + TILE_SIZE / 2,
          y * TILE_SIZE + TILE_SIZE / 2,
          2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  }

  // Vẽ thực thể
  drawPacman();
  drawGhosts();
}

// --- SỰ KIỆN INPUT ---
document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  switch (e.key) {
    case "ArrowLeft":
      pacMan.nextDx = -1;
      pacMan.nextDy = 0;
      break;
    case "ArrowRight":
      pacMan.nextDx = 1;
      pacMan.nextDy = 0;
      break;
    case "ArrowUp":
      pacMan.nextDx = 0;
      pacMan.nextDy = -1;
      break;
    case "ArrowDown":
      pacMan.nextDx = 0;
      pacMan.nextDy = 1;
      break;
  }
});

// Khởi chạy khi DOM load xong
document.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  scoreEl = document.getElementById("scoreDisplay");
  startGame();
});
