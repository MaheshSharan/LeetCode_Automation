// PM2 Ecosystem Configuration for LeetCode Bot
// Usage: pm2 start ecosystem.config.js

module.exports = {
    apps: [
        {
            name: "leetcode-bot",
            script: "/var/www/leetcode-bot/venv/bin/python",
            args: "-m bot.main",
            cwd: "/var/www/leetcode-bot",

            // Cron pattern: Run at 5:30 AM IST (0:00 UTC) daily
            cron_restart: "0 0 * * *",

            // Don't restart automatically (it's a one-shot task)
            autorestart: false,

            // Keep logs
            error_file: "/var/log/leetcode-bot/error.log",
            out_file: "/var/log/leetcode-bot/output.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss",

            // Environment variables
            env: {
                HEADLESS: "true",
                PROBLEMS_PER_RUN: "2"
            },

            // Max memory restart (optional safety)
            max_memory_restart: "500M"
        }
    ]
};
