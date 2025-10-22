from machine import Pin, ADC
from time import sleep_us, sleep, ticks_us

# === Pin setup ===
# Soil sensor
soil = ADC(Pin(26))  # analog pin for soil moisture

# Ultrasonic distance sensor
TRIG = Pin(3, Pin.OUT)
ECHO = Pin(2, Pin.IN)

# LEDs
led_red = Pin(13, Pin.OUT)
led_yellow = Pin(14, Pin.OUT)
led_green = Pin(15, Pin.OUT)

# === Calibration values for soil ===
DRY_VALUE = 60000   # sensor in dry soil (air)
WET_VALUE = 30000   # sensor in wet soil (water-saturated)

# === Calibration for water level (ultrasonic) ===
BOTTLE_EMPTY_CM = 22.0   # distance when bottle is empty
BOTTLE_FULL_CM = 3.0     # distance when bottle is full

# === Utility functions ===
def read_soil():
    """Return soil moisture in % (0-100)."""
    raw = soil.read_u16()
    percent = (DRY_VALUE - raw) * 100 / (DRY_VALUE - WET_VALUE)
    percent = max(0, min(100, percent))
    return raw, percent

def read_distance():
    """Return measured distance in cm."""
    TRIG.low()
    sleep_us(2)
    TRIG.high()
    sleep_us(10)
    TRIG.low()

    # Wait for echo start
    while ECHO.value() == 0:
        signaloff = ticks_us()
    # Wait for echo end
    while ECHO.value() == 1:
        signalon = ticks_us()

    time_passed = signalon - signaloff
    distance = (time_passed * 0.0343) / 2  # cm
    return distance

def water_level_percent(distance):
    """Convert distance to water level percentage."""
    if distance > BOTTLE_EMPTY_CM:
        return 0
    elif distance < BOTTLE_FULL_CM:
        return 100
    else:
        percent = (BOTTLE_EMPTY_CM - distance) * 100 / (BOTTLE_EMPTY_CM - BOTTLE_FULL_CM)
        return percent

# === LED indication logic ===
def update_leds(soil_percent):
    """Light LEDs based on soil moisture."""
    if soil_percent < 30:
        led_red.on()
        led_yellow.off()
        led_green.off()
    elif soil_percent < 60:
        led_red.off()
        led_yellow.on()
        led_green.off()
    else:
        led_red.off()
        led_yellow.off()
        led_green.on()

# === Main loop ===
while True:
    raw_soil, soil_percent = read_soil()
    distance = read_distance()
    water_percent = water_level_percent(distance)

    update_leds(soil_percent)

    print(f"Soil: {soil_percent:5.1f}% | Water: {water_percent:5.1f}% full (distance {distance:4.1f} cm)")
    
    sleep(2)
