// backend/src/models/Board.ts

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db/sequelize";

// tsoa용 인터페이스 (API 문서 생성용)
export interface Board {
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
  BOARDTITLE?: string;
  BOARDCONTENT?: string;
  MEMBERNAME?: string;
}

// Sequelize 모델 정의 (실제 DB 작업용)
export interface BoardModelAttributes {
  BID: number;
  BOARDTITLE: string;
  BOARDCONTENT: string;
  BOARDREGDATE: Date;
  MEMBERNAME: string;
}

export interface BoardCreationModelAttributes
  extends Optional<BoardModelAttributes, "BID" | "BOARDREGDATE"> {}

// Sequelize 모델 클래스
export class BoardModel
  extends Model<BoardModelAttributes, BoardCreationModelAttributes>
  implements BoardModelAttributes
{
  public BID!: number;
  public BOARDTITLE!: string;
  public BOARDCONTENT!: string;
  public BOARDREGDATE!: Date;
  public MEMBERNAME!: string;

  // Board 인터페이스로 변환하는 메서드 (필요시 사용)
  toDTO(): Board {
    return {
      BID: this.BID,
      BOARDTITLE: this.BOARDTITLE,
      BOARDCONTENT: this.BOARDCONTENT,
      BOARDREGDATE: this.BOARDREGDATE.toISOString(),
      MEMBERNAME: this.MEMBERNAME,
    };
  }
}

// 모델 초기화
BoardModel.init(
  {
    BID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    BOARDTITLE: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    BOARDCONTENT: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    BOARDREGDATE: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    MEMBERNAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Board",
    tableName: "board",
    timestamps: false,
  }
);
