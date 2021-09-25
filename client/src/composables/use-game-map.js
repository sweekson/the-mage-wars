import { ref, computed } from 'vue';

export const useGameMap = () => {
  const tiles = ref([
    { type: 1, order: 1, dir: '02', occupied: [1, 0], players: [1] },
    { type: 2, order: 2, dir: '42', occupied: [0, 0], players: [] },
    { type: 1, order: 3, dir: '43', occupied: [1, 2], players: [2] },
    { type: 3, order: 7, dir: '14', occupied: [2, 3], players: [] },
    { type: 1, order: 6, dir: '24', occupied: [1, 0], players: [] },
    { type: 3, order: 5, dir: '23', occupied: [2, 0], players: [] },
    { type: 2, order: 9, dir: '13', occupied: [0, 0], players: [3] },
    { type: 1, order: 13, dir: '12', occupied: [3, 0], players: [] },
    { type: 2, order: 14, dir: '41', occupied: [0, 0], players: [] },
    { type: 1, order: 10, dir: '32', occupied: [2, 0], players: [] },
    { type: 3, order: 11, dir: '43', occupied: [1, 0], players: [] },
    { type: 2, order: 15, dir: '12', occupied: [2, 3], players: [] },
    { type: 1, order: 16, dir: '41', occupied: [1, 0], players: [] },
    { type: 3, order: 12, dir: '31', occupied: [0, 0], players: [] },
    { type: 2, order: 8, dir: '31', occupied: [2, 0], players: [] },
    { type: 2, order: 4, dir: '30', occupied: [3, 3], players: [] },
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

  move(player1);

  return {
    tiles,
    size,
    width,
  };
};
