import {
    FormControl,
    FormLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    FormHelperText,
    Typography,
} from '@mui/material';
import styled from 'styled-components';
import {
    useController,
    Path,
    Control,
    RegisterOptions,
    FieldValues,
    // , UseFormResetField
} from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useCallback } from 'react';
import { useSignal } from '@preact/signals-react';

interface FormTextFieldProps<T extends FieldValues> {
    defaultShowErrorText?: boolean;
    type?: string;
    name: Path<T>;
    disabled?: boolean;
    label?: string;
    required?: boolean;
    error?: boolean;
    hint?: string;
    placeholder?: string;
    size?: 'small' | 'medium' | undefined;

    // TODO: UseFormResetField<T> 타입으로 지정하면 defaultValues 설정이 안됨
    // 타입을 어떻게 지정해야 하는지?
    resetField?: any;
    // resetField: UseFormResetField<T>;
    control: Control<T>;
    rules?: Omit<RegisterOptions<T>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    multiline?: boolean;
    rows?: number;
    customOnChangeRegExp?: any;
    customOnChange?: any;
}

const FormTextField = <T extends FieldValues>({
    type = 'text',
    name,
    control,
    size = 'small',
    ...props
}: FormTextFieldProps<T>) => {
    const showPassword = useSignal(false);
    const {
        field: { value, onChange, onBlur },
        fieldState: { error, invalid },
    } = useController({ name, control, rules: props.rules });

    const handleClickShowPassword = useCallback(() => (showPassword.value = !showPassword.value), [showPassword]);
    const handleMouseDownPassword = useCallback((event: any) => event.preventDefault(), []);

    const { rules, customOnChange, customOnChangeRegExp, resetField, ...rest } = props;

    return (
        <FormControl error={invalid} required={props.required}>
            {props.label && <Label>{props.label}</Label>}
            <OutlinedInput
                {...rest}
                label={''}
                type={showPassword.value ? (type === 'password' ? 'text' : type) : type}
                required={props.required}
                size={size}
                error={invalid}
                name={name}
                id={`custom-outlined-input_${name}_${props.label}`}
                disabled={props.disabled}
                value={value}
                inputProps={{ maxLength: rules?.maxLength }}
                onChange={e => {
                    if (customOnChangeRegExp) {
                        if (e.currentTarget.value.match(customOnChangeRegExp)) {
                            onChange(e);
                            if (customOnChange) {
                                customOnChange(e.currentTarget.value);
                            }
                        }
                    } else {
                        onChange(e);
                        if (customOnChange) {
                            customOnChange(e.currentTarget.value);
                        }
                    }
                }}
                onBlur={onBlur}
                endAdornment={
                    <InputAdornment position="end">
                        {(type === 'text' || type === 'password' || type === 'tel') &&
                            !props.disabled &&
                            value !== '' && (
                                <IconButton edge="end" onClick={() => resetField(name, { defaultValue: '' })}>
                                    <CloseIcon />
                                </IconButton>
                            )}
                        {type === 'password' && (
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword.value ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                        )}
                    </InputAdornment>
                }
            />
            {props.hint && (
                <HintText variant="caption" sx={{ marginBottom: '5px' }}>
                    {props.hint}
                </HintText>
            )}
            {!invalid ? (
                <FormErrorText sx={{ marginBottom: '5px' }}> </FormErrorText>
            ) : (
                <FormErrorText sx={{ marginBottom: '5px' }}>{error?.message}</FormErrorText>
            )}
        </FormControl>
    );
};

export default FormTextField;

const Label = styled(FormLabel)`
    font-weight: 700;
    padding-bottom: 5px;
`;

const FormErrorText = styled(FormHelperText)`
    padding-left: 5px;
    font-size: 1rem;
`;

const HintText = styled(Typography)`
    padding-left: 5px;
    font-size: 1rem;
`;
