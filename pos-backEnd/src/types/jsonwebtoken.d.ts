declare module 'jsonwebtoken' {
  export interface JwtPayload {
    id: string;
    [key: string]: any;
  }

  export function sign(payload: string | object | Buffer, secretOrPrivateKey: string, options?: any): string;
  export function verify(token: string, secretOrPublicKey: string): JwtPayload;
  export function decode(token: string): JwtPayload | null;
}