import { Box, Card, CardContent } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

import CustomCardHeader from '../CardHeader/CustomCardHeader';

interface ContentLayoutProps {
    type: 'detail' | 'list' | 'etc';
    tree?: ReactNode;
    treeHeader?: string;
    content: ReactNode;
    header?: string;
    fullHeight?: boolean;
}

/**
 * layout 타입이 Detail, List, 그 외 나머지인 경우로 구분하여 콘텐츠 바디 레이아웃을 구성한다.
 */
const ContentLayout = ({
    type,
    tree,
    treeHeader = '',
    header = '',
    content,
    fullHeight = true,
}: ContentLayoutProps) => {
    // 1. DetailLayout
    // 2. ListLayout
    // 3. etc Layout (Add, Edit, monitoring...)

    // DetailLayout은 컴포넌트 내부에서 Detail 컴포넌트로 처리한다.
    if (type === 'detail') {
        return <DetailLayout>{content}</DetailLayout>;
    }

    // list 인 경우 Tree + ItemList
    if (type === 'list') {
        return (
            <>
                {tree ? (
                    <ListLayout>
                        <SideBar>
                            <StyledCard variant="outlined">
                                {treeHeader && <CustomCardHeader title={treeHeader} />}
                                <CardContent>{tree}</CardContent>
                            </StyledCard>
                        </SideBar>
                        <DataList>
                            <StyledCard variant="outlined" className="table-list">
                                {header && <CustomCardHeader title={header} />}
                                <CardContent>{content}</CardContent>
                            </StyledCard>
                        </DataList>
                    </ListLayout>
                ) : (
                    <StyledCard variant="outlined" className="table-list">
                        <CustomCardHeader title={header} />
                        <CardContent>{content}</CardContent>
                    </StyledCard>
                )}
            </>
        );
    }
    return (
        <>
            {fullHeight ? (
                <StyledCard variant="outlined">
                    {header && <CustomCardHeader title={header} />}
                    {content}
                </StyledCard>
            ) : (
                <Card variant="outlined">
                    {header && <CustomCardHeader title={header} />}
                    {content}
                </Card>
            )}
        </>
    );
};

export default ContentLayout;

const DetailLayout = styled(Box)`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const ListLayout = styled(Grid2).attrs({
    container: true,
    columns: { xs: 3, sm: 9, md: 12 },
    spacing: { xs: 1, md: 2 },
})`
    height: 100%;
`;

const SideBar = styled(Grid2).attrs({ xs: 3, sm: 9, md: 3 })`
    & > div {
        height: 100%;
    }
`;
const DataList = styled(Grid2).attrs({ xs: 3, sm: 9, md: 9 })``;

const StyledCard = styled(Card).attrs({ variant: 'outlined' })`
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;

    & form {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
    }

    & .MuiCardContent-root {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
    }
`;
