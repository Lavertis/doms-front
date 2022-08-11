import jwtDecode from 'jwt-decode';

export const getRoleFromToken = (token: string): string | null => {
    if (!token)
        return null;

    return getClaimFromToken(token, 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role') as string;
};

export const getClaimFromToken = (token: string, field: string): string | number => {
    const tokenData = jwtDecode(token) as { [key: string]: string | number };
    return tokenData[field];
};

export const isTokenExpired = (token: string): boolean => {
    const tokenData = jwtDecode(token) as { exp: number };
    const exp = tokenData.exp;
    const now = new Date().getTime() / 1000;
    return exp < now;
};