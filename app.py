from flask import Flask, jsonify, render_template, request
import random
from datetime import datetime, timedelta

app = Flask(__name__)

# Country → City list (feel free to expand)
CITY_MAP = {
    "India":      ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"],
    "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
    "United Kingdom": ["London", "Manchester", "Birmingham", "Glasgow", "Edinburgh"],
}

# Very rough “average” base temps by city
BASE_TEMP = {
    "Delhi": 32, "Mumbai": 30, "Bangalore": 26, "Chennai": 31, "Kolkata": 29,
    "New York": 22, "Los Angeles": 24, "Chicago": 20, "Houston": 28, "Phoenix": 33,
    "London": 18, "Manchester": 17, "Birmingham": 17, "Glasgow": 15, "Edinburgh": 14,
}

def generate_hourly_temps(city: str):
    base = BASE_TEMP.get(city, 25)
    now = datetime.utcnow()
    labels, temps = [], []
    for i in range(24):
        t = now - timedelta(hours=23 - i)
        labels.append(t.strftime('%H:%M'))
        temps.append(round(random.uniform(base - 3, base + 3), 1))
    return labels, temps

# ---------- Routes ----------
@app.route('/')
def home():
    return render_template('index.html', countries=list(CITY_MAP.keys()))

@app.route('/cities')
def cities():
    country = request.args.get('country')
    return jsonify(CITY_MAP.get(country, []))

@app.route('/data')
def data():
    city = request.args.get('city')
    labels, temps = generate_hourly_temps(city)
    return jsonify({'labels': labels, 'temps': temps})

if __name__ == '__main__':
    app.run(debug=True)
