<script>
import { ref } from 'vue';
import { NSpace, NInputGroup, NInput, NButton, NIcon } from 'naive-ui';
import PlusOutlined from '@vicons/material/PlusOutlined';
import MinusOutlined from '@vicons/material/MinusOutlined';

import Flexbox from '@components/flexbox.vue';
import GameIcon from '@components/game-icon.vue';

export default {
  components: {
    NSpace,
    NInputGroup,
    NInput,
    NButton,
    NIcon,
    PlusOutlined,
    MinusOutlined,
    Flexbox,
    GameIcon,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'white',
    },
    value: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      default: 0,
    },
    readonly: {
      type: Boolean,
    },
  },
  emits: ['update'],
  setup(props, { emit }) {
    const amount = ref(String(props.value));
    const increase = () => {
      if (Number(amount.value) === props.limit) return;
      amount.value = String(Number(amount.value) + 1);
      emit('update', Number(amount.value));
    };
    const decrease = () => {
      if (amount.value === '0') return;
      amount.value = String(Number(amount.value) - 1);
      emit('update', Number(amount.value));
    };
    return { amount, increase, decrease };
  },
};
</script>

<template>
  <n-space
    vertical
    :class="[{ 'elem-readonly': readonly }]"
  >
    <flexbox class="elem-type">
      <game-icon
        :name="type"
        :color="color"
        :size="'4xl'"
      />
    </flexbox>

    <div class="elem-footer">
      <flexbox
        v-if="readonly"
        class="elem-amount-readonly"
      >
        {{ amount }}
      </flexbox>

      <n-input-group v-else>
        <n-button
          class="elem-amount-button"
          @click="increase"
          @dblclick.stop
        >
          <n-icon><plus-outlined /></n-icon>
        </n-button>

        <n-input
          :value="`${amount}/${limit}`"
          readonly
          class="elem-amount-input"
        />

        <n-button
          class="elem-amount-button"
          @click="decrease"
          @dblclick.stop
        >
          <n-icon><minus-outlined /></n-icon>
        </n-button>
      </n-input-group>
    </div>
  </n-space>
</template>

<style lang="scss" scoped>
.elem-type {
  background-color: $color-dusk-100;
  border: 1px solid $color-mist-200;
  border-radius: 4px;
  padding: 40px 0;
}
.elem-readonly .elem-type {
  border: 1px solid $color-dusk-200;
}
.elem-amount-button {
  width: 34px;
}
.elem-amount-input {
  font-size: 14px;
  text-align: center;
  width: 80px;
  pointer-events: none;
}
.elem-amount-readonly {
  background-color: $color-dusk-100;
  border: 1px solid $color-dusk-200;
  border-radius: 4px;
  user-select: none;
  color: #eee;
  width: 146px;
  height: 34px;
}
</style>
