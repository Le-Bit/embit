module.exports = {
  projects: [
    {
      displayName: "api",
      globals: {
        "ts-jest": {
          tsconfig: "./functions/tsconfig.json",
        },
      },
      roots: ["<rootDir>/functions"],
      testMatch: ["**/__tests__/**/*.+(ts|tsx|js)"],
      transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
      },
    },
    {
      displayName: "vue",
      preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
      transform: {
        "^.+\\.vue$": "vue-jest",
      },
      modulePathIgnorePatterns: ["<rootDir>/functions/"],
    },
  ],
};
