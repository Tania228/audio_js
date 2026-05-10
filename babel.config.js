module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                useBuiltIns: "entry",
                corejs: "3.22",
                targets: {
                    node: "current"  
                }
            }
        ]
    ],
    plugins: [
        "@babel/plugin-transform-modules-commonjs"  
    ]
};