// 오픈스택 템플릿 관련 API

import { AddInstanceTemplateProps } from '../../@types';
import { DELETE, GET, POST } from '../../libs/utils/axios';

/**
 * 인스턴스 템플릿 목록을 조회하는 함수
 */
export const _getInstanceTemplates = async () => {
    return await GET('/recovery/templates');
};

/**
 * 인스턴스 템플릿을 조회하는 함수
 */
export const _getInstanceTemplate = async (templateID: number) => {
    return await GET(`/recovery/templates/${templateID}`);
};

/**
 * 인스턴스 템플릿을 삭제하는 함수
 */
export const _deleteInstanceTemplate = async (templateID: number) => {
    return await DELETE(`/recovery/templates/${templateID}`);
};

/**
 * 인스턴스 템플릿을 등록하는 함수
 */
export const _addInstanceTemplate = async (instance_template: AddInstanceTemplateProps) => {
    return await POST('/recovery/templates', { template: instance_template });
};
