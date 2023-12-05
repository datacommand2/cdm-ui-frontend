import {
    FormControlLabel,
    IconButton,
    Radio,
    Tooltip,
    Typography,
    styled as MuiStyled,
    tooltipClasses,
    Paper,
} from '@mui/material';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import styled from 'styled-components';

/**
 * RadioOptions, 각 옵션에 대한 설명 컴포넌트
 */
const RadioOptionsAndDesc = ({
    options,
    data,
    disabled = false,
}: {
    options: { value: string; label: string; desc?: string }[];
    data: string;
    disabled: boolean;
}) => {
    return (
        <>
            {options.map(option => {
                return (
                    <div key={option.value} style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
                        <FormControlLabel
                            disabled={disabled}
                            key={option.value}
                            className={data === option.value ? 'selected-radio-button' : ''}
                            value={option.value}
                            control={<Radio />}
                            label={
                                <div style={{ display: 'flex' }}>
                                    <Typography>{option.label}</Typography>
                                    {option.desc && (
                                        <CustomTooltip
                                            title={
                                                <ToolTipWrapper>
                                                    <Typography>{option.desc}</Typography>
                                                </ToolTipWrapper>
                                            }
                                        >
                                            <StyledIconButton>
                                                <div style={{ display: 'flex' }}>
                                                    <HelpOutlinedIcon />
                                                </div>
                                            </StyledIconButton>
                                        </CustomTooltip>
                                    )}
                                </div>
                            }
                        />
                    </div>
                );
            })}
        </>
    );
};

export default RadioOptionsAndDesc;

const StyledIconButton = MuiStyled(IconButton)(() => ({
    padding: '0 5px 0 0',
}));

const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    () => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: 'transparent',
            minWidth: 400,
        },
    }),
);

const ToolTipWrapper = styled(Paper).attrs({ elevation: 3 })`
    padding: 1rem;
`;
