import pyautogui
import time
import random
import math

# Disable the PyAutoGUI fail-safe
pyautogui.FAILSAFE = False

def move_to_corner_randomly(steps=100, delay=0.01):
    # Get the current mouse position
    start_x, start_y = pyautogui.position()
    
    # Target position (top-left corner)
    target_x, target_y = 0, 0
    
    # Calculate the distance to the target
    distance_x = target_x - start_x
    distance_y = target_y - start_y
    
    for _ in range(steps):
        # Calculate the step size for each axis
        step_x = distance_x / steps
        step_y = distance_y / steps
        
        # Add a small random variation to the path
        move_x = step_x + random.uniform(-5, 5)
        move_y = step_y + random.uniform(-5, 5)
        
        # Move the mouse to the new position
        pyautogui.move(start_x + move_x, start_y + move_y)
        
        # Update the current position
        start_x += move_x
        start_y += move_y
        
        # Delay to make the movement visible
        time.sleep(delay)
        
    # Final click at the top-left corner
    pyautogui.click(target_x, target_y)

# Run the movement in a loop
for _ in range(5000):  # Run the loop 5 times, adjust as needed
    move_to_corner_randomly()
    time.sleep(1)  # Delay between movements
