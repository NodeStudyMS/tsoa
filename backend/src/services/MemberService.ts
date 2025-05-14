// src/services/MemberService.ts

import { Member, MemberCreationParams, MemberLoginParams, MemberUpdateParams } from '../models/Member';

export class MemberService {
  // 모든 회원 정보 조회 비밀번호는 보안상 제외
  public async getAll(): Promise<Member[]> {
    return await Member.findAll({
      attributes: ['MID', 'MEMBERNAME'] // 비밀번호 제외
    });
  }

  // 특정 ID 회원 정보 조회 비밀번호 제외
  public async getById(id: string): Promise<Member> {
    const member = await Member.findByPk(id, {
      attributes: ['MID', 'MEMBERNAME'] // 비밀번호 제외
    });
    
    // 회원 없으면 에러 발생
    if (!member) {
      throw new Error(`회원 ID ${id}를 찾을 수 없습니다`);
    }
    return member;
  }

  // ID로 회원 조회하는 내부용 메소드 비밀번호 확인 등에 사용
  private async getByMID(mid: string): Promise<Member | null> {
    return await Member.findByPk(mid);
  }

  // 회원가입 처리 메소드 중복 ID 체크 후 회원 정보 저장
  public async register(memberParams: MemberCreationParams): Promise<Member> {
    // ID 중복 체크
    const existingMember = await this.getByMID(memberParams.MID);
    if (existingMember) {
      throw new Error('이미 사용 중인 ID입니다');
    }

    // 회원 정보 저장
    const newMember = await Member.create({
      MID: memberParams.MID,
      MPW: memberParams.MPW,
      MEMBERNAME: memberParams.MEMBERNAME || null
    });

    // 생성된 회원 정보 조회 비밀번호 제외하고 반환
    return this.getById(newMember.MID);
  }

  // 로그인 처리 메소드 ID와 비밀번호 검증
  public async login(loginParams: MemberLoginParams): Promise<Member> {
    // ID로 회원 조회
    const member = await this.getByMID(loginParams.MID);
    if (!member) {
      throw new Error('ID 또는 비밀번호가 올바르지 않습니다');
    }

    // 비밀번호 직접 비교
    if (loginParams.MPW !== member.MPW) {
      throw new Error('ID 또는 비밀번호가 올바르지 않습니다');
    }

    // 비밀번호 필드 제외한 회원 데이터 반환
    return this.getById(member.MID);
  }

  // 회원정보 수정 메소드 비밀번호와 이름 변경 가능
  public async update(id: string, memberParams: MemberUpdateParams): Promise<Member> {
    const member = await this.getByMID(id);
    if (!member) {
      throw new Error(`회원 ID ${id}를 찾을 수 없습니다`);
    }

    const updateData: MemberUpdateParams = {};
    
    // 비밀번호 변경 요청이 있으면 업데이트 데이터에 추가
    if (memberParams.MPW !== undefined) {
      updateData.MPW = memberParams.MPW;
    }

    // 이름 변경 요청이 있으면 업데이트 데이터에 추가
    if (memberParams.MEMBERNAME !== undefined) {
      updateData.MEMBERNAME = memberParams.MEMBERNAME;
    }

    // 변경할 데이터가 없으면 현재 정보 반환
    if (Object.keys(updateData).length === 0) {
      return this.getById(id);
    }

    // 회원 정보 업데이트 후 결과 반환
    await member.update(updateData);
    return this.getById(id);
  }

  // 회원 삭제 메소드 ID로 회원 삭제
  public async delete(id: string): Promise<void> {
    const result = await Member.destroy({
      where: { MID: id }
    });
    
    // 삭제할 회원이 없으면 에러 발생
    if (result === 0) {
      throw new Error(`회원 ID ${id}를 찾을 수 없습니다`);
    }
  }
}
