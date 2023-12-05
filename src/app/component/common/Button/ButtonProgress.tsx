import React, { ReactNode, useEffect, useState } from 'react';

interface ButtonProgressProps {
    value: any;
    operation: string;
    buttonState: string;
    text: string | ReactNode;
    onClick: any;
    color?: string;
    type?: 'button' | 'submit' | 'reset' | undefined;
    className?: string;
    style?: any;
    size?: string;
    messageDuration?: number;
    block?: boolean;
    width?: string | number;
    height?: string | number;
    buttonRef?: any;
    disabled?: boolean;
}

const ButtonProgress = ({
    value,
    operation,
    buttonState,
    text,
    onClick,
    color,
    type,
    className,
    style,
    size,
    messageDuration,
    block,
    width,
    height,
    buttonRef,
    disabled,
}: ButtonProgressProps) => {
    const colorProps = color ? color : 'primary';

    const operationProps = operation ? operation : 'run';

    const textProps = text ? text : '0';

    const typeProps = type ? type : 'button';

    const classNameProps = `reactive-btn${className ? ' ' + className : ''}`;

    const styleProps = style ? style : {};

    const sizeProps = size ? size : 'normal';

    const [buttonStateProps, setButtonStateProps] = useState(buttonState);

    const onClickHandler = (e: any) => {
        if (typeof onClick !== 'undefined') {
            onClick(e);
        }
    };

    useEffect(() => {
        setButtonStateProps(buttonState);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buttonState]);

    useEffect(() => {
        if (typeof buttonStateProps !== 'undefined') {
            setButtonStateProps(buttonStateProps);
        }
    }, [buttonStateProps, messageDuration]);

    return (
        <React.Fragment>
            <span
                className={`reactive-btn-wrapper ${sizeProps}${block ? ' block' : ''}`}
                style={{ width: width, height: height }}
            >
                <button
                    value={value}
                    ref={typeof buttonRef !== 'undefined' ? buttonRef : null}
                    data-button-state={buttonStateProps}
                    type={typeProps}
                    className={`${classNameProps} ${colorProps}${disabled ? ' disabled' : ''}`}
                    onClick={onClickHandler}
                    style={styleProps}
                    data-button-operation={operationProps}
                >
                    <span className="progress"></span>
                    <span className="content">
                        <React.Fragment>{textProps}</React.Fragment>
                    </span>
                </button>
            </span>
        </React.Fragment>
    );
};

export default ButtonProgress;
