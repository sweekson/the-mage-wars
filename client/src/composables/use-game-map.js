import { ref, computed } from 'vue';

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

  move(player1);

  return {
    tiles,
    size,
    width,
  };
};
