function ErrorContainer({ errorString, setErrorString }) {
  if (errorString == "") {
    return;
  }
  return (
    <>
      <button onClick={() => setErrorString("")}>ok</button> {errorString}
    </>
  );
}

export default ErrorContainer;
