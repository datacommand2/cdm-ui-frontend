import { Box, FormLabel, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { UseFormWatch } from 'react-hook-form';

import DefaultButton from '../../../../component/common/Button/DefaultButton';
import { IFormRecoveryJob } from '../common/type';

interface HypervisorResourceCheckProps {
    hypervisorResource: any;
    setResourceModal: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAvailableHypervisorResource: React.Dispatch<React.SetStateAction<boolean>>;
    watch: UseFormWatch<IFormRecoveryJob>;
}
/**
 * 하이퍼 바이저 리소스를 확인
 */
const HypervisorResourceCheck = ({
    hypervisorResource,
    setResourceModal,
    setIsAvailableHypervisorResource,
    watch,
}: HypervisorResourceCheckProps) => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    return (
        <Wrapper>
            <FormWrapper>
                <Info>
                    <Label className="required">
                        하이퍼바이저 리소스 정보
                        {hypervisorResource ? (
                            hypervisorResource?.usable ? (
                                <span className={`${mode}-success`}> (여유)</span>
                            ) : (
                                <span className={`${mode}-error`}> (부족)</span>
                            )
                        ) : (
                            <span className={`${mode}-error`}> (확인 필요)</span>
                        )}
                    </Label>
                    <div style={{ width: 'fitContent' }}>
                        <DefaultButton
                            type="button"
                            text={'확인'}
                            disabled={watch('plan.id') === 0}
                            onClick={() => {
                                if (watch('recovery_point_snapshot.id') === 0) {
                                    toast.warn('생성된 스냅샷이 없습니다.');
                                } else {
                                    setResourceModal(true);
                                    setIsAvailableHypervisorResource(true);
                                }
                            }}
                        />
                    </div>
                </Info>
            </FormWrapper>
        </Wrapper>
    );
};

export default HypervisorResourceCheck;

const Label = styled(FormLabel)`
    font-weight: 700;
    margin-bottom: 1rem;
`;

const Wrapper = styled(Box)`
    display: flex;
    flex-direction: column;
`;

const FormWrapper = styled(Grid2).attrs({ container: true, columnSpacing: 6 })`
    padding-left: 1rem;
    padding-right: 1rem;
`;

const Info = styled(Grid2).attrs({ xs: 12, md: 4 })``;
