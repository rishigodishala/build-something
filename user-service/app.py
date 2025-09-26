import os
import time
import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# DB credentials from environment variables
DB_HOST = os.environ.get("DB_HOST", "postgres")
DB_NAME = os.environ.get("DB_NAME", "evcharging")
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "postgres")

# Retry until PostgreSQL is ready
for _ in range(10):
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = conn.cursor()
        print("Connected to PostgreSQL!")
        break
    except psycopg2.OperationalError:
        print("Waiting for database to be ready...")
        time.sleep(5)
else:
    raise Exception("Could not connect to PostgreSQL after 10 attempts")

@app.route('/search', methods=['GET'])
def search_stations():
    location = request.args.get('location', 'Stockholm')
    cursor.execute("SELECT id, name, location, available FROM stations WHERE location=%s;", (location,))
    stations = [
        {"station_id": row[0], "name": row[1], "location": row[2], "available": row[3]}
        for row in cursor.fetchall()
    ]
    return jsonify(stations)

@app.route('/book', methods=['POST'])
def book_station():
    data = request.get_json()
    user_name = data["user"]
    station_id = data["station_id"]
    time_val = data.get("time", datetime.now())

    # Check availability
    cursor.execute("SELECT available FROM stations WHERE id=%s;", (station_id,))
    row = cursor.fetchone()
    if not row or row[0] <= 0:
        return jsonify({"error": "No available slots"}), 400

    # Create booking
    cursor.execute(
        "INSERT INTO bookings (user_name, station_id, time) VALUES (%s, %s, %s) RETURNING id;",
        (user_name, station_id, time_val)
    )
    booking_id = cursor.fetchone()[0]

    # Update availability
    cursor.execute("UPDATE stations SET available = available - 1 WHERE id=%s;", (station_id,))

    conn.commit()
    return jsonify({"id": booking_id, "user": user_name, "station_id": station_id, "time": str(time_val)}), 201

@app.route('/bookings', methods=['GET'])
def get_bookings():
    cursor.execute("SELECT id, user_name, station_id, time FROM bookings;")
    bookings = [
        {"id": row[0], "user": row[1], "station_id": row[2], "time": str(row[3])}
        for row in cursor.fetchall()
    ]
    return jsonify(bookings)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

