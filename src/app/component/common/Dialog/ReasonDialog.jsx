import React from 'react';
import DefaultDialog from './DefaultDialog';
import { useTranslation } from 'react-i18next';

import ActionButton from '../Button/ActionButton';
import DialogText from './DialogText';
import DialogAlert from '../Alert/DialogAlert';

// 상태정보 다이얼로그
const ReasonDialog = ({ data, reasons, open, setOpen }) => {
    const { t } = useTranslation();
    return (
        <DefaultDialog
            maxWidth="xs"
            open={open}
            title={t('DR.RP.STATE_INFO')}
            customActions={<ActionButton buttonType="close" onClick={() => setOpen(false)} />}
        >
            <DialogText title={data.name} />
            {reasons?.reasons && (
                <ul>
                    {reasons.reasons.map((reason, i) => {
                        return (
                            <li key={`${reasons.type}-${reason.code}-${i}`}>
                                <DialogAlert type={reasons.type} message={reason.code} />
                            </li>
                        );
                    })}
                </ul>
            )}
        </DefaultDialog>
    );
};

export default ReasonDialog;
