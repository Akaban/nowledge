import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "semantic-ui-react";
import { openModal } from "../../app/common/modals/modalReducer";
import { useFirestoreCollectionOnce } from "../../app/hooks/useFirestoreCollection";
import { getBooksMetadataFromFirestore } from "../../app/firestore/firestoreService"
import { callBackendTest } from "./backend";
import { decrement, increment } from "./testReducer";
import GKeepList from "../../app/common/GKeepList/GKeepList";

export default function Sandbox() {
  const dispatch = useDispatch();
  const [target, setTarget] = useState(null);
  const data = useSelector((state) => state.test.data);
  const { loading } = useSelector((state) => state.async);

  const initCoucou = "<ul><li/></ul>"
  const [coucou, setCoucou] = useState(initCoucou)

  callBackendTest();

  return (
    <>
      {/* Your token is: {getToken()} */}
      <h1>Test 123</h1>
      <h3>The data is: {data}</h3>
      <Button
        name="increment"
        loading={loading && target === "decrement"}
        onClick={(e) => {
          dispatch(increment(20));
          setTarget(e.target.name);
        }}
        content="Increment"
        color="green"
      />
      <Button
        name="decrement"
        loading={loading && target === "decrement"}
        onClick={(e) => {
          dispatch(decrement(10));
          setTarget(e.target.name);
        }}
        content="Decrement"
        color="orange"
      />
      <Button
        onClick={() =>
          dispatch(openModal({ modalType: "TestModal", modalProps: { data } }))
        }
        content="Open Modal"
        color="teal"
      />
      Mode: {"_self" in React.createElement("div") ? "Dev" : "Prod"}
    <GKeepList/>
    </>
  );
}
