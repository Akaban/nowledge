import React from "react";
import { useSelector, useDispatch } from "react-redux"
import { Confirm } from "semantic-ui-react";
import { closeConfirm } from "./confirmReducer"

export default function ConfirmWrapper() {
    const {
        onConfirm,
        content,
        open,
        onCancel
    } = useSelector(state => state.confirm)

    const dispatch = useDispatch();

    return (
      <Confirm
        content={content}
        open={open}
        onCancel={() => {onCancel() ; dispatch(closeConfirm()) }}
        onConfirm={() => {onConfirm() ; dispatch(closeConfirm())}}
      />
    )
}