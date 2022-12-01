import sys
import os
import shutil
import numpy as np
import cv2
import json


""" 
1. Get a list of files from path (from user input)
2. Loop through each image (check if it's raster image)
3. each image pass to find_corners(), return array
4. create a dictionary, that has the following format:
    'image-name': [323, 342, 2123, 4231]
5. convert to JSON and write to file to '../screen_coords'

"""

""" USER INPUT FIELDS """
file = sys.argv[1]
""" ↑  ↑  ↑ """


# read
img = cv2.imread(file)

# get only file name
file_name = os.path.split(file)[1]
file_name = os.path.splitext(file_name)[0]  # get rid of extension

# convert to gray
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# corner detection
corners = cv2.goodFeaturesToTrack(gray, 4, 0.03, 4)
# convert to np array
corners = np.int0(corners)

item_screen_coords = []

for corner in corners:
    # flatten the multi-dimensional array
    x,y = corner.ravel()
    coords = [int(x),int(y)]
    item_screen_coords.append(coords)

print (json.dumps(item_screen_coords))

exit()