<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'gray',
    },
    size: {
      type: String,
      default: 'md',
    },
    shape: {
      type: String,
      default: 'square',
    },
  },
};
</script>


<template>
  <span
    :class="[
      'game-icon-item',
      'game-icon-' + shape,
    ]"
  >
    <span
      :class="[
        'game-icon',
        'game-icon-' + name,
        'game-icon-' + size,
        'game-icon-color-' + color,
      ]"
    />
  </span>
</template>
