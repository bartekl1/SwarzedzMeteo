from flask import Flask, render_template, send_file
import requests
import cachetools.func

import json

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
    try:
        r = requests.get(f'{configs["remote_url"]}/api/current_reading')
    except Exception:
        return {
            'status': 'error',
            'error': 'remote_host_error'
        }

    if r.status_code == 200:
        rj = r.json()
    else:
        return {
            'status': 'error',
            'error': 'remote_host_error'
        }

    if rj['status'] == 'error' and rj['error'] == 'sensor_error':
        return {
            'status': 'error',
            'error': 'sensor_error'
        }
    elif rj['status'] == 'error':
        return {
            'status': 'error',
            'error': 'other_error'
        }

    return {
        'status': 'ok',
        'temperature': round(rj['ds18b20']['temperature'], 1),
        'humidity': round(rj['bme280']['humidity']),
        'pressure': round(rj['bme280']['pressure']),
        'dewpoint': round(((rj['bme280']['humidity'] / 100) ** (1 / 8)) * (112 + (0.9 * rj['ds18b20']['temperature'])) + (0.1 * rj['ds18b20']['temperature']) - 112, 1)
    }


if __name__ == '__main__':
    host = configs['host'] if 'host' in configs.keys() else None
    port = configs['port'] if 'port' in configs.keys() else None
    debug = configs['debug'] if 'debug' in configs.keys() else None

    app.run(host=host, port=port, debug=debug)
