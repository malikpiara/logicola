import nextVitals from 'eslint-config-next/core-web-vitals';
import tseslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';

const config = [
  ...nextVitals,
  ...tseslint.configs['flat/recommended'],
  {
    ignores: ['artifacts/**', 'coverage/**', '.content-collections/**'],
  },
  prettier,
];

export default config;
