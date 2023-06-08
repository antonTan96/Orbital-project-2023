function ErrorContainer({ errorString, setErrorString }) {
  if (errorString == "") {
    return;
  }
  return (
    <div style={{ border: "5px solid white" }}>
      {errorString} <button onClick={() => setErrorString("")}>ok</button>
    </div>
  );
}

export default ErrorContainer;
