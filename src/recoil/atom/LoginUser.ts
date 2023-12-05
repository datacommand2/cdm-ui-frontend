import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { LicenseInterface } from '../../@types/Cloud/license';

import { User } from '../../@types/Cloud/user';

const { persistAtom } = recoilPersist();

const LoginUser = atom<User>({
    key: 'LoginUser',
    default: {
        id: 0,
        account: '',
        timezone: '',
        name: '',
        craeted_at: 0,
        session: {
            key: '',
        },
    },
    effects_UNSTABLE: [persistAtom],
});

const authInfo = atom({
    key: 'authInfo',
    default: {
        isLoggedIn: false,
    },
    effects_UNSTABLE: [persistAtom],
});

const licenseInfo = atom<{ license: LicenseInterface | null }>({
    key: 'licenseInfo',
    default: {
        license: null,
    },
    effects_UNSTABLE: [persistAtom],
});

export { LoginUser, authInfo, licenseInfo };
