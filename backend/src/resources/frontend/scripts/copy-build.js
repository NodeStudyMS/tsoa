// backend/src/resources/frontend/scripts/copy-build.js

const fs = require("fs");
const path = require("path");

// 빌드 폴더와 대상 폴더 경로 설정
const buildDir = path.resolve(__dirname, "../build");
const targetDir = path.resolve(__dirname, "../../../public");

// 대상 폴더가 없으면 생성
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 파일 복사 함수
function copyFolderSync(from, to) {
  // 대상 폴더가 없으면 생성
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }

  // 소스 폴더의 모든 파일과 폴더 읽기
  fs.readdirSync(from).forEach((element) => {
    const stat = fs.statSync(path.join(from, element));

    if (stat.isFile()) {
      // 파일이면 복사
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else if (stat.isDirectory()) {
      // 폴더면 재귀적으로 복사
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

// 빌드 폴더의 내용을 대상 폴더로 복사
console.log("빌드 파일을 backend/public 폴더로 복사 중...");
copyFolderSync(buildDir, targetDir);
console.log("복사 완료!");
