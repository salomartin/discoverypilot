import js from "@eslint/js";
import type { Linter } from "eslint";

export default [
  js.configs.recommended,
  {
    name: "discoverypilot/base",
    ignores: ["./build/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Cloudflare Workers globals
        caches: true,
        crypto: true,
        Response: true,
        Request: true,
        Headers: true,
        // Vite dev globals
        process: true,
        __dirname: true,
        // Browser globals
        document: true,
        window: true
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: "warn"
    },
    settings: {
      react: {
        version: "detect"
      },
      formComponents: ["Form"],
      linkComponents: [
        { name: "Link", linkAttribute: "to" },
        { name: "NavLink", linkAttribute: "to" }
      ],
      "import/resolver": {
        typescript: {}
      },
      "import/internal-regex": "^~/",
      "remix/routes-path": "./app/routes"
    }
  },
  {
    name: "discoverypilot/react",
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["./build/**"],
    plugins: {
      react: require("eslint-plugin-react"),
      "jsx-a11y": require("eslint-plugin-jsx-a11y"),
      "react-hooks": require("eslint-plugin-react-hooks"),
      remix: require("eslint-plugin-remix")
    },
    rules: {
      ...js.configs.recommended.rules,
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    }
  },
  {
    name: "discoverypilot/typescript",
    files: ["**/*.{ts,tsx}"],
    ignores: ["./build/**"],
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      import: require("eslint-plugin-import")
    },
    languageOptions: {
      parser: require("@typescript-eslint/parser")
    },
    settings: {
      "import/internal-regex": "^~/",
      "import/resolver": {
        node: {
          extensions: [".ts", ".tsx"]
        },
        typescript: {
          alwaysTryTypes: true
        }
      }
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" }
      ],
      "import/order": ["warn", {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "pathGroups": [
          {
            "pattern": "~/**",
            "group": "internal"
          }
        ]
      }]
    }
  }
] satisfies Linter.Config[];
