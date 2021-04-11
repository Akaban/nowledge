const OPEN_CONFIRM = 'OPEN_CONFIRM';
const CLOSE_CONFIRM = 'CLOSE_CONFIRM';

export function openConfirm(payload) {
    return {
        type: OPEN_CONFIRM,
        payload: payload
    };
}

export function closeConfirm() {
    return {
        type: CLOSE_CONFIRM
    };
}

const initialState = {
    content: "",
    onCancel: () => null,
    onConfirm: () => null,
    open: false
};

export default function modalReducer(state=initialState, { type, payload }) {
    switch (type) {
        case OPEN_CONFIRM:
            return {...state, ...payload, open: true};
        case CLOSE_CONFIRM:
            return initialState;
        default:
            return state;
    }
}