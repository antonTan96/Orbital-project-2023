import mysql.connector
import os
import config

HOST_NAME = os.getenv("HOST_NAME", config.HOST_NAME)
USER_NAME = os.getenv("USER_NAME", config.USER_NAME)
PASSWORD = os.getenv("PASSWORD", config.PASSWORD)
DATABASE = os.getenv("DATABASE", config.DATABASE)

def connect():
	connection = None
	try:
		connection = mysql.connector.connect(
			host = HOST_NAME,
			user = USER_NAME,
			password = PASSWORD,
			database = DATABASE)
		print("Connection Successful")
	except Exception as err:
		print(err)
	finally:
		return connection

connection = connect()

cursor = connection.cursor()

def execute(query, values):
	cursor.execute(query, values)
	connection.commit()

def read(query, values):
	cursor.execute(query, values)
	result = cursor.fetchall()
	return result
