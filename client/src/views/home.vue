<script>
import Flexbox from '@components/flexbox.vue';

export default {
  components: {
    Flexbox,
  },
}
</script>

<template>
  <Flexbox column full>
    <h1>Welcome</h1>
    <div>
      <button
        v-html="$t('common.signup')"
        type="button"
        class="btn"
        @click="$router.push('/signup')"
      />
      <button
        v-html="$t('common.login')"
        type="button"
        class="btn"
        @click="$router.push('/login')"
      />
    </div>
  </Flexbox>
</template>
