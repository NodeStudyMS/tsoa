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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberService = void 0;
const db_1 = __importDefault(require("../db/db"));
class MemberService {
    // 모든 회원 조회
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.query('SELECT MID, MEMBERNAME FROM member');
        });
    }
    // 특정 회원 조회
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query('SELECT MID, MEMBERNAME FROM member WHERE MID = ?', [id]);
            if (result.length === 0) {
                throw new Error(`회원 ID ${id}를 찾을 수 없습니다`);
            }
            return result[0];
        });
    }
    // ID로 회원 조회 (내부용)
    getByMID(mid) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query('SELECT * FROM member WHERE MID = ?', [mid]);
            return result.length > 0 ? result[0] : null;
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
            // 회원 정보 저장 (해싱 없이 원본 비밀번호 저장)
            yield db_1.default.query('INSERT INTO member (MID, MPW, MEMBERNAME) VALUES (?, ?, ?)', [memberParams.MID, memberParams.MPW, memberParams.MEMBERNAME]);
            // 생성된 회원 정보 조회
            return this.getById(memberParams.MID);
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
            // 비밀번호 직접 비교 (해싱 없음)
            if (loginParams.MPW !== member.MPW) {
                throw new Error('ID 또는 비밀번호가 올바르지 않습니다');
            }
            // 비밀번호 제외한 회원 정보 반환
            const { MPW } = member, memberWithoutPassword = __rest(member, ["MPW"]);
            return memberWithoutPassword;
        });
    }
    // 회원정보 수정
    update(id, memberParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const updates = [];
            const values = [];
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
            yield db_1.default.query(`UPDATE member SET ${updates.join(', ')} WHERE MID = ?`, values);
            return this.getById(id);
        });
    }
    // 회원 삭제
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query('DELETE FROM member WHERE MID = ?', [id]);
            if (result.affectedRows === 0) {
                throw new Error(`회원 ID ${id}를 찾을 수 없습니다`);
            }
        });
    }
}
exports.MemberService = MemberService;
