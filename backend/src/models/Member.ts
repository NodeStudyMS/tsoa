// src/models/Member.ts
export interface Member {
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
