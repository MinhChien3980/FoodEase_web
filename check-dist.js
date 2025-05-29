const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const distPath = path.join(__dirname, "dist");

if (!fs.existsSync(distPath)) {
  console.error(
    'Error: The "dist" folder does not exist. Building the project now...'
  );

  // Run the build command
  try {
    execSync("npm run build", { stdio: "inherit" });
    console.log("Build completed successfully.");
  } catch (error) {
    console.error("Error during build:", error.message);
    process.exit(1);
  }
}

// If the dist folder exists or build was successful, proceed to serve
console.log("Starting the server...");
