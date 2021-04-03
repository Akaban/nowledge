import React from 'react'
import { useSelector } from 'react-redux'
import TestModal from '../../../features/sandbox/TestModal';
import LoginForm from '../../../features/auth/LoginForm';
import RegisterForm from '../../../features/auth/RegisterForm'
import BookTipModal from '../../../features/books/booksReader/BookTipModal'

export default function ModalManager() {
    const modalLookup = {
        TestModal,
        LoginForm,
        RegisterForm,
        BookTipModal,
    }
    const currentModal = useSelector(state => state.modals);
    let renderedModal;
    if (currentModal) {
        const {modalType, modalProps} = currentModal;
        const ModalComponent = modalLookup[modalType]
        renderedModal = <ModalComponent {...modalProps} />
    }

    return <span>{renderedModal}</span>

}