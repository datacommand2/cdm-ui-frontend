import dayjs from 'dayjs';
import cryptojs from 'crypto-js';
import duration from 'dayjs/plugin/duration';
import { TEXT } from '../../constant/text';
dayjs.extend(duration);

/**
 * ### property를 기준으로 2차원 객체 배열을 정렬하는 함수
 */
const sortObjectArray = <T>(arr: T[], property: keyof T): T[] => {
    if (arr.length === 0) {
        return [];
    }
    const result = arr.sort((a: T, b: T) => {
        if (a[property] < b[property]) return -1;
        if (a[property] > b[property]) return 1;
        return 0;
    });
    return result;
};

/**
 * ### 절대경로 함수
 */
// const toAbsoluteUrl = (pathname: string): string => process.env.PUBLIC_URL + pathname;

/**
 * ### 숫자를 받아서 hour:minute:second 형식으로 변환하는 함수
 */
const formatToHHmmss = (value: number, time: 'second' | 'minute' | 'hour') => {
    let duration;

    switch (time) {
        case 'second':
            duration = dayjs.duration(value, 'seconds');
            break;
        case 'minute':
            duration = dayjs.duration(value, 'minutes');
            break;
        case 'hour':
            duration = dayjs.duration(value, 'hours');
            break;
        default:
            throw new Error('Invalid time unit');
    }

    const hours = duration.hours().toString().padStart(2, '0');
    const mins = duration.minutes().toString().padStart(2, '0');
    const secs = duration.seconds().toString().padStart(2, '0');

    return `${hours}:${mins}:${secs}`;
};

/**
 * ### 문자열을 '.' 으로 분리한 후 제일 마지막 단어를 찾는 함수
 */
const findLastWord = (str: string | undefined): string => {
    if (str === undefined) {
        return '';
    }
    const words = str.split('.');
    return words[words.length - 1];
};

/**
 * ### 복구작업 생성, 수정 가능한지 체크하는 함수
 * @param recoveryCluster 복구 클러스터 상태 (active, inactive, warning)
 * @param planState 복구계획 상태 (normal, warning)
 * @param mirrorState 복구계획 미러링 상태 (prepare, mirroring, paused, stopped, warning)
 * @returns true | false
 */
const isAddableJob = (recoveryCluster: string, planState: string, mirrorState: string): boolean => {
    if (findLastWord(recoveryCluster) === 'inactive') {
        return false;
    }
    if (findLastWord(planState) === 'warning') {
        return false;
    }
    if (findLastWord(mirrorState) === 'mirroring' || findLastWord(mirrorState) === 'prepare') {
        return true;
    } else {
        // 생성 불가
        return false;
    }
};

/**
 * ### unix timestamp를 YYYY.MM.DD HH:mm:ss 형식으로 변환하는 함수
 * @param unixTimestamp unix 값을 입력받는다.
 */
const formatUnixTimestamp = (unixTimestamp: number | undefined): string => {
    if (!unixTimestamp) return '-';
    if (unixTimestamp > 10_000_000_000_000) return '-';
    return `${dayjs.unix(unixTimestamp).format('YYYY.MM.DD')} ${dayjs.unix(unixTimestamp).format('HH:mm:ss')}`;
};

/**
 * ### AES256으로 암호화된 구문을 decrypt 하는 함수
 * @param encryptedText 암호화된 텍스트
 * @param key decrytion 을 위한 key
 * @param iv decrytion 을 위한 iv
 */
const aesDecryption = (encryptedText: string | undefined, key: string | undefined, iv: string | undefined) => {
    const defaultValue = { method: '', account: '', password: '' };
    if (!encryptedText) return defaultValue;
    if (!key || !iv) return defaultValue;

    const chiper = cryptojs.AES.decrypt(encryptedText, cryptojs.enc.Utf8.parse(key), {
        iv: cryptojs.enc.Utf8.parse(iv),
        mode: cryptojs.mode.CBC,
    });

    const result = JSON.parse(chiper.toString(cryptojs.enc.Utf8));

    return { method: result.methods[0], account: result.password.user.name, password: result.password.user.password };
};

/**
 * ### 타입코드가 분, 시, 일 중에 어떤 타입인지 반환하는 함수
 * @param typeCode 타입코드
 * @example recovery.point.objective.type.minute, recovery.point.objective.type.hour, recovery.point.objective.type.day .. 등
 */
const getTypeFromDate = (typeCode: string): string => {
    if (findLastWord(typeCode) === 'minute' || findLastWord(typeCode) === 'minutely') {
        return 'min';
    }
    if (findLastWord(typeCode) === 'hour' || findLastWord(typeCode) === 'hourly') {
        return 'hour';
    }
    if (findLastWord(typeCode) === 'day' || findLastWord(typeCode) === 'daily') {
        return 'day';
    }
    // default
    return 'min';
};

/**
 * ### 해당하는 문자열에 알맞은 조사를 반환하는 함수
 * ### Usage
 * str: "보호그룹", type: "이가"
 *
 * ### Result
 * "보호그룹이"
 */
const getKoreanAffix = (str: string, type: string): string => {
    const lastChar = str.charCodeAt(str.length - 1);
    const hasLast = (lastChar - 0xac00) % 28;
    switch (type) {
        case '은는':
            return hasLast ? '은' : '는';
        case '을를':
            return hasLast ? '을' : '를';
        case '이가':
            return hasLast ? '이' : '가';
        case '과와':
            return hasLast ? '과' : '와';
        default:
            return ' ';
    }
};

/**
 * ### 유닉스 타임을 'HH:mm:ss' 형식으로 변환하는 함수
 */
const formatTime = (time: number | string): string => {
    const seconds = Number(time);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const timeString = dayjs()
        .set('hour', hours)
        .set('minute', minutes)
        .set('second', remainingSeconds)
        .format('HH:mm:ss');

    return timeString;
};

/**
 * ### bytes to kb, mb, gb ... 변환하는 함수
 */
function formatBytes(bytes: number | undefined, decimals = 2): string | string[] {
    if (bytes === 0) return '0 Bytes';
    if (!bytes) return '-';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    if (i === 0) {
        return [(bytes / Math.pow(k, i)).toFixed(dm), sizes[1]];
    } else {
        return [(bytes / Math.pow(k, i)).toFixed(dm), sizes[i]];
    }
}

interface serviceProps {
    id?: string;
    binary: string;
    host?: string;
    zone?: string;
    status?: string;
    last_updated?: string;
    exception?: boolean;
    deleted?: boolean;
}
/**
 * ### 서비스가 활성화 상태인지 비활성화 상태인지 반환해주는 함수
 */
const isAvailableServices = (services: serviceProps[] | undefined, error: string | undefined): string => {
    if (!services) {
        return '';
    }
    // enabled
    // disabled
    if (services) {
        const result = services.find(service => service.status === 'unavailable' && service?.exception !== true);
        // 내려간 compute가 있으면
        if (result) {
            return TEXT['unavailable'];
        } else {
            return TEXT['available'];
        }
    } else {
        if (error) {
            // 에러가 발생했으면
            return TEXT['error'];
        } else {
            return TEXT['none'];
        }
    }
};

/**
 * ### 휴대폰 번호에 '-'를 붙여주는 함수
 */
export const phoneNumberAutoFormat = (phoneNumber: string): string => {
    const number = phoneNumber.trim().replace(/[^0-9]/g, '');

    if (number.length < 4) return number;
    if (number.length < 7) return number.replace(/(\d{3})(\d{1})/, '$1-$2');
    if (number.length < 11) return number.replace(/(\d{3})(\d{3})(\d{1})/, '$1-$2-$3');
    return number.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
};

/**
 * 글자수를 바이트, 키로바이트로 변환하는 함수
 */
export const stringToBytes = (bytes: number): string => {
    if (bytes < 1024) {
        return `${bytes} B`;
    } else {
        const kilobytes = bytes / 1024;
        return `${kilobytes.toFixed(2)} KB`;
    }
};

/**
 * 슬라이더 시작점 끝점 표시해주는 함수
 */
const sliderMarks = (startValue: number, startLabel: number, endValue: number, endLabel: number) => {
    return [
        {
            value: startValue,
            label: startLabel,
        },
        {
            value: endValue,
            label: endLabel,
        },
    ];
};

interface Item {
    protection_cluster_instance_name?: string;
    name?: string;
    protection_cluster_instance: {
        name?: string;
    };
}
/**
 * 두 배열간의 일치율을 구하는 함수
 */
const calculateMatchingRate = <T extends Item>(arrayA: T[], arrayB: T[]) => {
    if (!arrayB || !arrayA) return 0;
    // const lengthA = arrayA.length;
    // const lengthB = arrayB.length;

    let matchingCount = 0;

    arrayA.forEach(itemA => {
        if (arrayB.find(({ protection_cluster_instance_name }) => protection_cluster_instance_name === itemA.name)) {
            matchingCount++;
        }
    });

    const Denominator = arrayA.length > arrayB.length ? arrayA.length : arrayB.length;
    const matchingRate = (matchingCount / Denominator) * 100;
    return matchingRate;
};

export {
    calculateMatchingRate,
    formatBytes,
    formatTime,
    sortObjectArray,
    formatToHHmmss,
    findLastWord,
    isAddableJob,
    formatUnixTimestamp,
    aesDecryption,
    getTypeFromDate,
    getKoreanAffix,
    isAvailableServices,
    sliderMarks,
};
