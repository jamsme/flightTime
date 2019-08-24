from django.shortcuts import render, redirect

def index(request):
    return render(request, "pilot/index.html")

def calculate(request):
    p = request.POST

    if request.method == 'POST':

        wind = p['wind']
        speed = p['speed']
        depart = p['departing']
        arrive = p['arriving']
        
        if speed == '':
            speed = 140

        print(wind)
        print(speed)
        print(depart)
        print(arrive)

        return redirect("/")