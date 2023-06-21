import json
from pprint import pprint as pp

with open ("datatest.json","r") as jsondata:
	datatest = json.load(jsondata)
pp(datatest)
