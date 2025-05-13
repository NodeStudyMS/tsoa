// src/services/MemberService.ts

import db from '../db/db';
import { Member, MemberCreationParams, MemberLoginParams, MemberUpdateParams } from '../models/Member';

export class MemberService {
  // 모든 회원 조회
  public async getAll(): Promise<Member[]> {
    return await db.query('SELECT MID, MEMBERNAME FROM member');
  }

  // 특정 회원 조회
  public async getById(id: string): Promise<Member> {
    const result = await db.query(
      'SELECT MID, MEMBERNAME FROM member WHERE MID = ?', 
      [id]
    );
    
    if (result.length === 0) {
      throw new Error(`회원 ID ${id}를 찾을 수 없습니다`);
    }
    return result[0];
  }

  // ID로 회원 조회 (내부용)
  private async getByMID(mid: string): Promise<Member | null> {
    const result = await db.query('SELECT * FROM member WHERE MID = ?', [mid]);
    return result.length > 0 ? result[0] : null;
  }

  // 회원가입
  public async register(memberParams: MemberCreationParams): Promise<Member> {
    // ID 중복 체크
    const existingMember = await this.getByMID(memberParams.MID);
    if (existingMember) {
      throw new Error('이미 사용 중인 ID입니다');
    }

    // 회원 정보 저장 (해싱 없이 원본 비밀번호 저장)
    await db.query(
      'INSERT INTO member (MID, MPW, MEMBERNAME) VALUES (?, ?, ?)',
      [memberParams.MID, memberParams.MPW, memberParams.MEMBERNAME]
    );

    // 생성된 회원 정보 조회
    return this.getById(memberParams.MID);
  }

  // 로그인
  public async login(loginParams: MemberLoginParams): Promise<Omit<Member, 'MPW'>> {
    // ID로 회원 조회
    const member = await this.getByMID(loginParams.MID);
    if (!member) {
      throw new Error('ID 또는 비밀번호가 올바르지 않습니다');
    }

    // 비밀번호 직접 비교 (해싱 없음)
    if (loginParams.MPW !== member.MPW) {
      throw new Error('ID 또는 비밀번호가 올바르지 않습니다');
    }

    // 비밀번호 제외한 회원 정보 반환
    const { MPW, ...memberWithoutPassword } = member;
    return memberWithoutPassword;
  }

  // 회원정보 수정
  public async update(id: string, memberParams: MemberUpdateParams): Promise<Member> {
    const updates: string[] = [];
    const values: any[] = [];

    if (memberParams.MPW !== undefined) {
      // 비밀번호  저장 
      updates.push('MPW = ?');
      values.push(memberParams.MPW);
    }

    if (memberParams.MEMBERNAME !== undefined) {
      updates.push('MEMBERNAME = ?');
      values.push(memberParams.MEMBERNAME);
    }

    if (updates.length === 0) {
      return this.getById(id);
    }

    values.push(id);

    await db.query(
      `UPDATE member SET ${updates.join(', ')} WHERE MID = ?`,
      values
    );

    return this.getById(id);
  }

  // 회원 삭제
  public async delete(id: string): Promise<void> {
    const result = await db.query('DELETE FROM member WHERE MID = ?', [id]);
    if (result.affectedRows === 0) {
      throw new Error(`회원 ID ${id}를 찾을 수 없습니다`);
    }
  }
}
