// src/controllers/MemberController.ts

import { Body, Controller, Delete, Get, Path, Post, Put, Route, Response, Tags } from 'tsoa';
import { Member, MemberCreationParams, MemberLoginParams, MemberUpdateParams } from '../models/Member';
import { MemberService } from '../services/MemberService';

@Route('members')
@Tags('Member')
export class MemberController extends Controller {
    private service: MemberService = new MemberService();

    // 모든 회원 조회
    @Get()
    public async getMembers(): Promise<Member[]> {
        return this.service.getAll();
    }

    // 특정 회원 조회
    @Get('{mid}')
    public async getMember(@Path() mid: string): Promise<Member> {
        return this.service.getById(mid);
    }

    // 회원가입
    @Post('register')
    public async registerMember(@Body() requestBody: MemberCreationParams): Promise<Member> {
        return this.service.register(requestBody);
    }

    // 로그인
    @Post('login')
    public async loginMember(@Body() requestBody: MemberLoginParams): Promise<Omit<Member, 'MPW'>> {
        return this.service.login(requestBody);
    }

    // 회원정보 수정
    @Put('{mid}')
    public async updateMember(
        @Path() mid: string,
        @Body() requestBody: MemberUpdateParams
    ): Promise<Member> {
        return this.service.update(mid, requestBody);
    }

    // 회원 삭제
    @Delete('{mid}')
    @Response('204', 'No Content')
    public async deleteMember(@Path() mid: string): Promise<void> {
        return this.service.delete(mid);
    }
}
