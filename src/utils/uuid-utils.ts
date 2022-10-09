import {parse as parseUuid, stringify as stringifyUuid} from 'uuid';
import {Base64} from 'js-base64';
import {decode as decodeUrlSafe, encode as encodeUrlSafe} from 'url-safe-base64';

export const uuidToBase64 = (uuid: string): string => {
    const uuidBytes = parseUuid(uuid);
    const base64uuid = Base64.fromUint8Array(uuidBytes as Uint8Array);
    const urlSafeBase64Uuid = encodeUrlSafe(base64uuid);
    return urlSafeBase64Uuid.slice(0, -2); // remove padding
};

export const uuidFromBase64 = (base64: string): string => {
    if (!base64) {
        return '';
    }
    const urlSafeBase64Uuid = base64 + '..'; // restore padding
    const base64uuid = decodeUrlSafe(urlSafeBase64Uuid);
    const uuidBytes = Base64.toUint8Array(base64uuid);
    return stringifyUuid(uuidBytes);
};