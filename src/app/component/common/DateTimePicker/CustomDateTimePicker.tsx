import dayjs from 'dayjs';
import React from 'react';
import { DateTimePicker, PickerChangeHandlerContext, DateTimeValidationError } from '@mui/x-date-pickers';
import { styled as MuiStyled, Typography } from '@mui/material';

interface CustomDateTimePickerProps {
    onChange: (value: dayjs.Dayjs | null, context: PickerChangeHandlerContext<DateTimeValidationError>) => void;
    value: dayjs.Dayjs;
    disablePast?: boolean;
    disableFuture?: boolean;
    minDateTime?: dayjs.Dayjs | undefined;
}

/**
 * 연도, 월, 일, 시간, 분 선택
 */
const CustomDateTimePicker = ({
    onChange,
    value,
    disablePast = false,
    minDateTime = undefined,
    disableFuture = false,
    ...props
}: CustomDateTimePickerProps) => {
    const [error, setError] = React.useState<any>(null);

    const errorMessage = React.useMemo(() => {
        switch (error) {
            case 'disablePast': {
                return '현재 시간보다 커야합니다.';
            }
            default: {
                return '';
            }
        }
    }, [error]);

    return (
        <StyledDateTimePicker
            minDateTime={minDateTime}
            disableFuture={disableFuture}
            onChange={onChange}
            value={value}
            disablePast={disablePast}
            timeSteps={{ minutes: 1 }}
            slotProps={{
                textField: {
                    helperText: <Typography>{errorMessage}</Typography>,
                },
            }}
            onError={newError => setError(newError)}
            {...props}
        />
    );
};

export default CustomDateTimePicker;

const StyledDateTimePicker = MuiStyled(DateTimePicker)(() => ({
    '& .MuiInputBase-root': {
        pointerEvents: 'none',
    },
    '& .MuiInputAdornment-root': {
        pointerEvents: 'auto !important',
    },
})) as typeof DateTimePicker;
