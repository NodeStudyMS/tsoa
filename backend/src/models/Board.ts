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

export interface BoardCreationParams {
  BOARDTITLE: string;
  BOARDCONTENT: string;
  MEMBERNAME: string;
}

export interface BoardUpdateParams {
  BOARDTITLE?: string;
  BOARDCONTENT?: string;
  MEMBERNAME?: string;
}
