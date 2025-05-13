// src/models/Board.ts

export interface Board {
  // ?: 은 선택적이라는 의미
  // BID 같은 경우 auto_increment로 자동상승하기 때문에 선택적으로 할당
  BID?: number;
  BOARDTITLE: string;
  BOARDCONTENT: string;
  BOARDREGDATE?: string;
  MEMBERNAME: string;
}

// 새 게시글 생성할 때 필요한 파라미터 정의
export interface BoardCreationParams {
  BOARDTITLE: string;
  BOARDCONTENT: string;
  MEMBERNAME: string;
}

// 업데이트 할 때 필요한 파라미터 정의
export interface BoardUpdateParams {
  // 셋 중 하나만 업데이트 할 수 있으니 세 개 다 선택적으로 할당
  BOARDTITLE?: string;
  BOARDCONTENT?: string;
  MEMBERNAME?: string;
}
