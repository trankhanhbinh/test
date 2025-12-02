// --- LOGIC GHOSTS ---

let ghosts = [];

function spawnGhosts(mapData) {
  let spawnedGhosts = [];
  let colors = ["red", "pink", "orange", "blue"];
  let houseTiles = [];

  // 1. Tìm tất cả ô nhà ma (số 2)
  for (let y = 0; y < mapData.length; y++) {
    for (let x = 0; x < mapData[0].length; x++) {
      if (mapData[y][x] === 2) {
        houseTiles.push({ x: x, y: y });
      }
    }
  }

  if (houseTiles.length === 0) return [];

  // 2. Lấy vị trí giữa danh sách
  let mid = Math.floor(houseTiles.length / 2);

  // 3. Đặt 4 con ma
  // Đỏ (Giữa)
  if (houseTiles[mid])
    spawnedGhosts.push({
      x: houseTiles[mid].x,
      y: houseTiles[mid].y,
      color: colors[0],
      dx: 0,
      dy: 0,
    });

  // Hồng (Trái Đỏ)
  if (houseTiles[mid - 1])
    spawnedGhosts.push({
      x: houseTiles[mid - 1].x,
      y: houseTiles[mid - 1].y,
      color: colors[1],
      dx: 0,
      dy: 0,
    });

  // Cam (Phải Đỏ)
  if (houseTiles[mid + 1])
    spawnedGhosts.push({
      x: houseTiles[mid + 1].x,
      y: houseTiles[mid + 1].y,
      color: colors[2],
      dx: 0,
      dy: 0,
    });

  // Xanh (Phải Cam)
  if (houseTiles[mid + 2])
    spawnedGhosts.push({
      x: houseTiles[mid + 2].x,
      y: houseTiles[mid + 2].y,
      color: colors[3],
      dx: 0,
      dy: 0,
    });

  return spawnedGhosts;
}

function drawGhosts() {
  for (let ghost of ghosts) {
    let img = ghostImages[ghost.color] || ghostImages.red;
    ctx.drawImage(
      img,
      ghost.x * TILE_SIZE,
      ghost.y * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    );
  }
}
