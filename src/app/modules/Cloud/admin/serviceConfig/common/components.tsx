import { DialogActions, FormGroup, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import { createColumnHelper } from '@tanstack/table-core';

import { OptionType } from '@/@types';
import { ServiceConfig, ServiceConfigKey } from '@/@types/Cloud/config';
import FormTextField from '@component/common/TextField/FormTextField';
import { ServiceConfigKeyLevelOptions, ServiceConfigServiceNodeKeyTypeOptions } from '@constant/selectOptions';
import DefaultSelect from '@component/common/Select/DefaultSelect';
import ActionButton from '@component/common/Button/ActionButton';
import DefaultDialog from '@component/common/Dialog/DefaultDialog';
import DialogText from '@component/common/Dialog/DialogText';
import IndeterminateCheckBox from '@component/common/IndeterminateCheckBox';
import TableChip from '@component/common/Chip/TableChip';

import {
    CreateColumnsProps,
    ServiceConfigDialogActionProps,
    ServiceConfigDialogProps,
    ServiceConfigFormGroupProps,
    ServiceLogLevelFormGroupProps,
    ServiceLogStorePeriodFormGroupProps,
    ServiceLogTypeFormGroupProps,
} from './types';
import { DefaultValue } from './utils';

export const ServiceLogLevelFormGroup = ({ disabled, control, onChange }: ServiceLogLevelFormGroupProps) => {
    return (
        <FormGroup>
            <Controller
                control={control}
                name="level"
                render={({ field }) => {
                    return (
                        <DefaultSelect
                            {...field}
                            label={'레벨'}
                            disabled={disabled}
                            onChange={(option: OptionType) => {
                                onChange && onChange({ field: field, option: option });
                            }}
                            value={ServiceConfigKeyLevelOptions.filter(option => option.value === field.value)[0]}
                            options={ServiceConfigKeyLevelOptions}
                        />
                    );
                }}
            />
        </FormGroup>
    );
};

export const ServiceLogStorePeriodFormGroup = ({ control, onChange, rules }: ServiceLogStorePeriodFormGroupProps) => (
    <FormGroup>
        <FormTextField<DefaultValue>
            name="period"
            control={control}
            customOnChange={onChange}
            type="number"
            hint="1 ~ 30"
            customOnChangeRegExp={/^[\d]{0,2}$/}
            rules={rules}
        />
    </FormGroup>
);

export const ServiceLogTypeFormGroup = ({ disabled, control, onChange }: ServiceLogTypeFormGroupProps) => {
    return (
        <FormGroup>
            <Controller
                control={control}
                name="type"
                render={({ field }) => {
                    return (
                        <DefaultSelect
                            {...field}
                            label={'타입'}
                            disabled={disabled}
                            onChange={(option: OptionType) => {
                                onChange && onChange({ field: field, option: option });
                            }}
                            value={
                                ServiceConfigServiceNodeKeyTypeOptions.filter(option => option.value === field.value)[0]
                            }
                            options={ServiceConfigServiceNodeKeyTypeOptions}
                        />
                    );
                }}
            />
        </FormGroup>
    );
};

export const ServiceConfigDialogActions = ({ disabled, buttonType, onClick }: ServiceConfigDialogActionProps) => {
    return (
        <DialogActions>
            <ActionButton buttonType="cancel" onClick={onClick} />
            <ActionButton type="submit" buttonType={buttonType} disabled={disabled ? true : false} />
        </DialogActions>
    );
};

export const ServiceConfigFormGroup = ({
    type,
    isLoading,
    control,
    periodValidate,
    onLogLevelChange,
    onLogStorePeriodChange,
    onLogTypeChange,
}: ServiceConfigFormGroupProps) => {
    return (
        <>
            {type === 'service_log_level' && (
                <ServiceLogLevelFormGroup disabled={isLoading} control={control} onChange={onLogLevelChange} />
            )}
            {type === 'service_log_store_period' && (
                <ServiceLogStorePeriodFormGroup
                    control={control}
                    rules={periodValidate}
                    onChange={onLogStorePeriodChange}
                />
            )}
            {type === 'service_log_type' && (
                <ServiceLogTypeFormGroup disabled={isLoading} control={control} onChange={onLogTypeChange} />
            )}
        </>
    );
};

export const ServiceConfigDialog = ({
    title,
    textTitle,
    body,
    open,
    isLoading,
    onConfirm,
    onClose,
}: ServiceConfigDialogProps) => {
    return (
        <>
            {open && (
                <DefaultDialog
                    maxWidth="xs"
                    open={open}
                    title={title}
                    onClose={onClose}
                    onConfirm={onConfirm}
                    isLoading={isLoading}
                    actionType="confirm"
                    buttonColor="primary"
                >
                    <DialogText title={textTitle} body={body} />
                </DefaultDialog>
            )}
        </>
    );
};

export const createColumns = ({ type, service, services, checkedServices }: CreateColumnsProps) => {
    const columnHelper = createColumnHelper<ServiceConfig<ServiceConfigKey>>();
    /**
     * 체크박스 클릭 함수
     */
    const onCheckLogTypes = (service: ServiceConfig<ServiceConfigKey>) => {
        if (checkedServices.value.findIndex(({ name }) => name === service.name) >= 0) {
            checkedServices.value = checkedServices.value.filter(({ name }) => name !== service.name);
        } else {
            checkedServices.value = [...checkedServices.value, service];
        }
    };

    return [
        columnHelper.accessor('name', {
            id: 'select',
            header: ({ table }) => (
                <IndeterminateCheckBox
                    {...{
                        checked: checkedServices.value.length !== 0 && services.length === checkedServices.value.length,
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                    onClick={() => {
                        if (services.length === checkedServices.value.length) {
                            // 전체 선택되어 있으면
                            // 전체 선택 해제
                            checkedServices.value = [];
                        } else {
                            // 전체 선택 되어있지 않으면
                            // 전체 선택
                            const rows = table.getRowModel().rows.map(row => row.original);
                            checkedServices.value = [...rows];
                        }
                    }}
                />
            ),
            cell: ({ row }) => (
                <IndeterminateCheckBox
                    {...{
                        name: row.original.name,
                        checked: checkedServices.value.some(({ name }) => name === row.original.name),
                        indeterminate: row.getIsSomeSelected(),
                        onChange: row.getToggleSelectedHandler(),
                    }}
                    onClick={() => {
                        onCheckLogTypes(row.original);
                    }}
                />
            ),
        }),
        columnHelper.accessor('name', {
            header: () => <Typography>서비스 이름</Typography>,
            cell: ({ row }) => <Typography>{row.original.name}</Typography>,
        }),
        columnHelper.accessor('value', {
            header: () => <Typography>{service}</Typography>,
            cell: ({ row }) => {
                if (type === 'service_log_level') {
                    return <TableChip label={row.original.value ?? 'none'} color={row.original.value} />;
                } else {
                    return <Typography>{row.original.value}</Typography>;
                }
            },
        }),
    ];
};
