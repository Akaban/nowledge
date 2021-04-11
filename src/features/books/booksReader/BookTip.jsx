import { Formik } from "formik";
import React, { Component, useState } from "react";
import { Button, Form, Header, Label, Segment } from "semantic-ui-react";
import { ScriptElementKindModifier } from "typescript";
import MyTextInput from "../../../app/common/form/MyTextInput";
import GKeepList from "../../../app/common/GKeepList/GKeepList";
import "./style/bookTip.css";
const _ = require("lodash");


export function FormBookTip({onConfirm, content=null, highlight=null}) {
  const [flushInput, setFlushInput] = useState(null)
  const [dirtyNotes, setDirtyNotes] = useState(false)
  return (
          <Formik
            initialValues={highlight ? {notes: highlight.comment.notes, actionNotes: highlight.comment.actionNotes} : { notes: [], actionNotes: [] }}
            onSubmit={(values, {setErrors}) => {
              if (dirtyNotes) setErrors({notes: 'Input field is not empty (did you forget to press enter?)'})
              else
              onConfirm(values);
            }}
            validator={() => ({})}
          >
            {({handleSubmit, setFieldValue, values, errors}) => {
              return (
                <div className="tip-container">
                  <h3>{highlight ? "Edit highlight" : "Add highlight"}</h3>
                  <small>Click out of the window to cancel.</small><br/>
                  <small>You can leave the notes empty, we will just store the quote.</small>
                  <blockquote className="tip-quote">{content ? content.text : highlight.content.text}</blockquote>
                <Form
                  className="ui form"
                  onSubmit={(event) => {
                    handleSubmit();
                  }}
                >
                  <div>
                    <Header content="Notes" />
                    <GKeepList
                      isSimpleList={true}
                      items={highlight ? highlight.comment.notes : []}
                      externalSetState={(s) =>
                        setFieldValue("notes", s.items)
                      }
                      setFlushInput={setFlushInput}
                      setDirty={setDirtyNotes}
                    />
               {errors.notes && <Label basic color='red' style={{marginBottom: 10}} content={errors.notes} /> }
                    {/* <Header content="Take following actions"/>
                    <GKeepList
                      isSimpleList={true}
                      items={highlight ? highlight.comment.actionNotes : []}
                      externalSetState={(s) =>
                        setFieldValue("actionNotes", s.items)
                      } */}
                      {/* activé si dirtyNotes || values.notes !== highlight.comment.notes */}
                      {/* désactivé si !dirtyNotes && values.notes == highlight.comment.notes */}
                    <Button type="submit" disabled={highlight && _.isEqual(values.notes, highlight.comment.notes)} positive content="Save" />
                  </div>
                </Form></div>
              );
            }}
          </Formik>
  )
}

export default function BookTip({ onOpen }) {
  const [compact, setCompact] = useState(true);

  return (
    <div className="Tip">
      {compact ? (
        <div
          className="Tip__compact"
          onClick={() => {
            onOpen();
            setCompact(false);
          }}
        >
          Add highlight
        </div>
      ) : (
        null
      )}
    </div>
  );
}
