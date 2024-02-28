from flask import Flask, render_template, send_file, Response
import requests
import cachetools.func

import datetime
import json
import os

with open('configs.json') as file:
    configs = json.load(file)

ttl = configs['ttl'] if 'ttl' in configs.keys() else 0

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html', configs=configs)


@app.route('/manifest.json')
def manifest():
    return send_file('static/manifest.json')


@app.route('/manifest_en.json')
def manifest_en():
    return send_file('static/manifest_en.json')


@app.route('/sw.js')
def sw():
    return send_file('static/js/sw.js')


@app.route('/favicon.ico')
def favicon():
    return send_file('static/img/icon.ico')


@app.route('/api/current_readings')
@cachetools.func.ttl_cache(maxsize=128, ttl=ttl)
def current_readings():
    status = 200

    try:
        r = requests.get(f'{configs["remote_url"]}/api/current_reading')
    except Exception:
        rd = {
            'status': 'error'
        }
        status = 500

    if status == 200:
        if r.status_code == 200:
            rj = r.json()
        else:
            rd = {
                'status': 'error'
            }
            status = 500

    if status == 200:
        if rj['status'] == 'error':
            rd = {
                'status': 'error'
            }
            status = 500
        elif rj['status'] == 'error':
            rd = {
                'status': 'error'
            }
            status = 500

    if status == 200:
        rd = {
            'status': 'ok'
        }

        dt = datetime.datetime.fromisoformat(rj['date'])
        dt_utc = datetime.datetime.utcfromtimestamp(dt.timestamp())
        rd['date'] = dt_utc.isoformat()

        try:
            if rj['ds18b20']['temperature'] is not None:
                rd['temperature'] = round(rj['ds18b20']['temperature'], 1)
            else:
                rd['temperature'] = None
        except Exception:
            rd['temperature'] = None

        try:
            if rj['bme280']['humidity'] is not None:
                rd['humidity'] = round(rj['bme280']['humidity'])
            else:
                rd['humidity'] = None
        except Exception:
            rd['humidity'] = None

        try:
            if rj['bme280']['pressure'] is not None:
                rd['pressure'] = round(rj['bme280']['pressure'])
            else:
                rd['pressure'] = None
        except Exception:
            rd['pressure'] = None

        try:
            if rj['ds18b20']['temperature'] is not None and rj['bme280']['humidity'] is not None:
                rd['dewpoint'] = round(((rj['bme280']['humidity'] / 100) ** (1 / 8)) * (112 + (0.9 * rj['ds18b20']['temperature'])) + (0.1 * rj['ds18b20']['temperature']) - 112, 1)
            else:
                rd['dewpoint'] = None
        except Exception:
            rd['dewpoint'] = None

        try:
            if rj['pms5003']['pm1.0'] is not None:
                rd['pm1.0'] = rj['pms5003']['pm1.0']
            else:
                rd['pm1.0'] = None
        except Exception:
            rd['pm1.0'] = None

        try:
            if rj['pms5003']['pm2.5'] is not None:
                rd['pm2.5'] = rj['pms5003']['pm2.5']
            else:
                rd['pm2.5'] = None
        except Exception:
            rd['pm2.5'] = None

        try:
            if rj['pms5003']['pm10'] is not None:
                rd['pm10'] = rj['pms5003']['pm10']
            else:
                rd['pm10'] = None
        except Exception:
            rd['pm10'] = None

        try:
            if rj['pms5003']['pm10'] is not None and rj['pms5003']['pm2.5'] is not None:
                rd['aqi'] = round(((rj['pms5003']['pm10'] / 1.8) + (rj['pms5003']['pm2.5'] / 1.1)) / 2)
            else:
                rd['aqi'] = None
        except Exception:
            rd['aqi'] = None

    res = Response(
        json.dumps(rd, indent=4),
        status=status,
        mimetype='application/json'
    )

    res.headers['Access-Control-Allow-Origin'] = '*'
    return res


@app.route('/api/announcements')
def announcements():
    if os.path.isfile('announcements.json'):
        try:
            with open('announcements.json', encoding='utf-8') as file:
                announcements = json.load(file)

            res = Response(
                json.dumps({
                    'status': 'ok',
                    'announcements': announcements
                }),
                status=200,
                mimetype='application/json'
            )
        except Exception:
            res = Response(
                json.dumps({
                    'status': 'error'
                }),
                status=500,
                mimetype='application/json'
            )
    else:
        res = Response(
            json.dumps({
                'status': 'ok',
                'announcements': []
            }),
            status=200,
            mimetype='application/json'
        )

    res.headers['Access-Control-Allow-Origin'] = '*'
    return res


@app.route('/api/status')
@cachetools.func.ttl_cache(maxsize=128, ttl=ttl)
def status():
    try:
        r = requests.get(f'{configs["remote_url"]}/api/current_reading')
        station_up = True
    except Exception:
        station_up = False
    
    if station_up:
        if r.status_code == 200:
            rj = r.json()
        else:
            station_up = False
    
    if station_up:
        ds18b20 = rj['ds18b20']['temperature'] is not None
        bme280 = rj['bme280']['humidity'] is not None and \
            rj['bme280']['pressure'] is not None
        pms5003 = rj['pms5003']['pm1.0'] is not None and \
            rj['pms5003']['pm2.5'] is not None and \
            rj['pms5003']['pm10'] is not None
        everything = station_up and ds18b20 and bme280 and pms5003
    else:
        ds18b20 = False
        bme280 = False
        pms5003 = False
        everything = False

    res = Response(
        json.dumps({
            'status': 'ok',
            'station': station_up,
            'ds18b20': ds18b20,
            'bme280': bme280,
            'pms5003': pms5003,
            'everything': everything
        }),
        status=200,
        mimetype='application/json'
    )

    res.headers['Access-Control-Allow-Origin'] = '*'
    return res


if __name__ == '__main__':
    host = configs['host'] if 'host' in configs.keys() else None
    port = configs['port'] if 'port' in configs.keys() else None
    debug = configs['debug'] if 'debug' in configs.keys() else None

    app.run(host=host, port=port, debug=debug)
