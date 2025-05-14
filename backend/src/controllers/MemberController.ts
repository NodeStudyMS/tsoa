import { Body, Controller, Delete, Get, Path, Post, Put, Route, Response, Tags } from 'tsoa';
import { MemberCreationParams, MemberLoginParams, MemberUpdateParams, IMember } from '../models/Member';
import { MemberService } from '../services/MemberService';

// API 경로를 /members로 지정
@Route('members')
// Swagger 문서에서 'Member' 태그로 이 컨트롤러의 API들을 묶기
@Tags('Member')
export class MemberController extends Controller {
    // MemberService 인스턴스 생성
    private service: MemberService = new MemberService();

    // 모든 회원 목록 조회
    // SELECT MID, MEMBERNAME FROM MEMBER;
    @Get()
    public async getMembers(): Promise<IMember[]> {
        // 모든 회원 정보를 가져옴
        const members = await this.service.getAll();
        // ID와 이름만 반환하도록 매핑함
        return members.map(member => ({
            MID: member.MID,
            MEMBERNAME: member.MEMBERNAME
        }));
    }

    // 특정 회원 한 명의 정보만 조회
    // SELECT MID, MEMBERNAME FROM MEMBER WHERE MID = ?
    @Get('{mid}')
    public async getMember(@Path() mid: string): Promise<IMember> {
        // Path 데코레이터로 URL에서 회원 ID를 받아옴
        const member = await this.service.getById(mid);
        return {
            MID: member.MID,
            MEMBERNAME: member.MEMBERNAME
        };
    }

    // 회원가입 처리
    // INSERT INTO MEMBER (MID, MEMBERNAME, ...) VALUES (?, ?, ...)
    @Post('register')
    public async registerMember(@Body() requestBody: MemberCreationParams): Promise<IMember> {
        const member = await this.service.register(requestBody);
        // 가입 성공 후 기본 정보만 반환
        return {
            MID: member.MID,
            MEMBERNAME: member.MEMBERNAME
        };
    }

    // 로그인
    // 아이디와 비밀번호 확인 후 인증된 회원 정보 반환
    @Post('login')
    public async loginMember(@Body() requestBody: MemberLoginParams): Promise<IMember> {
        // 로그인 정보(아이디, 비밀번호)를 받아서 서비스에 전달
        const member = await this.service.login(requestBody);
        return {
            MID: member.MID,
            MEMBERNAME: member.MEMBERNAME
        };
    }

    // 회원정보 수정
    // UPDATE MEMBER SET ... WHERE MID = ?
    @Put('{mid}')
    public async updateMember(
        @Path() mid: string,  
        @Body() requestBody: MemberUpdateParams 
    ): Promise<IMember> {
        // 서비스에 ID와 수정할 정보를 전달
        const member = await this.service.update(mid, requestBody);
        return {
            MID: member.MID,
            MEMBERNAME: member.MEMBERNAME
        };
    }

    // 회원 삭제
    // DELETE FROM MEMBER WHERE MID = ?
    @Delete('{mid}')
    @Response('204', 'No Content')  // 삭제 성공 시 204 반환
    public async deleteMember(@Path() mid: string): Promise<void> {
        // 서비스에 삭제할 회원 ID 전달
        return this.service.delete(mid);
    }
}