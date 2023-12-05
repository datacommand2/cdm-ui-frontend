import { Checkbox } from '@mui/material';
import React from 'react';

const IndeterminateCheckBox = ({ indeterminate, className = '', onClick, ...rest }) => {
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [ref, indeterminate, rest.checked]);

    return (
        <Checkbox
            onClick={e => {
                e.stopPropagation();
                onClick();
            }}
            ref={ref}
            className={className + ' cursor-pointer'}
            {...rest}
        />
    );
};

export default IndeterminateCheckBox;
