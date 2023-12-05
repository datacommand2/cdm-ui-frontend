import { Box, IconButton } from '@mui/material';
import React, { memo, useRef } from 'react';
import { Connection, Handle, Position, Edge } from 'reactflow';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { findLastWord } from '../../../../libs/utils/commonFunction';
import { edgesAtom } from '../../../../recoil/atom/OpenShiftRecoveryPlanAtom';
import StatusCircle from '../../statusBar/StatusCircle';
import { useOnDelete } from './common/hook';

// eslint-disable-next-line react/display-name
export default memo(({ data }: any) => {
    const edges = useRecoilValue(edgesAtom);

    const { onDelete } = useOnDelete(data);
    const nodeRef = useRef<any>();
    const isValidConnection = (connection: Connection) => {
        let storedEdges = [...edges];

        if (storedEdges.length > 0) {
            // 엣지가 존재함
        } else {
            // 엣지가 존재하지 않음
            return true;
        }

        if (connection.source === connection.target) {
            return false;
        }
        let isValid = true;
        const edgeTagets = storedEdges.map((edge: Edge) => edge.target);

        storedEdges.map((edge: Edge) => {
            if (edge.source === connection.target) {
                if (connection.source) {
                    if (edgeTagets.includes(connection.source)) {
                        isValid = false;
                    }
                }
            }
            return edge;
        });
        return isValid;
    };

    let status = findLastWord(data?.state_code);

    let result = findLastWord(data?.result_code);

    return (
        <>
            <Handle
                type="target"
                isConnectable={data?.isConnectable ? true : false}
                position={Position.Left}
                isValidConnection={isValidConnection}
                ref={nodeRef}
            />
            <Wrapper
                className={`node node-${result === 'failed' && status === 'preparing' ? null : result}`}
                onClick={() => {
                    if (data?.onClick) {
                        data.onClick(data.id);
                    }
                }}
            >
                <LabelWrapper>
                    {data.label}
                    {result === 'failed' && status === 'preparing' ? null : result ? (
                        <StatusCircle circle={findLastWord(result)} />
                    ) : (
                        <StatusCircle circle={findLastWord(status)} />
                    )}
                    {data?.deletable && (
                        <IconButton size="small" color="inherit" onClick={onDelete}>
                            <DeleteOutlineIcon />
                        </IconButton>
                    )}
                </LabelWrapper>
            </Wrapper>
            <Handle
                type="source"
                position={Position.Right}
                id={data.label}
                isValidConnection={isValidConnection}
                isConnectable={data?.isConnectable ? true : false}
            />
        </>
    );
});

const LabelWrapper = styled(Box)`
    display: flex;
    column-gap: 10px;
    justify-content: space-between;
    align-items: center;
`;
const Wrapper = styled(Box)`
    display: flex;
    justify-content: space-between;
    word-break: break-all;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid black;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    width: 210px !important;
    flex-direction: column;
`;
