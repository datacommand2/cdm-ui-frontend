import { Control } from 'react-hook-form';

import { ServiceConfig, ServiceConfigKey } from '@/@types/Cloud/config';
import { DefaultValue } from './utils';
import { Signal } from '@preact/signals-react';

export interface AddServiceConfigProps {
    open: boolean;
    type: ServiceConfigKey;
    onClose: () => void;
    services: ServiceConfig<ServiceConfigKey>[];
    title: string;
    service: '로그 타입' | '로그 레벨' | '로그 보유 기간 (일)' | undefined;
}

export interface EditServiceConfigProps {
    open: boolean;
    onClose: () => void;
    services: ServiceConfig<ServiceConfigKey>[];
    title: string;
    type: ServiceConfigKey;
}

export interface ServiceConfigDialogProps {
    title: string;
    textTitle: string;
    body: string;
    open: boolean;
    isLoading: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export interface ServiceLogLevelFormGroupProps {
    disabled: boolean;
    control: Control<DefaultValue, any>;
    onChange?: (params: any) => void;
}

export interface ServiceLogStorePeriodFormGroupProps {
    control: Control<DefaultValue, any>;
    onChange?: (params: any) => void;
    rules: any;
}

export interface ServiceLogTypeFormGroupProps {
    disabled: boolean;
    control: Control<DefaultValue, any>;
    onChange?: (params: any) => void;
}

export interface ServiceConfigDialogActionProps {
    disabled?: boolean;
    buttonType: any;
    onClick: () => void;
}

export interface ServiceConfigFormGroupProps {
    type: string;
    isLoading: boolean;
    control: Control<DefaultValue>;
    periodValidate: any;
    onLogLevelChange?: (params: any) => void;
    onLogStorePeriodChange?: (params: any) => void;
    onLogTypeChange?: (params: any) => void;
}

export interface CreateColumnsProps {
    type: string;
    service: '로그 타입' | '로그 레벨' | '로그 보유 기간 (일)' | undefined;
    services: ServiceConfig<ServiceConfigKey>[];
    checkedServices: Signal<ServiceConfig<ServiceConfigKey>[]>;
}
