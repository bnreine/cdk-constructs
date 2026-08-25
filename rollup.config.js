export default {
    input: "main.js",
    output: [
        {
            file: "dist/index.js",
            format: "es",
        },
        {
            file: "dist/index.cjs",
            format: "cjs",
        },
    ],
};