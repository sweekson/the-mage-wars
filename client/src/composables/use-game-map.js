import { ref, computed } from 'vue';

import { resolveElemsProps } from '@composables/use-game-elems';

export const TileIconColorMap = {
  1: 'red',
  2: 'volcano',
  3: 'yellow',
  4: 'lime',
  5: 'green',
  6: 'turquoise',
  7: 'cyan',
  8: 'navy',
  9: 'purple',
  10: 'magenta',
};

export const resolveTileShape = (tiles, size) => {
  const total = tiles.length;
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

export const useGameMap = ({ client, current }) => {
  const { GamesAPI } = client;
  const size = computed(() => current.value.map.size);
  const tiles = computed(() => {
    const shaped = resolveTileShape(current.value.map.tiles, size.value);
    const colored = resolveElemsProps(shaped);
    return colored;
  });
  const last = computed(() => tiles.value.length - 1);
  const width = computed(() => `${size.value * (72 + 5) - 5}px`);
  const selected = ref(null);
  const update = ({ color, position }) => {
    const previous = tiles.value[position ? position - 1 : last.value];
    const current = tiles.value[position];
    previous.players.splice(previous.players.indexOf(color), 1);
    current.players.push(color);
  };
  const move = (player, moves) => {
    setTimeout(() => {
      moves -= 1;
      player.position += 1;
      player.position > last.value && (player.position = 0);
      update(player);
      moves > 0 && move(player, moves);
    }, 300);
  };
  const onSelect = (tile) => (selected.value = tile);

  GamesAPI.on('move', ({ player }) => {
    setTimeout(() => move(player, current.value.action.moves), 2100);
  });

  return {
    tiles,
    size,
    width,
    selected,
    move,
    onSelect,
  };
};
