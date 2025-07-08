import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // 忽略未使用的变量错误，特别是 catch 块中的 error 参数
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_|error"
        }
      ],
      // 忽略 HTML 实体转义警告
      "react/no-unescaped-entities": "off",
      // 将 useEffect 依赖项检查设为警告而不是错误
      "react-hooks/exhaustive-deps": "warn",
      // 忽略不必要的 Link 警告（在某些情况下我们可能需要使用 a 标签）
      "@next/next/no-html-link-for-pages": "warn"
    }
  }
];

export default eslintConfig;
