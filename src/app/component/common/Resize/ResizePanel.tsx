import React, { ReactNode } from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import ResizeHandle from './ResizeHandle';

interface GroupProps {
    children: ReactNode;
    direction?: 'horizontal' | 'vertical';
}

const Group = ({ direction = 'horizontal', children }: GroupProps) => {
    return (
        <PanelGroup style={{ flex: '1' }} direction={direction}>
            {children}
        </PanelGroup>
    );
};

interface PaneProps {
    children: ReactNode;
    defaultSize?: number;
    style?: React.CSSProperties;
}

const Pane = ({ defaultSize, style = {}, children }: PaneProps) => {
    return (
        <Panel collapsible style={style} defaultSize={defaultSize}>
            {children}
        </Panel>
    );
};

const PaneHandle = () => {
    return <ResizeHandle />;
};

export const ResizePanel = Object.assign(Group, { Pane, PaneHandle });
