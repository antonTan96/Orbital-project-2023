export function login(inputs, success, failed) {
  try {
    if (inputs == undefined) {
      return failed("Inputs cannot be emptied!");
    }
    if (!("username" in inputs)) {
      return failed("Username field is not present!");
    }
    if (!("password" in inputs)) {
      return failed("Password field is not present!");
    }
    return success("Pass?");
  } catch (Error) {
    console.log(Error);
    return failed("Internal Server Error!");
  }
}
