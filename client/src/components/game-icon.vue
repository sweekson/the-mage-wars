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
    depth: {
      type: Number,
      default: 1,
    },
    size: {
      type: String,
      default: 'md',
    },
    shape: {
      type: String,
      default: 'square',
    },
    bordered: {
      type: Boolean,
    },
  },
};
</script>


<template>
  <span
    :class="[
      'game-icon-item',
      'game-icon-' + shape,
      { 'game-icon-bordered': bordered },
    ]"
  >
    <span
      :class="[
        'game-icon',
        'game-icon-' + name,
        'game-icon-' + size,
        'game-icon-color-' + color,
        'game-icon-depth-' + depth,
      ]"
    />
  </span>
</template>
