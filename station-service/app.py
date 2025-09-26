import os
import time
import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS

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

@app.route('/stations', methods=['GET'])
def get_stations():
    cursor.execute("SELECT id, name, location, capacity, available FROM stations;")
    stations = [
        {"id": row[0], "name": row[1], "location": row[2], "capacity": row[3], "available": row[4]}
        for row in cursor.fetchall()
    ]
    return jsonify(stations)

@app.route('/stations', methods=['POST'])
def add_station():
    data = request.get_json()
    cursor.execute(
        "INSERT INTO stations (name, location, capacity, available) VALUES (%s,%s,%s,%s) RETURNING id;",
        (data["name"], data["location"], data["capacity"], data["available"])
    )
    station_id = cursor.fetchone()[0]
    conn.commit()
    return jsonify({"id": station_id, **data}), 201

@app.route('/stations/<int:station_id>', methods=['PUT'])
def update_station(station_id):
    data = request.get_json()
    cursor.execute(
        "UPDATE stations SET name=%s, location=%s, capacity=%s, available=%s WHERE id=%s RETURNING id;",
        (data["name"], data["location"], data["capacity"], data["available"], station_id)
    )
    if cursor.rowcount == 0:
        return jsonify({"error": "Station not found"}), 404
    conn.commit()
    return jsonify({"id": station_id, **data}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

