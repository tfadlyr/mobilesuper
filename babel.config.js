module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      ["@babel/preset-typescript", { allowDeclareFields: true }],
    ],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "babel-plugin-inline-import",
        {
          extensions: [".svg"],
        },
      ],
    ],
    env: {
      production: {
        plugins: ["react-native-paper/babel"],
      },
    },
  };
};
