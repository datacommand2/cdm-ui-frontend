import React from 'react';

import { Detail } from '../../../../component/common/Detail/Detail';
import { findLastWord } from '../../../../../libs/utils/commonFunction';
import TableChip from '../../../../component/common/Chip/TableChip';

const options = [
    {
        value: 'tenants',
        label: '프로젝트',
        protection: 'protection_cluster_tenant',
        recovery: 'recovery_cluster_tenant_mirror_name',
        type: 'mirroring',
    },
    {
        value: 'availability_zones',
        label: '가용구역',
        protection: 'protection_cluster_availability_zone',
        recovery: 'recovery_cluster_availability_zone',
        type: 'mapping',
    },
    {
        value: 'external_networks',
        label: '네트워크',
        protection: 'protection_cluster_external_network',
        recovery: 'recovery_cluster_external_network',
        type: 'mapping',
    },
    {
        value: 'instances',
        label: '인스턴스',
        protection: 'protection_cluster_instance',
        recovery: 'recovery_cluster_hypervisor',
        type: 'mirroring',
    },
    {
        value: 'storages',
        label: '스토리지',
        protection: 'protection_cluster_storage',
        recovery: 'recovery_cluster_storage',
        type: 'mapping',
    },
    {
        value: 'volumes',
        label: '볼륨',
        protection: 'protection_cluster_volume',
        recovery: 'recovery_cluster_storage',
        type: 'mirroring',
    },
];

interface RecoveryInfoProps {
    detail: any;
    value: string;
}

/**
 * 복구계획의 복구정보 컴포넌트
 */
const RecoveryInfo = ({ detail, value }: RecoveryInfoProps) => {
    const data = options.filter(option => option.value === value);

    // mirroing, mapping 나눠서 렌더링
    return (
        <>
            {detail.map((v: any, i: number) => {
                return (
                    <React.Fragment key={i}>
                        <Detail key={`${v.type_code}_i`}>
                            <Detail.Title
                                text={`${data[0].label} - ${v[data[0].protection].name} (${findLastWord(
                                    v.recovery_type_code,
                                )})`}
                            />
                            <Detail.ContentWrapper>
                                <Detail.ContentCell>
                                    <Detail.ContentTitle text={`원본 ${data[0].label}`} />
                                    <Detail.ContentTitle text={`복구 ${data[0].label}`} />
                                </Detail.ContentCell>
                            </Detail.ContentWrapper>
                            {value === 'tenants' && <Tenant tenant={v} data={data} />}
                            {value === 'availability_zones' && <AvZone avzone={v} data={data} />}
                            {value === 'volumes' && <Volume volume={v} data={data} />}
                            {value === 'storages' && <Storage storage={v} data={data} />}
                            {value === 'external_networks' && <Network network={v} data={data} />}
                            {value === 'instances' && <Instance instance={v} data={data} instances={detail} />}
                        </Detail>
                    </React.Fragment>
                );
            })}
        </>
    );
};

export default RecoveryInfo;

const Tenant = ({ tenant, data }: any) => {
    return (
        <>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'이름'} />
                    <Detail.ContentBody>{tenant[data[0].protection].name}</Detail.ContentBody>
                    <Detail.ContentTitle text={'미러링 이름'} />
                    <Detail.ContentBody>{tenant[data[0].recovery]}</Detail.ContentBody>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
        </>
    );
};

const AvZone = ({ avzone, data }: any) => {
    return (
        <>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'이름'} />
                    <Detail.ContentBody>{avzone[data[0].protection].name}</Detail.ContentBody>
                    <Detail.ContentTitle text={'이름'} />
                    <Detail.ContentBody>{avzone[data[0].recovery].name}</Detail.ContentBody>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
        </>
    );
};

const Volume = ({ volume, data }: any) => {
    return (
        <>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'이름'} />
                    <Detail.ContentBody>{volume[data[0].protection].name}</Detail.ContentBody>
                    <Detail.ContentTitle text={''} />
                    <Detail.ContentBody>{}</Detail.ContentBody>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'Status'} />
                    <Detail.ContentBodyDiv>
                        <TableChip
                            label={volume[data[0].protection].status}
                            color={volume[data[0].protection].status}
                        />
                    </Detail.ContentBodyDiv>
                    <Detail.ContentTitle text={''} />
                    <Detail.ContentBody>{}</Detail.ContentBody>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'스토리지 UUID'} />
                    <Detail.ContentBody>{volume[data[0].protection].storage.uuid}</Detail.ContentBody>
                    <Detail.ContentTitle text={'스토리지 UUID'} />
                    <Detail.ContentBody>{volume[data[0].recovery].uuid}</Detail.ContentBody>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'스토리지 타입'} />
                    <Detail.ContentBody>
                        {findLastWord(volume[data[0].protection].storage.type_code)}
                    </Detail.ContentBody>
                    <Detail.ContentTitle text={'스토리지 타입'} />
                    <Detail.ContentBody>{findLastWord(volume[data[0].recovery].type_code)}</Detail.ContentBody>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
        </>
    );
};

const Storage = ({ storage, data }: any) => {
    return (
        <>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'이름'} />
                    <Detail.ContentBody>{storage[data[0].protection].name}</Detail.ContentBody>
                    <Detail.ContentTitle text={'이름'} />
                    <Detail.ContentBody>{storage[data[0].recovery].name}</Detail.ContentBody>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'UUID'} />
                    <Detail.ContentBody>{storage[data[0].protection].uuid}</Detail.ContentBody>
                    <Detail.ContentTitle text={'UUID'} />
                    <Detail.ContentBody>{storage[data[0].recovery].uuid}</Detail.ContentBody>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'Status'} />
                    <Detail.ContentBodyDiv>
                        <TableChip
                            color={storage[data[0].protection].status}
                            label={storage[data[0].protection].status}
                        />
                    </Detail.ContentBodyDiv>
                    <Detail.ContentTitle text={'Status'} />
                    <Detail.ContentBodyDiv>
                        <TableChip color={storage[data[0].recovery].status} label={storage[data[0].recovery].status} />
                    </Detail.ContentBodyDiv>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
        </>
    );
};

const Network = ({ network, data }: any) => {
    return (
        <>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'이름'} />
                    <Detail.ContentBody>{network[data[0].protection].name}</Detail.ContentBody>
                    <Detail.ContentTitle text={'이름'} />
                    <Detail.ContentBody>{network[data[0].recovery].name}</Detail.ContentBody>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'UUID'} />
                    <Detail.ContentBody>{network[data[0].protection].uuid}</Detail.ContentBody>
                    <Detail.ContentTitle text={'UUID'} />
                    <Detail.ContentBody>{network[data[0].recovery].uuid}</Detail.ContentBody>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'유형'} />
                    <Detail.ContentBody>{network[data[0].protection].type_code}</Detail.ContentBody>
                    <Detail.ContentTitle text={'유형'} />
                    <Detail.ContentBody>{network[data[0].recovery].type_code}</Detail.ContentBody>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'Status'} />
                    <Detail.ContentBodyDiv>
                        <TableChip
                            label={network[data[0].protection].status}
                            color={network[data[0].protection].status}
                        />
                    </Detail.ContentBodyDiv>
                    <Detail.ContentTitle text={'Status'} />
                    <Detail.ContentBodyDiv>
                        <TableChip label={network[data[0].recovery].status} color={network[data[0].recovery].status} />
                    </Detail.ContentBodyDiv>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'State'} />
                    <Detail.ContentBodyDiv>
                        <TableChip
                            label={network[data[0].protection].state}
                            color={network[data[0].protection].state}
                        />
                    </Detail.ContentBodyDiv>
                    <Detail.ContentTitle text={'State'} />
                    <Detail.ContentBodyDiv>
                        <TableChip label={network[data[0].recovery].state} color={network[data[0].recovery].state} />
                    </Detail.ContentBodyDiv>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
        </>
    );
};

const Instance = ({ instances, instance, data }: any) => {
    const instancesArr = instances.map((ins: any) => {
        return { id: ins.protection_cluster_instance.id, name: ins.protection_cluster_instance.name };
    });

    const dependencyInstances = (instance: any) => {
        if (instance?.dependencies) {
            let result: any[] = [];
            let dependenciesIns = instance?.dependencies.map((de: any) => {
                return instancesArr.filter((ins: any) => ins.id === de.id)?.[0];
            });

            dependenciesIns.map((ins: any) => {
                result.push(ins.name);
                return ins;
            });
            return result.join(', ');
        } else {
            return '';
        }
    };
    return (
        <>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'이름'} />
                    <Detail.ContentBody>{instance[data[0].protection].name}</Detail.ContentBody>
                    <Detail.ContentTitle text={''} />
                    <Detail.ContentBody>{}</Detail.ContentBody>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'UUID'} />
                    <Detail.ContentBody>{instance[data[0].protection].uuid}</Detail.ContentBody>
                    <Detail.ContentTitle text={''} />
                    <Detail.ContentBody>{}</Detail.ContentBody>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'기동여부'} />
                    <Detail.ContentBody>{instance?.auto_start_flag ? 'O' : 'X'}</Detail.ContentBody>
                    <Detail.ContentTitle text={''} />
                    <Detail.ContentBody>{}</Detail.ContentBody>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'선행 인스턴스'} />
                    <Detail.ContentBody>{dependencyInstances(instance)}</Detail.ContentBody>
                    <Detail.ContentTitle text={''} />
                    <Detail.ContentBody>{}</Detail.ContentBody>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'노드'} />
                    <Detail.ContentBody>{instance[data[0].protection].hypervisor.hostname}</Detail.ContentBody>
                    <Detail.ContentTitle text={'노드'} />
                    <Detail.ContentBody>{instance[data[0].recovery].hostname}</Detail.ContentBody>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'노드 Status'} />
                    <Detail.ContentBodyDiv>
                        <TableChip
                            label={instance[data[0].protection].hypervisor.status}
                            color={instance[data[0].protection].hypervisor.status}
                        />
                    </Detail.ContentBodyDiv>
                    <Detail.ContentTitle text={'노드 Status'} />
                    <Detail.ContentBodyDiv>
                        <TableChip
                            label={instance[data[0].recovery].status}
                            color={instance[data[0].recovery].status}
                        />
                    </Detail.ContentBodyDiv>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'노드 State'} />
                    <Detail.ContentBodyDiv>
                        <TableChip
                            label={instance[data[0].protection].hypervisor.state}
                            color={instance[data[0].protection].hypervisor.state}
                        />
                    </Detail.ContentBodyDiv>
                    <Detail.ContentTitle text={'노드 State'} />
                    <Detail.ContentBodyDiv>
                        <TableChip label={instance[data[0].recovery].state} color={instance[data[0].recovery].state} />
                    </Detail.ContentBodyDiv>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
            <Detail.ContentWrapper>
                <Detail.ContentCell>
                    <Detail.ContentTitle text={'가용구역'} />
                    <Detail.ContentBody>{instance[data[0].protection].availability_zone.name}</Detail.ContentBody>
                    <Detail.ContentTitle text={'가용구역'} />
                    <Detail.ContentBody>{instance[data[0].recovery].availability_zone.name}</Detail.ContentBody>
                </Detail.ContentCell>
            </Detail.ContentWrapper>
        </>
    );
};
