import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../db/sequelize';

// 인터페이스 정의
export interface IMember {
  MID: string;
  MPW?: string;
  MEMBERNAME: string | null;
}

export interface MemberAttributes {
  MID: string;
  MPW: string;
  MEMBERNAME: string | null;
}

export interface MemberCreationParams {
  MID: string;
  MPW: string;
  MEMBERNAME?: string | null;
}

export interface MemberLoginParams {
  MID: string;
  MPW: string;
}

export interface MemberUpdateParams {
  MPW?: string;
  MEMBERNAME?: string;
}

// Sequelize 모델 정의 및 초기화를 한 번에 수행
export class Member extends Model<MemberAttributes, MemberCreationParams> implements MemberAttributes {
  public MID!: string;
  public MPW!: string;
  public MEMBERNAME!: string | null;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 모델 초기화
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
  timestamps: true
});
