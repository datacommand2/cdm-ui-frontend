export const sliderStyle = {
    root: {
        color: '#3699ff',
        height: 8,
        width: '86%',
        marginBottom: 8,
    },
    thumb: {
        height: 16,
        width: 16,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: 0,
        marginLeft: 0,
        '&:focus, &:hover': {
            boxShadow: 'inherit',
        },
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
    mark: {
        height: 0,
    },
};
