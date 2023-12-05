import { Signal } from '@preact/signals-react';
import { getI18n } from "react-i18next";

import {
    ServiceConfig,
    ServiceConfigKey,
    ServiceConfigLevel,
    ServiceConfigStorePeriod,
    ServiceNode,
} from '@/@types/Cloud/config';

export interface DefaultValue {
    level: ServiceConfigLevel;
    type: ServiceNode;
    period: ServiceConfigStorePeriod;
}

// 조광제: 2023-11-13
// NOTE: period 값은 항상 string 이어야 한다. 그래야 서버에서 에러가 발생하지 않는다.
export const defaultValues: DefaultValue = { level: 'info', type: 'single', period: '30' };

export const periodValidate = {
    required: {
        value: true,
        message: getI18n().t('FORM.VALIDATION.REQUIRED'),
    },
    min: {
        value: '1',
        message: '최솟값은 1 입니다.',
    },
    max: {
        value: '30',
        message: '최솟값은 30 입니다.',
    },
};

export const initServices = (type: ServiceConfigKey, services: ServiceConfig<ServiceConfigKey>[]) => {
    if (type === 'service_log_type') {
        return services.map(service => {
            return { ...service, value: 'single' };
        });
    } else if (type === 'service_log_level') {
        return services.map(service => {
            return { ...service, value: 'info' };
        });
    } else {
        return services.map(service => {
            return { ...service, value: 30 };
        });
    }
};

export const getSubmitHandler =
    (
        type: ServiceConfigKey,
        targetData: Signal<ServiceConfig<ServiceConfigKey>[]>,
        services: ServiceConfig<ServiceConfigKey>[],
        openModal: Signal<boolean>,
    ) =>
    (data: DefaultValue) => {
        if (type === 'service_log_level') {
            targetData.value = services.map(service => {
                return { ...service, value: data.level };
            });
        } else if (type === 'service_log_store_period') {
            targetData.value = services.map(service => {
                return { ...service, value: data.period };
            });
        } else {
            targetData.value = services.map(service => {
                return { ...service, value: data.type };
            });
        }

        openModal.value = true;
    };
