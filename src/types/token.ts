export interface IJwtToken {
    "sub": string,
    "name": string,
    "email": string,
    "role": string,
    "nbf": number,
    "exp": number,
    "iat": number
}