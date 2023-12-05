import { FormControl, FormLabel, useTheme } from '@mui/material';
import React, { forwardRef, Ref } from 'react';
import Select, { MenuPlacement } from 'react-select';
import styled from 'styled-components';

interface DefaultSelectProps {
    name: string;
    isLoading?: boolean;
    options?: any;
    required?: boolean;
    error?: boolean;
    label?: string;
    onChange?: any;
    defaultValue?: any;
    disabled?: boolean;
    value?: any;
    menuPlacement?: MenuPlacement;
}
/**
 * Default Select component
 */
const DefaultSelect = forwardRef(
    (
        {
            name = '',
            isLoading = false,
            options = [],
            required = false,
            error = false,
            label = '',
            onChange,
            defaultValue = 'none',
            disabled = false,
            value,
            menuPlacement = 'bottom',
            ...props
        }: DefaultSelectProps,
        ref: Ref<any>,
    ) => {
        const Muitheme = useTheme();
        const mode = Muitheme.palette.mode;

        const dot = (state: any) => {
            if (state === 'cluster.state.warning') {
                return {
                    alignItems: 'center',
                    display: 'flex',
                    ':before': {
                        backgroundColor: Muitheme.palette.warning[mode],
                        borderRadius: 10,
                        content: '" "',
                        display: 'block',
                        height: 10,
                        width: 10,
                        marginLeft: '5px',
                        marginRight: '3px',
                        marginTop: '3px',
                        fontSize: '0.2rem',
                    },
                };
            } else if (state === 'cluster.state.active') {
                return {
                    alignItems: 'center',
                    display: 'flex',
                    ':before': {
                        backgroundColor: Muitheme.palette.success[mode],
                        borderRadius: 10,
                        content: '" "',
                        display: 'block',
                        height: 10,
                        width: 10,
                        marginLeft: '5px',
                        marginRight: '3px',
                        marginTop: '3px',
                        fontSize: '0.2rem',
                    },
                };
            } else {
                return {
                    alignItems: 'center',
                    display: 'flex',
                    ':before': {
                        backgroundColor: Muitheme.palette.error[mode],
                        borderRadius: 10,
                        content: '" "',
                        display: 'block',
                        height: 10,
                        width: 10,
                        marginLeft: '5px',
                        marginRight: '3px',
                        marginTop: '3px',
                        fontSize: '0.2rem',
                    },
                };
            }
        };
        const customStyles = {
            control: (provided: any) => ({
                ...provided,
                minHeight: 35,
                height: 35,
            }),
            option: (styles: any, state: any) => {
                if (state?.data?.cluster_state) {
                    return {
                        ...styles,
                        ...dot(state.data.cluster_state),
                    };
                } else {
                    return {
                        ...styles,
                    };
                }
            },
            singleValue: (styles: any, state: any) => {
                if (state?.data?.cluster_state) {
                    return {
                        ...styles,
                        paddingBottom: '3px',
                        ...dot(state.data.cluster_state),
                    };
                } else {
                    return {
                        ...styles,
                        paddingBottom: '3px',
                    };
                }
            },
        };

        const defaultOptions = [{ value: 0, label: '데이터가 존재하지 않습니다.' }];
        if (options.length === 0) {
            return (
                <FormControl error={error} required={required}>
                    {label && <Label>{label}</Label>}
                    <CustomSelect
                        ref={ref}
                        styles={customStyles}
                        className={`${mode}-react-select`}
                        classNamePrefix={`${mode}-react-select`}
                        isDisabled={true}
                        menuPlacement={menuPlacement}
                        name={name}
                        options={defaultOptions}
                        defaultValue={defaultOptions[0]}
                        isSearchable={false}
                        onChange={e => {
                            if (e === value) {
                                return;
                            } else {
                                onChange(e);
                            }
                        }}
                        menuPortalTarget={document.body}
                        {...props}
                    />
                </FormControl>
            );
        } else {
            return (
                <FormControl error={error} required={required}>
                    {label && <Label>{label}</Label>}
                    <CustomSelect
                        ref={ref}
                        styles={customStyles}
                        className={`${mode}-react-select`}
                        classNamePrefix={`${mode}-react-select`}
                        isDisabled={disabled}
                        menuPlacement={menuPlacement}
                        name={name}
                        options={options}
                        defaultValue={defaultValue === 'none' ? options?.[0] : defaultValue}
                        isSearchable={false}
                        onChange={e => {
                            if (e === value) {
                                return;
                            } else {
                                onChange(e);
                            }
                        }}
                        value={value}
                        menuPortalTarget={document.body}
                        isLoading={isLoading}
                        {...props}
                    />
                </FormControl>
            );
        }
    },
);

export default DefaultSelect;

DefaultSelect.displayName = 'DefaultSelect';

const Label = styled(FormLabel)`
    font-weight: 700;
    padding-bottom: 5px;
`;

const CustomSelect = styled(Select)`
    padding-bottom: 10px;
`;
