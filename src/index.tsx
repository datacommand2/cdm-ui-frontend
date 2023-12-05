import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import * as ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/fonts.css';
import './libs/i18n/I18nConfig';
import { RecoilRoot } from 'recoil';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <RecoilRoot>
        <App />
    </RecoilRoot>,
);
