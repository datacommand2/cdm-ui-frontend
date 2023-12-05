import React, { useMemo, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    ListItemIcon,
    ListItemText,
    MenuList,
    Typography,
    useTheme,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import MonitorIcon from '@mui/icons-material/Monitor';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import { useTranslation } from 'react-i18next';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { PATHNAME } from '../../../../../constant/pathname';
import useDelete from '../../../../../hooks/useDelete';
import {
    clusterKeys,
    protectionGroupKeys,
    recoveryJobKeys,
    recoveryPlanKeys,
    recoveryResultKeys,
    userGroupKeys,
    userKeys,
} from '../../../../../libs/utils/queryKeys';
import ActionButton from '../../Button/ActionButton';
import DefaultTextField from '../../TextField/DefaultTextField';
import { _logoutUser, _resetUserPassword } from '../../../../../api/cloud/identity';
import DefaultDialog from '../../Dialog/DefaultDialog';
import DialogText from '../../Dialog/DialogText';
import { findLastWord, getKoreanAffix } from '../../../../../libs/utils/commonFunction';

/**
 * 테이블 Actions 컴포넌트
 */
const ActionsFormatter = ({
    data,
    detailEvent,
    addEvent,
    editEvent,
    monitoringEvent,
    isLoading = false,
    role = 'admin',
    type,
    title,
    treeId,
    setQueryData,
    list = [],
    name = '',
}) => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const { t } = useTranslation();
    const location = useLocation();
    // modal
    const [deleteModal, setDeleteModal] = useState(false);
    const [newPasswordModal, setNewPasswordModal] = useState(false);
    const [forceDeleteModal, setForceDeleteModal] = useState(false);
    const [resetPasswordModal, setResetPasswordModal] = useState(false);
    const [logoutModal, setLogoutModal] = useState(false);

    // state
    // 비밀번호 초기화 후 초기 비밀번호
    const [newPassword, setNewPassword] = useState('');
    const [inputJobName, setInputJobName] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const queryClient = useQueryClient();

    const isForceDelete = data?.state_code === 'dr.recovery.job.state.clear-failed';
    let typeCode;
    let resultCode;
    if (type === 'openstack-recovery-result') {
        typeCode = findLastWord(data.recovery_type_code);
        resultCode = findLastWord(data.result_code);
    }

    let jobState;
    let jobType;
    if (type === 'openstack-recovery-job') {
        let state = data?.['state_code'].split('.');
        jobState = state[state.length - 1];
        if (data.schedule === undefined) {
            jobType = 'immediately';
        }
    }

    const not_operator = role !== 'admin' && role !== 'manager' && role !== 'operator';
    const not_manager = role !== 'admin' && role !== 'manager';

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // table 항목을 삭제하는 함수
    const { deleteLoading, deleteFn } = useDelete(
        ([, , status]) => {
            if (status === 200 || status === 201) {
                toast.success(`${title}${getKoreanAffix(title, '이가')} 삭제되었습니다.`);
                if (type === 'openstack-cluster') {
                    queryClient.invalidateQueries(clusterKeys.lists());
                } else if (type === 'openstack-protection-group') {
                    queryClient.invalidateQueries(protectionGroupKeys.lists());
                } else if (type === 'openstack-recovery-plan') {
                    queryClient.invalidateQueries(recoveryPlanKeys.lists());
                } else if (type === 'openstack-recovery-job') {
                    queryClient.invalidateQueries(recoveryJobKeys.lists());
                } else if (type === 'openstack-recovery-result') {
                    queryClient.invalidateQueries(recoveryResultKeys.lists());
                } else if (type === 'user') {
                    queryClient.invalidateQueries(userKeys.lists());
                    queryClient.invalidateQueries(userGroupKeys.userListsInGroup());
                    queryClient.invalidateQueries(userGroupKeys.userListsOutGroup());
                }
                if (list?.length === 1) {
                    setQueryData(prev => ({ ...prev, offset: 0 }));
                }
            }
            setDeleteModal(false);
        },
        isForceDelete ? type + '-force' : type,
    );

    const { isLoading: logoutLoading, mutate: logoutUser } = useMutation(payload => _logoutUser(payload), {
        onSuccess: ([, , status]) => {
            if (status === 200 || status === 201) {
                toast.success(t('CLOUD.USER.ACCOUNT.SUCCESS_LOG_OUT'));
                queryClient.invalidateQueries(userKeys.lists());
            }
            setLogoutModal(false);
        },
    });

    // 사용자 비밀번호를 초기화하는 함수
    const { isLoading: resetLoading, mutate: resetPassword } = useMutation(payload => _resetUserPassword(payload), {
        onSuccess: ([data, , status]) => {
            if (status === 200 || status === 201) {
                setNewPassword('@' + data.password);
                setNewPasswordModal(true);
                setResetPasswordModal(false);
            }
        },
    });

    /**
     * actions menu render
     */
    const options = useMemo(() => {
        return [
            {
                type: PATHNAME.CLUSTER,
                label: '클러스터',
                list: [
                    {
                        name: '클러스터 상세',
                        icon: <VisibilityOutlinedIcon />,
                        onClick: detailEvent,
                        type: 'default',
                    },
                    {
                        name: '보호그룹 추가',
                        icon: <AddOutlinedIcon />,
                        onClick: addEvent,
                        style: not_manager ? { display: 'none' } : undefined,
                        type: 'primary',
                    },
                    {
                        name: '클러스터 수정',
                        icon: <EditOutlinedIcon />,
                        onClick: editEvent,
                        style: {},
                        type: 'primary',
                    },
                    {
                        name: '클러스터 삭제',
                        icon: <DeleteOutlineOutlinedIcon />,
                        onClick: () => setDeleteModal(true),
                        style: not_manager ? { display: 'none' } : undefined,
                        type: 'error',
                    },
                ],
            },
            {
                type: PATHNAME.OPENSTACK_GROUP,
                label: '보호그룹',
                list: [
                    {
                        name: '보호그룹 상세',
                        icon: <VisibilityOutlinedIcon />,
                        onClick: detailEvent,
                        type: 'default',
                    },
                    {
                        name: '복구계획 추가',
                        icon: <AddOutlinedIcon />,
                        onClick: addEvent,
                        style: not_manager ? { display: 'none' } : undefined,
                        type: 'primary',
                    },
                    {
                        name: '보호그룹 수정',
                        icon: <EditOutlinedIcon />,
                        onClick: editEvent,
                        type: 'primary',
                    },
                    {
                        name: '보호그룹 삭제',
                        icon: <DeleteOutlineOutlinedIcon />,
                        onClick: () => setDeleteModal(true),
                        style: not_manager ? { display: 'none' } : undefined,
                        type: 'error',
                    },
                ],
            },

            {
                type: PATHNAME.OPENSTACK_PLAN,
                label: '복구계획',
                list: [
                    {
                        name: '복구계획 상세',
                        icon: <VisibilityOutlinedIcon />,
                        onClick: detailEvent,
                        type: 'default',
                    },
                    {
                        name: '복구작업 추가',
                        icon: <AddOutlinedIcon />,
                        onClick: e => {
                            addEvent(e);
                        },
                        style: not_manager ? { display: 'none' } : undefined,
                        type: 'primary',
                    },
                    {
                        name: '복구계획 수정',
                        icon: <EditOutlinedIcon />,
                        onClick: editEvent,
                        type: 'primary',
                    },
                    {
                        name: '복구계획 삭제',
                        icon: <DeleteOutlineOutlinedIcon />,
                        onClick: () => setDeleteModal(true),
                        style: not_manager ? { display: 'none' } : undefined,
                        type: 'error',
                    },
                ],
            },

            {
                type: PATHNAME.EVENT_LIST,
                label: title,
                list: [
                    {
                        name: `${title} 상세`,
                        icon: <RemoveRedEyeOutlinedIcon />,
                        onClick: detailEvent,
                        type: 'default',
                    },
                ],
            },

            {
                type: PATHNAME.OPENSTACK_JOB,
                label: '복구작업',
                list: [
                    {
                        name: '복구작업 상세',
                        icon: <VisibilityOutlinedIcon />,
                        onClick: detailEvent,
                        type: 'default',
                    },
                    {
                        name: '복구작업 모니터링',
                        icon: <MonitorIcon />,
                        onClick: monitoringEvent,
                        type: 'primary',
                        style: jobState === 'waiting' || jobState === 'finished' ? { display: 'none' } : undefined,
                    },
                    {
                        name: '복구작업 수정',
                        icon: <EditOutlinedIcon />,
                        onClick: editEvent,
                        style:
                            not_operator || jobType === 'immediately' || jobState !== 'waiting'
                                ? { display: 'none' }
                                : undefined,
                        type: 'primary',
                    },
                    {
                        name: '복구작업 삭제',
                        icon: <DeleteOutlineOutlinedIcon />,
                        onClick: () => setDeleteModal(true),
                        style: not_operator || jobState !== 'waiting' ? { display: 'none' } : undefined,
                        type: 'error',
                    },
                    {
                        name: '복구작업 강제 삭제',
                        icon: <DeleteOutlineOutlinedIcon />,
                        onClick: () => setForceDeleteModal(true),
                        style: not_operator || !isForceDelete ? { display: 'none' } : undefined,
                        type: 'error',
                    },
                ],
            },

            {
                type: PATHNAME.OPENSTACK_RESULT,
                label: '복구결과',
                list: [
                    {
                        name: '복구결과 상세',
                        icon: <RemoveRedEyeOutlinedIcon />,
                        onClick: detailEvent,
                        style: resultCode === 'canceled' ? { display: 'none' } : undefined,
                        type: 'primary',
                    },
                    {
                        name: '복구결과 삭제',
                        icon: <DeleteOutlineOutlinedIcon />,
                        onClick: () => setDeleteModal(true),
                        style: typeCode === 'migration' ? { display: 'none' } : undefined,
                        type: 'error',
                    },
                ],
            },
            {
                type: PATHNAME.USER,
                label: '사용자',
                list: [
                    {
                        name: '사용자 수정',
                        icon: <EditOutlinedIcon />,
                        onClick: editEvent,
                        type: 'primary',
                    },
                    {
                        name: '비밀번호 초기화',
                        icon: <LockResetOutlinedIcon />,
                        onClick: () => {
                            if (data?.session?.key) {
                                toast.error(t('CLOUD.USER.ACCOUNT.RESET_PWD_ONLY_LOGGED_OUT'));
                            } else {
                                setResetPasswordModal(true);
                            }
                        },
                        type: 'primary',
                    },
                    {
                        name: '사용자 삭제',
                        icon: <DeleteOutlineOutlinedIcon />,
                        onClick: () => {
                            if (data?.session?.key) {
                                toast.error('로그인되어 있는 사용자는 삭제할 수 없습니다.');
                            } else {
                                setDeleteModal(true);
                            }
                        },
                        type: 'error',
                    },
                    {
                        name: '로그아웃',
                        icon: <PowerSettingsNewOutlinedIcon />,
                        onClick: () => setLogoutModal(true),
                        type: 'error',
                    },
                ],
            },

            {
                type: PATHNAME.OPENSTACK_CLUSTER_DETAIL,
                label: title,
                list: [
                    {
                        name: `${title} 상세`,
                        icon: <RemoveRedEyeOutlinedIcon />,
                        onClick: detailEvent,
                        type: 'default',
                    },
                ],
            },
        ];
    }, [
        detailEvent,
        addEvent,
        not_manager,
        editEvent,
        data?.session?.key,
        title,
        monitoringEvent,
        jobState,
        not_operator,
        jobType,
        isForceDelete,
        resultCode,
        typeCode,
        t,
    ]);

    const currentPageOptions = useMemo(() => {
        let pathnames = location.pathname.split('/').filter(x => x.length !== 0);
        if (pathnames[pathnames.length - 2] === 'edit' || pathnames[pathnames.length - 2] === 'detail') {
            pathnames = pathnames.slice(0, pathnames.length - 1);
        }
        pathnames = '/' + pathnames.join('/');

        return options.filter(option => pathnames.includes(option.type))[0];
    }, [location, options]);

    return (
        <>
            <IconButton
                disabled={isLoading}
                aria-label="more"
                id="long-button"
                aria-haspopup="true"
                onClick={handleClick}
                sx={{ padding: '5px' }}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu id="long-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuList sx={{ padding: 0 }}>
                    {currentPageOptions.list.map(option => (
                        <StyledMenuItem
                            data-clustertype={findLastWord(data.type_code)}
                            menutype={option.type}
                            style={option.style}
                            data-resourcename={name}
                            id={data.id}
                            onClick={e => {
                                option.onClick(e);
                                handleClose(e);
                            }}
                            key={option.name}
                        >
                            <ListItemIcon className={`${mode}-${option.type}`}>{option.icon}</ListItemIcon>
                            <ListItemText className={`${mode}-${option.type}`}>{option.name}</ListItemText>
                        </StyledMenuItem>
                    ))}
                </MenuList>
            </Menu>
            {deleteModal && (
                <DefaultDialog
                    maxWidth="xs"
                    open={deleteModal}
                    title={`${title} 삭제`}
                    onConfirm={() => {
                        deleteFn({ id: treeId, subId: data.id, name: name });
                    }}
                    onClose={() => {
                        setDeleteModal(false);
                    }}
                    actionType="confirm"
                    buttonColor="error"
                    isLoading={deleteLoading}
                >
                    <DialogText
                        title={
                            type === 'openstack-recovery-job'
                                ? data.plan.name
                                : type === 'openstack-recovery-result'
                                ? data.recovery_plan_name
                                : data.name
                        }
                        body={`${title}${getKoreanAffix(title, '을를')} 삭제하시겠습니까?`}
                    />
                </DefaultDialog>
            )}
            {forceDeleteModal && (
                <ForceDeleteModal
                    open={forceDeleteModal}
                    title={t('DR.RP.FORCE_DELETE.JOB')}
                    clusterName={data.plan.name}
                    onClose={() => {
                        setForceDeleteModal(false);
                        setInputJobName('');
                    }}
                    onConfirm={() => {
                        deleteFn({ id: treeId, subId: data.id });
                        setInputJobName('');
                    }}
                    variant="delete"
                    isLoading={deleteLoading}
                    inputJobName={inputJobName}
                    setInputJobName={setInputJobName}
                    t={t}
                />
            )}
            {logoutModal && (
                <DefaultDialog
                    open={logoutModal}
                    maxWidth="xs"
                    title={t('CLOUD.USER.ACCOUNT.USER_LOG_OUT')}
                    onConfirm={() => logoutUser(data?.session?.key)}
                    onClose={() => {
                        setLogoutModal(false);
                    }}
                    isLoading={logoutLoading}
                    actionType="confirm"
                    buttonColor="error"
                >
                    <DialogText title={data.name} body={t('CLOUD.USER.ACCOUNT.WARN_LOG_OUT_ACCOUNT')} />
                </DefaultDialog>
            )}
            {/* 비밀번호 초기화 */}
            {resetPasswordModal && (
                <DefaultDialog
                    open={resetPasswordModal}
                    maxWidth="xs"
                    title={t('CLOUD.USER.ACCOUNT.RESET_PWD')}
                    onConfirm={() => resetPassword(data.id)}
                    onClose={() => {
                        setResetPasswordModal(false);
                    }}
                    isLoading={resetLoading}
                    buttonColor="primary"
                    actionType="confirm"
                >
                    <DialogText title={data.name} body={t('CLOUD.USER.ACCOUNT.WARN_RESET_PWD')} />
                </DefaultDialog>
            )}
            {/* 비밀번호 초기화 확인 */}
            {newPasswordModal && (
                <DefaultDialog
                    open={newPasswordModal}
                    maxWidth="xs"
                    title={t('CLOUD.USER.ACCOUNT.INITIAL_PWD')}
                    onClose={() => {
                        setNewPasswordModal(false);
                    }}
                    onConfirm={() => {
                        setNewPasswordModal(false);
                    }}
                    actionType="confirm"
                    buttonColor="primary"
                >
                    <DialogText title={newPassword} body={t('CLOUD.USER.ACCOUNT.SUCCESS_RESET_PWD')} />
                </DefaultDialog>
            )}
        </>
    );
};

export default ActionsFormatter;

// TODO: tsx 파일로 변환하면 없어지는 코드
ActionsFormatter.defaultProps = {
    setQueryData: () => {},
};

const StyledMenuItem = styled(MenuItem)``;

const ForceDeleteModal = ({
    open,
    onClose,
    title,
    clusterName,
    isLoading,
    onConfirm,
    inputJobName,
    setInputJobName,
    children,
    variant,
    t,
}) => {
    return (
        <Dialog open={open} fullWidth maxWidth={'xs'}>
            <DialogTitle>{title}</DialogTitle>
            <Divider />
            <DialogContent sx={{ '& > .MuiFormControl-root': { width: '100%' } }}>
                <Typography variant="h6" className="ellipsis error-text">
                    {clusterName}
                </Typography>
                <Typography sx={{ lineHeight: '2' }}>
                    {t('DR.RP.FORCE_DELETE_JOB_STORY_1')} {t('DR.RP.FORCE_DELETE_JOB_STORY_2')}
                </Typography>
                <Box sx={{ display: 'flex', marginBottom: '5px' }}>
                    <Typography className="error-text" sx={{ fontWeight: 700 }}>
                        {clusterName}
                    </Typography>
                    <Typography>를 입력하고 복구작업을 강제 삭제합니다.</Typography>
                </Box>
                <DefaultTextField type="text" value={inputJobName} onChange={e => setInputJobName(e.target.value)} />
                {children}
            </DialogContent>
            <Divider />
            <DialogActions>
                <ActionButton buttonType="cancel" buttonColor="cancel" onClick={onClose} />
                <ActionButton
                    buttonType={'confirm'}
                    buttonColor="error"
                    type={variant}
                    disabled={isLoading || inputJobName !== clusterName}
                    isLaoding={isLoading}
                    onClick={onConfirm}
                />
            </DialogActions>
        </Dialog>
    );
};
