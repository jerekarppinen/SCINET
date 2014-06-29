import os.path
import urllib2, urllib

# This is a bootfile for Sauna Celsius Information Raspberry device
# If cannot find serial number, connect server

# Check if serialnumber file exists

file = "serial.txt"

if os.path.isfile(file) == False:

	# We didnt find the file, so connect to the cloud service
	# Set data to be sent to cloud service
	data = [("yptologin", "LiisaIhmeMaassa")]

	# Format it to urlencode
	data = urllib.urlencode(data)
	
	# Set path to the cloud service
	path = "http://localhost/SCINET/index.php/api/startUp"

	req = urllib2.Request(path, data)
	req.add_header("Content-type", "application/x-www-form-urlencoded")

	# Read the answer

	response=urllib2.urlopen(req).read()
	
	# Answer should be: Added device xxxxxx
	response = response.split(" ")

	# Set new serial
	serial = response[2]

	f = open("serial.txt", "w")
	f.write(serial)
	f.close()
	

else:
	print "File found"
