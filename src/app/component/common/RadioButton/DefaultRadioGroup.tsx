import { RadioGroup, styled as MuiStyled } from '@mui/material';
import React, { ChangeEvent } from 'react';
import RadioOptionsAndDesc from './RadioOptionsAndDesc';

interface DefaultRadioGroupProps {
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    [x: string]: any;
    options: { label: string; value: string; desc?: string }[];
    disabled?: boolean;
}

/**
 * 라디오 버튼
 */
const DefaultRadioGroup = ({ name, value, onChange, options, disabled = false, ...rest }: DefaultRadioGroupProps) => {
    return (
        <StyledRadioGroup row name={name} value={value} onChange={onChange} {...rest}>
            <RadioOptionsAndDesc options={options} data={value} disabled={disabled} />
        </StyledRadioGroup>
    );
};

export default DefaultRadioGroup;

const StyledRadioGroup = MuiStyled(RadioGroup)(({ theme }) => ({
    paddingBottom: '2rem',
    paddingTop: '1rem',
    width: '100%',
    justifyContent: 'space-around',
    columnGap: '10px',
    '& .MuiRadio-root': {
        padding: '0',
    },
    // '& > div': {
    //     width: '100%',
    // },
    '& label': {
        borderRadius: '5px',
        margin: '0',
        border: `1px solid ${theme.palette.divider}`,
        padding: '0.7rem 1rem',
        flex: '1 1 auto',
        justifyContent: 'center',
    },
    '& .selected-radio-button': {
        borderRadius: '5px',
        margin: '0',
        border: `1px solid ${theme.palette.primary[theme.palette.mode]} !important`,
        padding: '0.7rem 1rem',
        flex: '1 1 auto',
        justifyContent: 'center',
    },
}));
