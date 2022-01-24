// eslint-disable-next-line no-undef
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "module-resolver",
        {
          alias: {
            components: "./components",
            hooks: "./hooks",
            screens: "./screens",
            constants: "./constants",
            assets: ["./assets"],
            reduxStates: "./reduxStates",
          },
        },
      ],
    ],
  };
};
