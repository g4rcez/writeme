const fs = require("fs");

const lines = [
  `DATABASE_URL=${process.env.DATABASE_URL}`,
  `GITHUB_CLIENT_SECRET=${process.env.GITHUB_CLIENT_SECRET}`,
  `GITHUB_CLIENT_ID=${process.env.GITHUB_CLIENT_ID}`,
  `NEXTAUTH_URL=${process.env.NEXTAUTH_URL}`,
];

fs.writeFileSync(".env", lines.join("\n"), "utf-8");
