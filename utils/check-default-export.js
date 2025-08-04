import fs from "fs";
import path from "path";

const PAGES_DIR = path.resolve("src/pages");

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  // Tìm từ khóa export default (đơn giản, không cần parse AST)
  const hasDefaultExport = content.match(/export\s+default\s+/);

  if (!hasDefaultExport) {
    console.warn(`⚠️  Không có "export default" trong: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkDir(fullPath); // Đệ quy cho folder con
    } else if (fullPath.endsWith(".jsx")) {
      checkFile(fullPath);
    }
  }
}

// Chạy script
console.log(`🔍 Đang quét thư mục: ${PAGES_DIR}`);
walkDir(PAGES_DIR);
console.log("✅ Quét xong!");