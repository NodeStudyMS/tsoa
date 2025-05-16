// backend/src/models/member.ts

import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../db/sequelize";

// 인터페이스 정의
export interface IMember {
  MID: string;
  MPW?: string;
  MEMBERNAME: string | null;
  MROLE: string;
}

export interface MemberAttributes {
  MID: string;
  MPW: string;
  MEMBERNAME: string | null;
  MROLE: string;
}

export interface MemberCreationParams {
  MID: string;
  MPW: string;
  MEMBERNAME?: string | null;
  MROLE?: string;
}

export interface MemberLoginParams {
  MID: string;
  MPW: string;
}

export interface MemberUpdateParams {
  MPW?: string;
  MEMBERNAME?: string;
  MROLE?: string;
}

// Sequelize 모델 정의 및 초기화를 한 번에 수행
export class Member
  extends Model<MemberAttributes, MemberCreationParams>
  implements MemberAttributes
{
  public MID!: string;
  public MPW!: string;
  public MEMBERNAME!: string | null;
  public MROLE!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // toString override
  toString(): string {
    return `Member(MID: ${this.MID}, MEMBERNAME: ${this.MEMBERNAME}, MROLE: ${this.MROLE})`;
  }
}

// 모델 초기화
Member.init(
  {
    MID: {
      type: DataTypes.STRING(30),
      primaryKey: true,
      allowNull: false,
    },
    MPW: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    MEMBERNAME: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    MROLE: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "user",
    },
  },
  {
    sequelize,
    tableName: "member",
    timestamps: true,
  }
);
