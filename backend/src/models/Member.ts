// src/models/Member.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

export interface MemberAttributes {
  MID: string;
  MPW: string;
  MEMBERNAME: string | null;
}

export interface MemberCreationParams {
  MID: string;
  MPW: string;
  MEMBERNAME?: string;
}

export interface MemberLoginParams {
  MID: string;
  MPW: string;
}

export interface MemberUpdateParams {
  MPW?: string;
  MEMBERNAME?: string;
}

// Sequelize
export class Member extends Model<MemberAttributes, MemberCreationParams> implements MemberAttributes {
  public MID!: string;
  public MPW!: string;
  public MEMBERNAME!: string | null;
  
  // timestamp field
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // 모델 초기화 메서드
  static initModel(sequelize: Sequelize): typeof Member {
    Member.init({
      MID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      MPW: {
        type: DataTypes.STRING,
        allowNull: false
      },
      MEMBERNAME: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      sequelize,
      tableName: 'member',
      timestamps: true // createdAt, updatedAt 자동 생성
    });
    
    return Member;
  }
}
