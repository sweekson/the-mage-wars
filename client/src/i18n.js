import { createI18n } from 'vue-i18n';

export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      common: {
        signup: 'Sign Up',
        login: 'Log In',
        logout: 'Log Out',
        back: 'Back',
        start: 'Start',
        leave: 'Leave',
      },
      game: {
        lobby: 'Lobby',
        create: 'Create',
      },
    },
    ja: {
      common: {
        signup: '登録',
        login: 'ログイン',
        logout: 'ログアウト',
        back: '戻る',
        start: 'スタート',
        leave: '離れる',
      },
      game: {
        lobby: 'ロビー',
        create: '作成',
      },
    },
  },
});
