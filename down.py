import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BCM)

one_pin = 18

GPIO.setup(one_pin, GPIO.OUT)


GPIO.output(one_pin, False)
time.sleep(7)
GPIO.output(one_pin, True)
GPIO.cleanup()