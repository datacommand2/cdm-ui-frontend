import React, { useEffect } from 'react';
import { useResetRecoilState } from 'recoil';

import SideBarTree from '@/app/component/common/SideBarTree/SideBarTree';
import { treeStateAtom, useTreeState } from '@/recoil/atom/Global';
import { useGetOpenStackClusters, useGetProtectionGroupHistories, useGetProtectionGroupTrees } from './hook';

/**
 * 오픈스택 복구계획, 복구작업에서 사용하는 클러스터 목록, 보호그룹 목록을 불러와서 트리를 구성
 */
export const OpenStackPlanAndJobSideBar = () => {
    const [treeState, setTreeState] = useTreeState();
    const resetTreeState = useResetRecoilState(treeStateAtom);

    // 클러스터 목록을 불러오는 함수
    const { data: clusters = [] } = useGetOpenStackClusters();

    // 클러스터 각각의 보호그룹을 불러오는 함수
    const { protectionGroups } = useGetProtectionGroupTrees(clusters);

    useEffect(() => {
        return () => {
            resetTreeState();
        };
    }, [resetTreeState]);

    return (
        <SideBarTree
            parentTitle="클러스터"
            parentList={clusters}
            childrenList={protectionGroups}
            childrenSelect={params => {
                setTreeState({
                    ...treeState,
                    protectionGroupID: params?.id as number,
                });
            }}
        />
    );
};

/**
 * 오픈스택 보호그룹 History 목록으로 TreeView를 구성하는 컴포넌트
 */
export const OpenStackHistorySideBar = () => {
    const [treeState, setTreeState] = useTreeState();
    const resetTreeState = useResetRecoilState(treeStateAtom);

    // 보호그룹 history 조회
    const { data: groupHistory } = useGetProtectionGroupHistories();

    useEffect(() => {
        return () => {
            resetTreeState();
        };
    }, [resetTreeState]);

    return (
        <SideBarTree
            parentTitle="클러스터"
            parentList={groupHistory?.clusters}
            childrenList={groupHistory?.groups}
            childrenSelect={params => {
                setTreeState({
                    ...treeState,
                    protectionGroupID: params?.id as number,
                    protectionGroupName: params?.name as string,
                });
            }}
        />
    );
};

/**
 * 오픈스택 클러스터 목록으로 TreeView를 구성하는 컴포넌트
 */
/**
 * 클러스터 목록으로 TreeView를 구성하는 컴포넌트
 */
export const OpenStackProtectionGroupSideBar = () => {
    const [treeState, setTreeState] = useTreeState();
    const resetTreeState = useResetRecoilState(treeStateAtom);

    // 클러스터 목록을 불러오는 함수
    const { data: clusters = [] } = useGetOpenStackClusters();

    useEffect(() => {
        return () => {
            resetTreeState();
        };
    }, [resetTreeState]);

    return (
        <SideBarTree
            parentList={clusters}
            parentTitle="클러스터"
            parentSelect={params => {
                setTreeState({
                    ...treeState,
                    clusterID: params?.id as number,
                });
            }}
        />
    );
};
