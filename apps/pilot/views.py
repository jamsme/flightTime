from django.shortcuts import render, redirect
from django.contrib import messages
import urllib.request
import json

def index(request):
    if "wind" and "speed" and "arrive" and "depart" in request.session:
        depart = request.session["depart"]
        arrive = request.session["arrive"]
        airportAPI(depart,arrive,request)
        print(airportAPI(depart,arrive,request))
        
        content = {
            'departTime' : getAndConvertTime(request)[0],
            'arriveTime' : getAndConvertTime(request)[1]
        }

        print(content)

    return render(request, "pilot/index.html", content)

def calculate(request):
    p = request.POST

    if request.method == 'POST':

        if p['departing'] == '':
            messages.error(request, 'Empty')
            return redirect("/")
        elif p['arriving'] == '':
            messages.error(request, 'Empty')
            return redirect("/")

        else:
            wind = p['wind']
            speed = p['speed']
            depart = p['departing']
            arrive = p['arriving']

            departs = depart.upper()
            arrives = arrive.upper()
            if speed == '':
                speed = 140
                
            request.session["wind"] = wind
            request.session["speed"] = speed
            request.session["depart"] = departs
            request.session["arrive"] = arrives
            
            return redirect("/")
            
def airportAPI(x,y,request):
    api = "https://api.flightstats.com/flex/airports/rest/v1/json/iata/" + x + "?appId=e871ef2e&appKey=61e5d830c67f1fc35aa35e98d4be195e"
    webURL = urllib.request.urlopen(api)
    data = webURL.read()
    jsonObject = (json.loads(data.decode('utf-8')))
    # print(json.dumps(jsonObject, indent=4, sort_keys=True))

    departTime = jsonObject['airports'][0]['localTime']

    apiArrive = "https://api.flightstats.com/flex/airports/rest/v1/json/iata/" + y + "?appId=e871ef2e&appKey=61e5d830c67f1fc35aa35e98d4be195e"
    webURLArrive = urllib.request.urlopen(apiArrive)
    dataArrive = webURLArrive.read()
    jsonObjectArrive = (json.loads(dataArrive.decode('utf-8')))
    # print(json.dumps(jsonObjectArrive, indent=4, sort_keys=True))

    arriveTime = jsonObjectArrive['airports'][0]['localTime']

    return departTime,arriveTime

def getAndConvertTime(request):
    depart = request.session["depart"]
    arrive = request.session["arrive"]
    time = airportAPI(depart,arrive,request)

    split = time[0].split('T')
    remove = split[1].replace(":","")
    wholeNum = remove[:4]
    if int(wholeNum) > 1300:
        wholeNum = int(wholeNum) - 1200
        departTime = str(wholeNum)
        if len(departTime) <= 3:
            departTime = departTime[:1] + ":" + departTime[1:] + "pm"
        else:
            departTime = departTime[:2] + ":" + departTime[2:] + "pm"
    else:
        departTime = str(wholeNum)
        if len(departTime) <= 3:
            departTime = departTime[:1] + ":" + departTime[1:] + "am"
        else:
            departTime = departTime[:2] + ":" + departTime[2:] + "am"

    splitTwo = time[1].split('T')
    removeTwo = splitTwo[1].replace(":","")
    wholeNumTwo = removeTwo[:4]
    if int(wholeNumTwo) > 1300:
        wholeNumTwo = int(wholeNumTwo) - 1200
        arriveTime = str(wholeNumTwo)
        if len(arriveTime) <= 3:
            arriveTime = arriveTime[:1] + ":" + arriveTime[1:] + "pm"
        else:
            arriveTime = arriveTime[:2] + ":" + arriveTime[2:] + "pm"
    else:
        arriveTime = str(wholeNumTwo)
        if len(arriveTime) <= 3:
            arriveTime = arriveTime[:1] + ":" + arriveTime[1:] + "am"
        else:
            arriveTime = arriveTime[:2] + ":" + arriveTime[2:] + "am"
    return departTime,arriveTime