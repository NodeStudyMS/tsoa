// src/services/MemberService.ts

import { Member, MemberCreationParams, MemberLoginParams, MemberUpdateParams } from '../models/Member';
import { models } from '../db/sequelize';

export class MemberService {
  // 모든 회원 조회
  public async getAll(): Promise<Member[]> {
    return await Member.findAll({
      attributes: ['MID', 'MEMBERNAME'] // 비밀번호 제외
    });
  }

  // 특정 회원 조회
  public async getById(id: string): Promise<Member> {
    const member = await Member.findByPk(id, {
      attributes: ['MID', 'MEMBERNAME'] // 비밀번호 제외
    });
    
    if (!member) {
      throw new Error(`회원 ID ${id}를 찾을 수 없습니다`);
    }
    return member;
  }

  // ID로 회원 조회 (내부용)
  private async getByMID(mid: string): Promise<Member | null> {
    return await Member.findByPk(mid);
  }

  // 회원가입
  public async register(memberParams: MemberCreationParams): Promise<Member> {
    // ID 중복 체크
    const existingMember = await this.getByMID(memberParams.MID);
    if (existingMember) {
      throw new Error('이미 사용 중인 ID입니다');
    }

    // 회원 정보 저장 (해싱 없이 원본 비밀번호 저장)
    await Member.create({
      MID: memberParams.MID,
      MPW: memberParams.MPW,
      MEMBERNAME: memberParams.MEMBERNAME || undefined
    });

    // 생성된 회원 정보 조회
    return this.getById(memberParams.MID);
  }

  // 로그인
  public async login(loginParams: MemberLoginParams): Promise<Member> {
    // ID로 회원 조회
    const member = await this.getByMID(loginParams.MID);
    if (!member) {
      throw new Error('ID 또는 비밀번호가 올바르지 않습니다');
    }

    // 비밀번호 직접 비교 (해싱 없음)
    if (loginParams.MPW !== member.MPW) {
      throw new Error('ID 또는 비밀번호가 올바르지 않습니다');
    }

    // 비밀번호 필드를 제외한 회원 데이터 반환
    return await Member.findByPk(loginParams.MID, {
      attributes: ['MID', 'MEMBERNAME'] // MPW 제외
    }) as Member;
  }

  // 회원정보 수정
  public async update(id: string, memberParams: MemberUpdateParams): Promise<Member> {
    const member = await this.getByMID(id);
    if (!member) {
      throw new Error(`회원 ID ${id}를 찾을 수 없습니다`);
    }

    const updateData: MemberUpdateParams = {};
    
    if (memberParams.MPW !== undefined) {
      updateData.MPW = memberParams.MPW;
    }

    if (memberParams.MEMBERNAME !== undefined) {
      updateData.MEMBERNAME = memberParams.MEMBERNAME;
    }

    if (Object.keys(updateData).length === 0) {
      return this.getById(id);
    }

    await member.update(updateData);
    return this.getById(id);
  }

  // 회원 삭제
  public async delete(id: string): Promise<void> {
    const result = await Member.destroy({
      where: { MID: id }
    });
    
    if (result === 0) {
      throw new Error(`회원 ID ${id}를 찾을 수 없습니다`);
    }
  }
}
