function CurrentTaskContainer({ task }) {
  return (
    <>
      <div>
        <em>Current Task : {task["Task Name"]}</em>
      </div>
      <div>Deadline : {task.Deadline.substring(0, 10)}</div>
    </>
  );
}
export default CurrentTaskContainer;
