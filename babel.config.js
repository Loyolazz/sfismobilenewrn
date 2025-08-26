// babel.config.js
module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }], // Expo + NativeWind
        ],
        plugins: [
            "nativewind/babel", // Mantém apenas o NativeWind
        ],
    };
};
