function CurrentTaskContainer({ task }) {
  return (
    <>
      <div>
        <em>Current Task : {task.Name}</em>
      </div>
      <div>Deadline : {task.Deadline.substring(0, 10)}</div>
    </>
  );
}
export default CurrentTaskContainer;
