import { checkNamingRule, phoneRule } from './regex';
import { TFunction } from 'i18next';

/**
 * validation 생성 함수
 */
const createValidation = (t: TFunction) => {
    return {
        AccountValiate: {
            required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
            maxLength: { value: 18, message: t('FORM.VALIDATION.ACCOUNT_REQ') },
            minLength: { value: 5, message: t('FORM.VALIDATION.ACCOUNT_REQ') },
            pattern: {
                value: checkNamingRule,
                message: t('FORM.VALIDATION.SPECIAL.CHARACTER'),
            },
        },
        NameValidate: {
            required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
            maxLength: { value: 18, message: t('FORM.VALIDATION.NAME_REQ') },
            minLength: { value: 2, message: t('FORM.VALIDATION.NAME_REQ') },
            pattern: {
                value: checkNamingRule,
                message: t('FORM.VALIDATION.SPECIAL.CHARACTER'),
            },
        },
        DepartmentValidate: {
            maxLength: { value: 30, message: t('FORM.VALIDATION.DEPARTMENT_MAX') },
        },
        PositionValidate: {
            maxLength: { value: 30, message: t('FORM.VALIDATION.DEPARTMENT_MAX') },
        },
        EmailValidate: {
            maxLength: { value: 50, message: t('FORM.VALIDATION.EMAIL_MAX') },
            pattern: {
                value: /\S+@\S+\.\S+/,
                message: t('FORM.VALIDATION.EMAIL_EMAIL'),
            },
        },
        ContactValidate: {
            minLength: { value: 7, message: t('FORM.VALIDATION.PHONE_NUMBER') },
            maxLength: { value: 13, message: t('FORM.VALIDATION.PHONE_NUMBER') },
            pattern: {
                value: phoneRule,
                message: t('FORM.VALIDATION.PHONE_NUMBER'),
            },
        },
    };
};

export default createValidation;
