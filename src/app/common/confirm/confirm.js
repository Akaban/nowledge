
export function getOpenConfirm(state, setState) {
  function openConfirm(obj) {
    function closeConfirm() {
      setState({ ...state, open: false });
    }
    const { onConfirm, content } = obj;
    setState({
      content,
      open: true,
      onCancel: closeConfirm,
      onConfirm: () => {
        onConfirm();
        closeConfirm();
      },
    });
  }

  return openConfirm
}
