import { ref, computed } from 'vue';

export const resolveTileShape = (tiles) => {
  const total = tiles.length;
  const size = Math.sqrt(tiles.length);
  // 1=Up, 2=Right, 3=Down, 4=Left
  // order1=Previous Tile, order2=Current Tile, order3=Next Tile
  const resolve1 = (order1, order2, order3) => {
    if (order2 - order1 === size) return 1;
    if (order2 - order3 === size) return 1;
    return 0;
  };
  const resolve2 = (order1, order2, order3) => {
    if (order1 - order2 === 1) return 2;
    if (order3 - order2 === 1) return 2;
    return 0;
  };
  const resolve3 = (order1, order2, order3) => {
    if (order1 - order2 === size) return 3;
    if (order3 - order2 === size) return 3;
    return 0;
  };
  const resolve4 = (order1, order2, order3) => {
    if (order2 - order1 === 1) return 4;
    if (order2 - order3 === 1) return 4;
    return 0;
  };
  const traverse = (tiles, index) => {
    const tile = tiles[index];
    const order1 = tiles[index - 1]?.order || -1;
    const order2 = tile.order;
    const order3 = tiles[index + 1]?.order || -1;
    const resolved1 = resolve1(order1, order2, order3);
    const resolved2 = resolve2(order1, order2, order3);
    const resolved3 = resolve3(order1, order2, order3);
    const resolved4 = resolve4(order1, order2, order3);
    const shape = [resolved1, resolved2, resolved3, resolved4].join('');
    Object.assign(tile, { shape });
  };
  for (let index = 0; index < total; ++index) traverse(tiles, index);
  return tiles;
};

export const useGameMap = () => {
  const tiles = ref([
    { type: 1, order: 1, occupied: [1, 0], players: [1] },
    { type: 2, order: 2, occupied: [0, 0], players: [] },
    { type: 1, order: 3, occupied: [1, 2], players: [2] },
    { type: 3, order: 7, occupied: [2, 3], players: [] },
    { type: 1, order: 6, occupied: [1, 0], players: [] },
    { type: 3, order: 5, occupied: [2, 0], players: [] },
    { type: 2, order: 9, occupied: [0, 0], players: [3] },
    { type: 1, order: 13, occupied: [3, 0], players: [] },
    { type: 2, order: 14, occupied: [0, 0], players: [] },
    { type: 1, order: 10, occupied: [2, 0], players: [] },
    { type: 3, order: 11, occupied: [1, 0], players: [] },
    { type: 2, order: 15, occupied: [2, 3], players: [] },
    { type: 1, order: 16, occupied: [1, 0], players: [] },
    { type: 3, order: 12, occupied: [0, 0], players: [] },
    { type: 2, order: 8, occupied: [2, 0], players: [] },
    { type: 2, order: 4, occupied: [3, 3], players: [] },
  ]);
  const last = computed(() => tiles.value.length - 1);
  const size = computed(() => Math.sqrt(tiles.value.length));
  const width = computed(() => `${size.value * (72 + 5) - 5}px`);
  const player1 = ref({ uid: 1, position: 0, moves: 6 });
  const update = ({ uid, position }) => {
    const previous = tiles.value[position ? position - 1 : last.value];
    const current = tiles.value[position];
    previous.players.splice(previous.players.indexOf(uid), 1);
    current.players.push(uid);
  };
  const move = (player) => {
    setTimeout(() => {
      player.value.position += 1;
      player.value.moves -= 1;
      player.value.position > last.value && (player.value.position = 0);
      update(player.value);
      player.value.moves && move(player);
    }, 300);
  };

  tiles.value = resolveTileShape(tiles.value);

  move(player1);

  return {
    tiles,
    size,
    width,
  };
};
