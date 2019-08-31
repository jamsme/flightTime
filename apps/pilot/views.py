from django.shortcuts import render, redirect
from django.contrib import messages

def index(request):
    if "wind" and "speed" and "arrive" and "depart" in request.session: 
        print(request.session['wind'])
        print(request.session['speed'])
        print(request.session['depart'])
        print(request.session['arrive'])
        
    return render(request, "pilot/index.html")

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