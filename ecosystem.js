module.exports = {
    apps: [
        {
            name: "WEB",
            script: "serve",
            args: "-s -l 8081 dist",
            interpreter: "none"
        }
    ]
};
