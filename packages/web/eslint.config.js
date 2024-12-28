import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { config as tsConfig } from '@typescript-eslint/eslint-plugin'

export default {
	ignores: ['dist'],
	extends: [
		js.configs.recommended,
		...tsConfig.recommended,
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:react-refresh/recommended',
	],
	files: ['**/*.{ts,tsx}'],
	languageOptions: {
		ecmaVersion: 2020,
		globals: globals.browser,
	},
	plugins: {
		'react-hooks': reactHooks,
		'react-refresh': reactRefresh,
	},
	rules: {
		'react/react-in-jsx-scope': 'off',
		...reactHooks.configs.recommended.rules,
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
	},
}
