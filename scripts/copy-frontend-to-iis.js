// scripts/copy-frontend-to-iis.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// IIS 웹사이트 루트 디렉토리 설정 (필요에 따라 변경)
const IIS_ROOT = 'C:\\build';

// 프론트엔드 빌드 디렉토리
const BUILD_DIR = path.join(__dirname, '../backend/src/resources/frontend/build');

try {
  console.log('프론트엔드 빌드 파일을 IIS 디렉토리로 복사 중...');
  
  // IIS 디렉토리가 없으면 생성
  if (!fs.existsSync(IIS_ROOT)) {
    console.log(`IIS 디렉토리 생성: ${IIS_ROOT}`);
    fs.mkdirSync(IIS_ROOT, { recursive: true });
  }
  
  // Windows에서는 xcopy 명령어 사용
  execSync(`xcopy "${BUILD_DIR}\\*" "${IIS_ROOT}\\" /E /Y /I`);
  
  console.log('복사 완료!');
  console.log(`프론트엔드 파일이 ${IIS_ROOT}에 성공적으로 복사되었습니다.`);
  console.log('이제 IIS에서 웹사이트가 실행되어야 합니다.');
} catch (error) {
  console.error('파일 복사 중 오류 발생:', error);
  process.exit(1);
}