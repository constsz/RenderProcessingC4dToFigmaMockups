# 3D Renders Processing system

## Renders from Cinema4D -> Processing -> Photoshop -> Figma

<br>

## Use Case:

**Input, starting point**: A folder with 3D renders from Cinema 4D with multiple layers (masks, reflections) and a json-database with props.

**Final output**: color-processed base64 image set with beauty renders and necessary layers (reflections, vector masks) prepared for importing to Figma. This includes compositing, color correction, post-processing and layering render image, converting masks to vector.

This will allow to get a photorealistic object in Figma, that will be ready for customization: changing colors, changing materials, cameras, etc.

<br>

This project also has another backend for importing results to Figma, but it was unfinished, yet prototype was working successfully.

<br>

## Project Structure

<br>

```
ENTRY POINT:
./src/App.js


COMPONENTS:

■ src - Main App Components

    • dataManipulation - models and methods for interacting with file system and database

    • imageProcessingModules - processing methods for GraphicsMagick, Python module, and running Photoshop as a processing unit.

    • processing - instructions of a sequence of methods

    • utils - generic helper functions.

■ python - simple Python component to convert raster image to vector mask for Figma using OpenCV.

■ recipes - unified interface to interact with this app and telling it what to do and how. This allows use for very wide range of 3D projects to cover any unique case.


```

<br>

Unfinished:

- Uploading functionality to upload files to CDN and VPS storage.
- Uploading meta-data to mongodb
