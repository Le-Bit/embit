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
      presets: ["@babel/preset-env"],
      transform: {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.vue$": "vue-jest",
      },
      moduleFileExtensions: ["ts", "js", "json", "vue"],
      modulePathIgnorePatterns: ["<rootDir>/functions/"],
    },
  ],
};
