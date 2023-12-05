import { useEffect } from 'react';
import isObject from 'lodash/isObject';
import { useFormikContext } from 'formik';

const getFirstErrorKey: any = (object: any, keys = []) => {
    const firstErrorKey = Object.keys(object)[0];
    if (isObject(object[firstErrorKey])) {
        return getFirstErrorKey(object[firstErrorKey], [...keys, firstErrorKey]);
    }
    return [...keys, firstErrorKey].join('.');
};
const FormikOnError: any = ({ children }: { children: any }) => {
    const formik = useFormikContext();
    useEffect(() => {
        if (!formik.isValid && formik.submitCount > 0) {
            const firstErrorKey = getFirstErrorKey(formik.errors);
            if (window.document.getElementsByName(firstErrorKey).length) {
                window.document
                    .getElementsByName(firstErrorKey)[0]
                    .scrollIntoView({ behavior: 'smooth', block: 'center' });
                window.document.getElementsByName(firstErrorKey)[0].focus({ preventScroll: true });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.submitCount, formik.isValid]);
    return children;
};

export default FormikOnError;
