/**
 * Entry application component used to compose providers and render Routes.
 * */

import React, { useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { QueryClientProvider, QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createTheme, ThemeProvider as MuiThemeProvider, Typography } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import 'dayjs/locale/ko';
import 'react-toastify/dist/ReactToastify.css';

import { useToggleMode } from '@recoil/atom/Global';
import GlobalStyle from '@styles/GlobalStyle';
import {
    DarkModeComponentCustomStyle,
    getDesignTokens,
    LightModeComponentCustomStyle,
    lightTheme,
} from '@styles/theme';

import Router from './Router';

export default function App() {
    const [mode] = useToggleMode();
    const theme = React.useMemo(
        () =>
            createTheme({
                components:
                    mode === 'light'
                        ? LightModeComponentCustomStyle.components
                        : DarkModeComponentCustomStyle.components,
                palette: getDesignTokens(mode),
            }),
        [mode],
    );

    const toastId = React.useRef(0);

    const showToast = (params: any) => {
        if (params[2] === 408) {
            toast.error(
                <div>
                    <Typography>요청 시간이 초과되었습니다.</Typography>
                </div>,
            );
        }
        if (params[2] > 399 && params[2] !== 408) {
            if (params[1]?.message?.code) {
                if (params[1].message.code !== 'connection error') {
                    if (!toast.isActive(toastId.current)) {
                        toastId.current = +toast.error(
                            <div>
                                <Typography>{params[1].message.code}</Typography>
                            </div>,
                        );
                    }
                }
            }
        }
    };
    const queryClient = useMemo(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onSuccess: data => showToast(data),
                }),
                mutationCache: new MutationCache({
                    onSuccess: data => {
                        showToast(data);
                    },
                }),
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                    },
                },
            }),
        [],
    );

    return (
        <QueryClientProvider client={queryClient}>
            <StyledEngineProvider injectFirst>
                <StyledThemeProvider theme={lightTheme}>
                    <MuiThemeProvider theme={theme}>
                        <GlobalStyle thememode={mode} />
                        <ToastContainer
                            closeOnClick
                            style={{ wordBreak: 'break-all' }}
                            theme={mode === 'dark' ? 'dark' : 'colored'}
                        />
                        <ReactQueryDevtools initialIsOpen={false} position={'bottom-right'} />
                        <BrowserRouter>
                            <LocalizationProvider
                                dateAdapter={AdapterDayjs}
                                adapterLocale="ko"
                                localeText={{ cancelButtonLabel: '취소', okButtonLabel: '확인' }}
                            >
                                <Router />
                            </LocalizationProvider>
                        </BrowserRouter>
                    </MuiThemeProvider>
                </StyledThemeProvider>
            </StyledEngineProvider>
        </QueryClientProvider>
    );
}
