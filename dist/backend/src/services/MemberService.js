"use strict";
// src/services/MemberService.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberService = void 0;
const Member_1 = require("../models/Member");
class MemberService {
    // 모든 회원 조회
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Member_1.Member.findAll({
                attributes: ['MID', 'MEMBERNAME'] // 비밀번호 제외
            });
        });
    }
    // 특정 회원 조회
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield Member_1.Member.findByPk(id, {
                attributes: ['MID', 'MEMBERNAME'] // 비밀번호 제외
            });
            if (!member) {
                throw new Error(`회원 ID ${id}를 찾을 수 없습니다`);
            }
            return member;
        });
    }
    // ID로 회원 조회 (내부용)
    getByMID(mid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Member_1.Member.findByPk(mid);
        });
    }
    // 회원가입
    register(memberParams) {
        return __awaiter(this, void 0, void 0, function* () {
            // ID 중복 체크
            const existingMember = yield this.getByMID(memberParams.MID);
            if (existingMember) {
                throw new Error('이미 사용 중인 ID입니다');
            }
            // 회원 정보 저장
            const newMember = yield Member_1.Member.create({
                MID: memberParams.MID,
                MPW: memberParams.MPW,
                MEMBERNAME: memberParams.MEMBERNAME || null
            });
            // 생성된 회원 정보 조회 (비밀번호 제외)
            return this.getById(newMember.MID);
        });
    }
    // 로그인
    login(loginParams) {
        return __awaiter(this, void 0, void 0, function* () {
            // ID로 회원 조회
            const member = yield this.getByMID(loginParams.MID);
            if (!member) {
                throw new Error('ID 또는 비밀번호가 올바르지 않습니다');
            }
            // 비밀번호 직접 비교
            if (loginParams.MPW !== member.MPW) {
                throw new Error('ID 또는 비밀번호가 올바르지 않습니다');
            }
            // 비밀번호 필드를 제외한 회원 데이터 반환
            return this.getById(member.MID);
        });
    }
    // 회원정보 수정
    update(id, memberParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.getByMID(id);
            if (!member) {
                throw new Error(`회원 ID ${id}를 찾을 수 없습니다`);
            }
            const updateData = {};
            if (memberParams.MPW !== undefined) {
                updateData.MPW = memberParams.MPW;
            }
            if (memberParams.MEMBERNAME !== undefined) {
                updateData.MEMBERNAME = memberParams.MEMBERNAME;
            }
            if (Object.keys(updateData).length === 0) {
                return this.getById(id);
            }
            yield member.update(updateData);
            return this.getById(id);
        });
    }
    // 회원 삭제
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Member_1.Member.destroy({
                where: { MID: id }
            });
            if (result === 0) {
                throw new Error(`회원 ID ${id}를 찾을 수 없습니다`);
            }
        });
    }
}
exports.MemberService = MemberService;
