/**
 * EJS Syntax Validator
 * Checks if opening and closing EJS tags are balanced
 */

const fs = require("fs");
const path = require("path");

function validateEJSFile(filePath) {
  console.log(`\n🔍 Validating: ${path.basename(filePath)}\n`);

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  let braceStack = [];
  let errors = [];

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Find all EJS tags
    const ejsTags = line.match(/<%[\s\S]*?%>/g) || [];

    ejsTags.forEach((tag) => {
      // Count opening and closing braces in this tag
      const opens = (tag.match(/\{(?![^<]*%>)/g) || []).length;
      const closes = (tag.match(/\}(?![^<]*%>)/g) || []).length;

      // Track if this tag has 'else' without proper closing before it
      if (
        tag.includes("else") &&
        !tag.trim().startsWith("<%") &&
        braceStack.length === 0
      ) {
        errors.push({
          line: lineNum,
          message: `'else' appears outside of proper if-else structure`,
          tag: tag.trim(),
        });
      }

      // Check for multiple closing braces with else
      if (tag.includes("else") && closes > 1) {
        errors.push({
          line: lineNum,
          message: `Multiple closing braces with 'else' - should be separated`,
          tag: tag.trim(),
        });
      }

      // Update brace count
      for (let i = 0; i < opens; i++) braceStack.push(lineNum);
      for (let i = 0; i < closes; i++) {
        if (braceStack.length === 0) {
          errors.push({
            line: lineNum,
            message: `Closing brace without matching opening brace`,
            tag: tag.trim(),
          });
        } else {
          braceStack.pop();
        }
      }
    });
  });

  // Check for unclosed braces
  if (braceStack.length > 0) {
    errors.push({
      line: "Multiple",
      message: `${
        braceStack.length
      } unclosed brace(s). Opened at lines: ${braceStack
        .slice(0, 5)
        .join(", ")}${braceStack.length > 5 ? "..." : ""}`,
      tag: "",
    });
  }

  // Report results
  if (errors.length === 0) {
    console.log("✅ No syntax errors found!");
    console.log(
      `📊 Balanced braces: All opening braces have matching closing braces`
    );
    return true;
  } else {
    console.log("❌ Syntax errors found:\n");
    errors.forEach((err) => {
      console.log(`  Line ${err.line}: ${err.message}`);
      if (err.tag) console.log(`    Tag: ${err.tag}`);
      console.log();
    });
    return false;
  }
}

// Validate packages.ejs
const packagesFile = path.join(__dirname, "views", "listings", "packages.ejs");

if (fs.existsSync(packagesFile)) {
  const isValid = validateEJSFile(packagesFile);

  if (isValid) {
    console.log("\n🎉 File is ready to use!");
    console.log(
      "\n💡 Test at: http://localhost:8080/packages?country=Kazakhstan&budget=5000&currency=USD"
    );
  } else {
    console.log("\n⚠️  Please fix the errors above before testing.");
  }
} else {
  console.log("❌ File not found:", packagesFile);
}
