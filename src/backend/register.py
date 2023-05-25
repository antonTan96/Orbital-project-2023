from connector import execute, read
import flask
import bcrypt

register_api = flask.Blueprint("register", __name__)
table_name = "Users"

def failed(message):
	return {"status" : "failed", "message" : message}

def success(message):
	return {"status" : "success", "message" : message}

DB_EXCEPTION = failed("Error occured while accesing the database!")

@register_api.route("/", methods = ["GET"])
def hello():
	return "Register API"

@register_api.route("/", methods = ["POST"])
def register():
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

	if result != None and len(result) != 0:
		return success(f"{username} already in used! Please used another username!")

	query = f"INSERT INTO {table_name} (Username, Password) values (%s, %s)"

	values = (username, bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()))

	try:
		execute(query, values)
	except Exception as err:
		print(err)
		return DB_EXCEPTION

	return success("Registration Successful!")