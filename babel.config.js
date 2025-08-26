// babel.config.js
module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }], // Expo + JSX do NativeWind
            "nativewind/babel",                                       // <-- como PRESET
        ],
        plugins: [
            "expo-router/babel",                                      // Router continua como plugin
        ],
    };
};
