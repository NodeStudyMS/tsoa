// src/controllers/MemberController.ts

import { Body, Controller, Delete, Get, Path, Post, Put, Route, Response, Tags, Security, Example, Request } from 'tsoa';
import { MemberCreationParams, MemberLoginParams, MemberUpdateParams, IMember } from '../models/Member';
import { MemberService } from '../services/MemberService';
import { generateToken } from '../utils/jwt';
import * as express from 'express';

// API 경로를 /members로 지정
@Route('members')
// Swagger 문서에서 'Member' 태그로 이 컨트롤러의 API들을 묶기
@Tags('Member')
export class MemberController extends Controller {
    // MemberService 인스턴스 생성
    private service: MemberService = new MemberService();

    // 모든 회원 목록 조회
    // GET /members
    @Get()
    // JWT 인증 필요
    @Security('jwt')
    public async getMembers(@Request() request: express.Request): Promise<IMember[]> {
        // 모든 회원 정보 조회
        const members = await this.service.getAll();
        // 민감한 정보 제외하고 필요한 정보만 반환
        return members.map(member => ({
            MID: member.MID,
            MEMBERNAME: member.MEMBERNAME,
            MROLE: member.MROLE
        }));
    }

    // 특정 회원 한 명의 정보만 조회
    // GET /members/{mid}
    @Get('{mid}')
    // JWT 인증 필요
    @Security('jwt')
    public async getMember(
        @Path() mid: string, // 경로 파라미터로 회원 ID 받기
        @Request() request: express.Request
    ): Promise<IMember> {
        // ID로 회원 정보 조회
        const member = await this.service.getById(mid);
        // 민감한 정보 제외하고 필요한 정보만 반환
        return {
            MID: member.MID,
            MEMBERNAME: member.MEMBERNAME,
            MROLE: member.MROLE
        };
    }

    // 회원가입 처리
    // POST /members/register
    // 인증 불필요
    @Post('register')
    @Response<string>(201, '회원가입 성공')
    @Response<Error>(409, '이미 존재하는 사용자')
    @Example<string>("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    public async registerMember(@Body() requestBody: MemberCreationParams): Promise<string> {
        // 기본 역할 설정 (지정되지 않은 경우)
        if (!requestBody.MROLE) {
            requestBody.MROLE = 'user';
        }
        
        // 회원가입 처리
        const member = await this.service.register(requestBody);
        
        // JWT 토큰 생성 (사용자 정보를 토큰 내부에 담음)
        const token = generateToken({
            MID: member.MID,
            MEMBERNAME: member.MEMBERNAME,
            MROLE: member.MROLE
        });
        
        this.setStatus(201); // Created
        return token;
    }

    // 로그인
    // POST /members/login
    // 인증 불필요
    @Post('login')
    @Response<string>(200, '로그인 성공')
    @Response<Error>(401, '인증 실패')
    @Example<string>("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    public async loginMember(@Body() requestBody: MemberLoginParams): Promise<string> {
        // 로그인 정보(아이디, 비밀번호)를 받아서 서비스에 전달
        const member = await this.service.login(requestBody);
        
        // JWT 토큰 생성 (사용자 정보를 토큰 내부에 담음)
        const token = generateToken({
            MID: member.MID,
            MEMBERNAME: member.MEMBERNAME,
            MROLE: member.MROLE
        });
        
        return token;
    }

    // 회원정보 수정
    // PUT /members/{mid}
    @Put('{mid}')
    // JWT 인증 필요
    @Security('jwt')
    public async updateMember(
        @Path() mid: string, // 경로 파라미터로 회원 ID 받기
        @Body() requestBody: MemberUpdateParams,
        @Request() request: express.Request
    ): Promise<IMember> {
        // 회원 정보 업데이트
        const member = await this.service.update(mid, requestBody);
        // 민감한 정보 제외하고 필요한 정보만 반환
        return {
            MID: member.MID,
            MEMBERNAME: member.MEMBERNAME,
            MROLE: member.MROLE
        };
    }

    // 회원 삭제
    // DELETE /members/{mid}
    @Delete('{mid}')
    // JWT 인증 필요
    @Security('jwt')
    @Response('204', 'No Content')
    public async deleteMember(
        @Path() mid: string, // 경로 파라미터로 회원 ID 받기
        @Request() request: express.Request
    ): Promise<void> {
        // 회원 삭제 처리
        return this.service.delete(mid);
    }
    
    // 현재 로그인한 사용자 정보 조회
    // GET /members/me/profile
    @Get('me/profile')
    // JWT 인증 필요
    @Security('jwt')
    public async getMyProfile(@Request() request: express.Request): Promise<IMember> {
        // 인증 확인
        if (!request.user) {
            throw new Error('인증되지 않은 사용자입니다');
        }
        
        // 토큰에서 추출한 사용자 ID로 정보 조회
        const userId = request.user.MID;
        const member = await this.service.getById(userId);
        // 민감한 정보 제외하고 필요한 정보만 반환
        return {
            MID: member.MID,
            MEMBERNAME: member.MEMBERNAME,
            MROLE: member.MROLE
        };
    }
}
