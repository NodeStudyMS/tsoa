// scripts/copy-frontend-to-dist.js

const fs = require('fs');
const path = require('path');

// 소스 폴더와 대상 폴더 경로 설정
const sourceDir = path.resolve(__dirname, '../backend/src/public');
const targetDir = path.resolve(__dirname, '../dist/backend/public');

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
  fs.readdirSync(from).forEach(element => {
    const stat = fs.statSync(path.join(from, element));

    if (stat.isFile()) {
      // 파일이면 복사
      fs.copyFileSync(path.join(from, element), path.join(to, element));
      console.log(`파일 복사: ${element}`);
    } else if (stat.isDirectory()) {
      // 폴더면 재귀적으로 복사
      console.log(`폴더 복사 시작: ${element}`);
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

// 프론트엔드 빌드 파일을 dist 폴더로 복사
console.log('프론트엔드 빌드 파일을 dist/backend/public 폴더로 복사 중...');
console.log(`소스 디렉토리: ${sourceDir}`);
console.log(`대상 디렉토리: ${targetDir}`);

// 소스 디렉토리가 존재하는지 확인
if (!fs.existsSync(sourceDir)) {
  console.error(`오류: 소스 디렉토리가 존재하지 않습니다: ${sourceDir}`);
  process.exit(1);
}

// 소스 디렉토리 내용 확인
console.log('소스 디렉토리 내용:');
fs.readdirSync(sourceDir).forEach(file => {
  console.log(` - ${file}`);
});

// 복사 실행
copyFolderSync(sourceDir, targetDir);
console.log('복사 완료!');

// 대상 디렉토리 내용 확인
console.log('대상 디렉토리 내용:');
fs.readdirSync(targetDir).forEach(file => {
  console.log(` - ${file}`);
});