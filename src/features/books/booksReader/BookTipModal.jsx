
import React from 'react'
import { useDispatch } from 'react-redux'
import ModalWrapper from '../../../app/common/modals/ModalWrapper';
import { closeModal } from '../../../app/common/modals/modalReducer'
import { FormBookTip } from './BookTip';

export default function BookTipModal({ onConfirm, highlight=null, content=null }) {
    if (!highlight && !content) throw new Error("");
    const dispatch = useDispatch();

    const onConfirm2 = (values) => {onConfirm(values) ; dispatch(closeModal())}

    return (<ModalWrapper size='mini' header='Edit highlight'>
        <FormBookTip onConfirm={onConfirm2} highlight={highlight} content={content} />
    </ModalWrapper>)
}