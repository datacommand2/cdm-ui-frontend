// global style type 작성
import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        breakpoints: {
            down: {
                xs: string;
                sm: string;
                md: string;
                lg: string;
                xl: string;
            };
            up: {
                xs: string;
                sm: string;
                md: string;
                lg: string;
                xl: string;
            };
        };
        fontSize: {
            ssm: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
            xxl: string;
        };
    }
}
