export const urlCheck: RegExp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;

export const checkNamingRule: RegExp = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w_#.-]+$/;

// 핸드폰 정규식
export const phoneRule: RegExp = /[0-9]{3}-[0-9]{4}-[0-9]{4}/g;

export const passwordRule: RegExp = /^(?!@)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#^%*?&])[A-Za-z\d$@$!#^%*?&]{6,16}$/;
