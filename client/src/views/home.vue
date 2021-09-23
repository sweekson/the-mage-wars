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
        @click="$router.push('/signup')"
      />
      <button
        v-html="$t('common.login')"
        type="button"
        @click="$router.push('/login')"
      />
    </div>
  </Flexbox>
</template>
