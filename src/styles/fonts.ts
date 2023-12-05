import { css } from 'styled-components';

import NotoSansRegular from '../fonts/NotoSansKR-Regular.otf';
import NotoSansMedium from '../fonts/NotoSansKR-Medium.otf';
import NotoSansBold from '../fonts/NotoSansKR-Bold.otf';

// TODO: styled-component 방식으로 폰트를 적용하니까 reload 될 때마다 폰트를 불러오는듯?
// darktheme 로 변경시 폰트가 깜빡거리는 현상이 발생(폰트를 새로 불러온다.)
export const fonts = css`
    @font-face {
        font-family: 'Noto Sans KR';
        font-style: normal;
        font-weight: normal;
        font-display: swap;
        src: local('NotoSansKR'), url(${NotoSansRegular}) format('opentype');
    }

    @font-face {
        font-family: 'Noto Sans KR';
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: local('NotoSansKR'), url(${NotoSansMedium}) format('opentype');
    }

    @font-face {
        font-family: 'Noto Sans KR';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: local('NotoSansKR'), url(${NotoSansBold}) format('opentype');
    }
`;
