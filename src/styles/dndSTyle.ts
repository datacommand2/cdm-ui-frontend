import { css } from 'styled-components';

export const dndSTyles = css`
    .reactflow-wrapper {
        height: calc(100% - 52px);
        .react-flow__node-input,
        .react-flow__node-output {
            font-weight: bold;
            width: 70px;
            height: 70px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            border-width: 2px;
        }
        .custom-instance-node {
            word-break: break-all;
            padding: 10px;
            width: 240px;
            border-radius: 5px;
            border: 1px solid black;
            font-weight: bold;
            background-color: #fff;
            & span {
                height: 100%;
            }
        }
    }
    .dndflow .dndnode {
        height: 20px;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: grab;
    }

    #instance {
        display: none;
    }
`;
