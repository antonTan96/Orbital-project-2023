from connector import execute, read
import flask
import bcrypt

login_api = flask.Blueprint("login", __name__)
table_name = "Users"

def failed(message):
	return {"status" : "failed", "message" : message}

def success(message):
	return {"status" : "success", "message" : message}

DB_EXCEPTION = failed("Error occured while accesing the database!")
@login_api.route("/", methods = ["GET"])
def hello():
	return "Login API"

@login_api.route("/", methods = ["POST"])
def login():
	inputs = None
	try:
		inputs = flask.request.get_json()
	except Exception as err:
		print(err)
		return failed("Error occured while retrieving json body")

	if inputs == None or len(inputs) == 0:
		return failed("Input cannot be empty!")

	if "Username" not in inputs and "Password" not in inputs:
		return failed("Both Username and Password fields are not found!")

	if "Username" not in inputs:
		return failed("Username field is not found!")

	if "Password" not in inputs:
		return failed("Password field is not found!")

	username = inputs["Username"]
	password = inputs["Password"]

	if (len(username) == 0) :
		return failed("Username cannot be empty!")

	if (len(password) == 0):
		return failed("Password cannot be empty!")

	query = f"SELECT Password FROM {table_name} WHERE Username = %s"

	values = (username, )

	result = None

	try:
		result = read(query = query, values = values)
	except Exception as err:
		print(err)
		return DB_EXCEPTION

	if result == None or len(result) == 0:
		return success(f"{username} does not exists!")

	result = result[0]
	if bcrypt.checkpw(password.encode('utf-8'), result[0].encode('utf-8')):
		return success("User login successful!")
	
	return success("Incorrect Password!")