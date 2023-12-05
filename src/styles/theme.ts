// theme 컬러 및 반응형 사이즈

import { DefaultTheme } from 'styled-components';
const breakpoints = {
    down: {
        xs: '@media (max-width: 0px)',
        sm: '@media (max-width: 600px)',
        md: '@media (max-width: 900px)',
        lg: '@media (max-width: 1200px)',
        xl: '@media (max-width: 1536px)',
    },
    up: {
        xs: '@media (min-width: 0px)',
        sm: '@media (min-width: 600px)',
        md: '@media (min-width: 900px)',
        lg: '@media (min-width: 1200px)',
        xl: '@media (min-width: 1536px)',
    },
};

const fontSize = {
    ssm: '0.5rem',
    sm: '0.8rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem',
};

export const lightTheme: DefaultTheme = {
    breakpoints,
    fontSize,
};

export const darkTheme: DefaultTheme = {
    breakpoints,
    fontSize,
};

export const LightModeComponentCustomStyle = {
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#fff',
                    backgroundImage: 'none',
                },
            },
        },
    },
};
export const DarkModeComponentCustomStyle = {
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#111927',
                    backgroundImage: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#111927',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#111927',
                },
            },
        },
    },
};

export const getDesignTokens = (mode: 'light' | 'dark') => ({
    mode,
    ...(mode === 'light'
        ? {
              // palette values for light mode
              primary: {
                  main: '#3699FF',
                  contrastText: '#fff',
              },
              success: {
                  main: '#00AB52',
              },
              cancel: {
                  main: '#BDBDBD',
              },
              border: {
                  main: 'rgba(0, 0, 0, 0.23)',
              },
              node: {
                  main: 'rgba(212, 235, 195, 0.9)',
              },
          }
        : {
              // palette values for dark mode
              primary: {
                  main: '#90CAF9',
              },
              success: {
                  main: '#388e3c',
              },
              cancel: {
                  main: '#767676',
              },
              border: {
                  main: 'rgba(255, 255, 255, 0.23)',
              },
              node: {
                  main: 'rgba(212, 235, 195, 0.4)',
              },
          }),
});
