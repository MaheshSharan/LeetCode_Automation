// PM2 Ecosystem Configuration for LeetCode Bot
// Usage: pm2 start ecosystem.config.js

module.exports = {
    apps: [
        // Main solver - runs on cron schedule
        {
            name: "leetcode-solver",
            script: "venv/bin/python",
            args: "-m bot.main",
            cwd: "/var/www/leetcode-bot",

            // Cron pattern: Run at 5:30 AM IST (0:00 UTC) daily
            cron_restart: "0 0 * * *",

            // Don't restart automatically (it's a one-shot task)
            autorestart: false,

            // Keep logs
            error_file: "logs/solver-error.log",
            out_file: "logs/solver-output.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss",

            // Environment variables
            env: {
                HEADLESS: "true",
                PROBLEMS_PER_RUN: "2"
            },

            // Max memory restart (optional safety)
            max_memory_restart: "500M"
        },

        // Telegram listener - runs 24/7 for /start, /status commands
        {
            name: "leetcode-listener",
            script: "venv/bin/python",
            args: "-m bot.bot_listener",
            cwd: "/var/www/leetcode-bot",

            // Keep it running always
            autorestart: true,
            restart_delay: 5000,

            // Keep logs
            error_file: "logs/listener-error.log",
            out_file: "logs/listener-output.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss",

            // Very lightweight - limit memory just in case
            max_memory_restart: "100M"
        }
    ]
};
