import {
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Typography,
} from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

/**
 * 기본 TextField
 */
const DefaultTextField = ({
    label,
    type = 'text',
    onChange,
    name,
    helperText = ' ',
    value,
    onBlur,
    required = false,
    error = false,
    disabled = false,
    rows = 3,
    multiline = false,
    placeholder = '',
    maxLength = 9999,
    hint = '',
    size = 'small',
    defaultShowErrorText = true,
    isCluster = false,
    clusterState = '',
    onReset = () => {},
}) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const preventEnterKey = e => {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    };

    const handleClickShowPassword = () => setShowPassword(show => !show);

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    return (
        <FormControl error={error} required={required}>
            {label && <Label>{label}</Label>}
            <Input
                id={`custom-outlined-input_${name}_${label}`}
                disabled={disabled}
                name={name}
                size={size}
                multiline={multiline}
                type={showPassword ? (type === 'password' ? 'text' : type) : type}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                rows={multiline ? rows : 1}
                startAdornment={<ClusterState isCluster={isCluster} state={clusterState} />}
                inputProps={{
                    maxLength,
                }}
                endAdornment={
                    <InputAdornment position="end">
                        {(type === 'text' || type === 'password' || type === 'tel') && !disabled && value !== '' && (
                            <IconButton edge="end" onClick={onReset}>
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
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                        )}
                    </InputAdornment>
                }
                placeholder={placeholder}
                onKeyDown={preventEnterKey}
            />
            {hint && <HintText sx={{ marginBottom: '5px' }}>{hint}</HintText>}
            {defaultShowErrorText ? (
                <FormErrorText sx={{ marginBottom: '5px' }}>{helperText}</FormErrorText>
            ) : (
                error && <FormErrorText sx={{ marginBottom: '5px' }}>{helperText}</FormErrorText>
            )}
        </FormControl>
    );
};

export default DefaultTextField;

const Label = styled(FormLabel)`
    font-weight: 700;
    padding-bottom: 5px;
`;

const Input = styled(OutlinedInput)``;

const HintText = styled(Typography).attrs({ variant: 'caption' })`
    padding-left: 5px;
`;
const FormErrorText = styled(FormHelperText)`
    padding-left: 5px;
`;

const ClusterState = ({ isCluster, state }) => {
    let code = '';
    if (state === 'cluster.state.active') {
        code = 'active-cluster';
    } else if (state === 'cluster.state.inactive') {
        code = 'inactive-cluster';
    } else {
        code = 'warning-cluster';
    }

    if (isCluster) {
        return <InputAdornment position="start" sx={{ margin: 0 }} className={code} />;
    } else {
        return null;
    }
};
