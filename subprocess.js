const { execSync } = require("child_process");

const result = execSync("echo bonjour").toString();
console.log(result);

console.log(execSync("su").toString());
