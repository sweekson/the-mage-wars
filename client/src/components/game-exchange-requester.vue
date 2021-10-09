<script>
import { NGrid, NGridItem, NSpace, NDivider, NText } from 'naive-ui';

import Flexbox from '@components/flexbox.vue';
import GameElementSelector from '@components/game-element-selector.vue';
import GameExchangeResponse from '@components/game-exchange-response.vue';

export default {
  components: {
    NGrid,
    NGridItem,
    NSpace,
    NDivider,
    NText,
    Flexbox,
    GameElementSelector,
    GameExchangeResponse,
  },
  inject: ['game'],
};
</script>

<template>
  <section>
    <n-grid
      cols="4"
      x-gap="8"
    >
      <n-grid-item
        v-for="elem in game.me.elems"
        :key="elem.type"
      >
        <game-element-selector
          :type="elem.name"
          :color="elem.color"
          :value="elem.selected"
          :limit="elem.amount"
          :readonly="game.status.isExchange"
          @update="e => game.exchange.onUpdate(elem.type, e)"
        />
      </n-grid-item>
    </n-grid>

    <n-divider />

    <flexbox
      v-if="!game.status.isExchange"
      class="help-message"
    >
      Click the&nbsp;
      <n-text type="success">
        Send Request
      </n-text>
      &nbsp;button after determining the numbers of elements
    </flexbox>

    <n-space
      v-else
      vertical
      class="exchange-responses"
    >
      <flexbox
        v-if="!game.exchange.responses.length"
        class="help-message"
      >
        Waiting for others to reply
      </flexbox>

      <n-grid
        v-else
        cols="1"
        y-gap="8"
        class=""
      >
        <n-grid-item
          v-for="response in game.exchange.responses"
          :key="response.uid"
        >
          <game-exchange-response
            :data="response"
            :selected="game.exchange.selected === response.uid"
            @select="game.exchange.onSelect"
          />
        </n-grid-item>
      </n-grid>
    </n-space>
  </section>
</template>

<style lang="scss" scoped>
.exchange-responses {
  max-height: 200px;
  overflow: auto;
}
.help-message {
  background-color: $color-dusk-100;
  border: 1px solid $color-dusk-200;
  border-radius: 4px;
  padding: 64px 0;
}
</style>
