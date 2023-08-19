const { execSync } = require("child_process");

const relslt = execSync("echo bonjour").toString();
console.log(relslt);

console.log(execSync("hostname -I | awk '{print $1}'").toString());
