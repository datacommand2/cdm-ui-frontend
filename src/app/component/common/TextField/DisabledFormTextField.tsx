import { FormControl, FormLabel, OutlinedInput, InputAdornment, Typography, useTheme } from '@mui/material';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { findLastWord } from '../../../../libs/utils/commonFunction';

interface DisabledFormTextFieldProps {
    required?: boolean;
    label?: string | ReactNode;
    value: string | number | undefined;
    name: string;
    state?: string;
}

/**
 * Form에서 항상 Disabled 상태로 정보를 표시하기만 하는 역할
 */
const DisabledFormTextField = ({ required, label, value, name, state }: DisabledFormTextFieldProps) => {
    const theme = useTheme();
    const mode = theme.palette.mode;

    return (
        <FormControl required={required} sx={{ width: '100%', paddingBottom: '1rem' }}>
            {label && <Label>{label}</Label>}
            {state ? (
                <OutlinedInput
                    required={required}
                    size="small"
                    type="text"
                    startAdornment={
                        <InputAdornment position="start">
                            <Typography className={`${mode}-${findLastWord(state)}-cluster`}></Typography>
                        </InputAdornment>
                    }
                    name={name}
                    id={`custom-outlined-input_${name}_${label}`}
                    disabled={true}
                    value={value}
                />
            ) : (
                <OutlinedInput
                    required={required}
                    size="small"
                    type="text"
                    name={name}
                    id={`custom-outlined-input_${name}_${label}`}
                    disabled={true}
                    value={value}
                />
            )}
        </FormControl>
    );
};

export default DisabledFormTextField;

const Label = styled(FormLabel)`
    font-weight: 700;
    padding-bottom: 5px;
`;
