import urllib2
from BeautifulSoup import BeautifulSoup
from pymongo import MongoClient

# to learn more about MongoLab visit http://www.mongolab.com
# replace the "" in the line below with your MongoLab connection string
# you can also use a local MongoDB instance
connection = MongoClient("192.168.1.7:27017")

# connect to the students database and the ctec121 collection
db = connection.nodejs.bustimes

def updateTimeDB():
	url = "http://www.ed.ac.uk/schools-departments/transport/public-transport/buses/shuttle-bus"
	data = urllib2.urlopen(url).read()
	soup = BeautifulSoup(data)
	tableData = soup.find("table")
	row = tableData.findAll('tr')
	for r in row:
		print('')
		boxs = r.findAll('td')
		i = 0
		for b in boxs:
			if i == 0:
				print("1: "+ b.text)
				bustime = {'time':b.text, 'location': 'centralD'}
				db.insert(bustime)
			elif i== 1:
				print("2: " + b.text)

				bustime = {'time':b.text, 'location': 'kingsA'}
				db.insert(bustime)
			elif i == 2:
				print("3: " + b.text)

				bustime = {'time':b.text, 'location': 'kingsD'}
				db.insert(bustime)
			elif  i == 3:
				print("4: " + b.text)

				bustime = {'time':b.text, 'location': 'centralA'}
				db.insert(bustime)
			i = i+1
	


def printDB() :
	# create a dictionary to hold student documents

	# create dictionary

	# find all documents
	centralA = db.find({'location':'centralA'})
	centralD = db.find({'location':'centralD'})
	kingsA = db.find({'location':'kingsA'})
	kingsD = db.find({'location':'kingsD'})


	print()
	print('+-+-+-+-+-+-+-+-+-+-+-+-+-+-')

	# display documents from collection
	for record in centralA:
		# print out the document
		print(record['time'])


		# close the connection to MongoDB

updateTimeDB()
connection.close()

