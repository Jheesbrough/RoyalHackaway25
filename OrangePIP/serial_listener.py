import winsound
import serial
import requests
import time
import asyncio
import random
import concurrent.futures

ser = serial.Serial('COM4', 9600)

def handle_requests(value):
    # Send a request to localhost:3000/evolve
    response = requests.post('http://localhost:3000/evolve', timeout=30)
    print(response.text)

    if response.status_code == 200:
        print("Evolution successful")
        response = requests.post("http://localhost:3000/work-on-issue", timeout=30)
        print(response.text)

async def main():
    timeout = False
    timeLimit = 10
    time_start = time.time()
    above_600_start = None
    with concurrent.futures.ThreadPoolExecutor() as executor:
        while True:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8').strip()
                value = line.split(":")[1]

                if int(value) > 600:
                    pitch = random.randint(900, 1100)
                    duration = random.randint(75, 125)
                    winsound.Beep(pitch, duration)

                    if above_600_start is None:
                        above_600_start = time.time()
                    elif (time.time() - above_600_start) >= 5:
                        print("Value is greater than 600 for 5 seconds, starting cooldown and evolution")
                        timeout = True
                        time_start = time.time()
                        executor.submit(handle_requests, value)
                        above_600_start = None
                else:
                    above_600_start = None

                if timeout:
                    if (time.time() - time_start) > timeLimit:
                        timeout = False

asyncio.run(main())