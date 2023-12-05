import React, { ReactNode } from 'react';
import ButtonProgress from '../../../../../component/common/Button/ButtonProgress';

interface MonitoringButtonProps {
    value: any;
    state: string;
    idleText: string | ReactNode;
    onClick: any;
    operation: any;
}
/**
 * 복구작업 데이터의 진행상황 Progress
 */
const MonitoringButton = ({ value, state, idleText, onClick, operation }: MonitoringButtonProps) => {
    return <ButtonProgress value={value} operation={operation} buttonState={state} text={idleText} onClick={onClick} />;
};

export default MonitoringButton;
