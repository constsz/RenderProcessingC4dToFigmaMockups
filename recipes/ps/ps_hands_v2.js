const recipes = [
  {
    grp: ['1'],
    // grp: [''],
    material: '#plastic',
    preNotation: null,
    notation: [
      {
        outputName: 'mask A_Beauty',
        type: 'mask',
        renderPass: 'A_Beauty',
        processing: [
          {
            effectName: 'Invert',
          },
        ],
      },
      {
        outputName: 'Shades (Multiply, 100%)',
        renderPass: 'Beauty',
        willBeBlendMode: 'Multiply',
        type: 'raster',
        specialMaterial: '#plastic_diffuse',
        processing: [
          {
            effectName: 'Desaturate',
          },
          {
            effectName: 'Levels',
            settings: [27, 205, 1, 0, 255],
          },
        ],
      },
      {
        outputName: 'Shades (Soft Light, 40%)',
        renderPass: 'Beauty',
        willBeBlendMode: 'Soft Light',
        type: 'raster',
        specialMaterial: '#plastic_diffuse',
        processing: [
          {
            effectName: 'Desaturate',
          },
        ],
      },
      {
        outputName: 'Hightlights (Screen, 100%)',
        renderPass: 'SpecularLighting',
        willBeBlendMode: 'Screen',
        type: 'raster',
        processing: [
          {
            effectName: 'composeOnTop',
            blendMode: 'screen',
            opacity: '100',
            renderPass: 'Reflections',
          },
          {
            effectName: 'Desaturate',
          },
          {
            effectName: 'Levels',
            settings: [0, 237, 0.83, 0, 255],
          },
        ],
      },
      {
        outputName: 'Hightlights (Soft Light, 40%)',
        renderPass: 'SpecularLighting',
        willBeBlendMode: 'Soft Light',
        type: 'raster',
        processing: [
          {
            effectName: 'Desaturate',
          },
          {
            effectName: 'Levels',
            settings: [0, 237, 1, 30, 255],
          },
        ],
      },
    ],
  },
  {
    grp: ['2', '3'],
    // grp: [''],
    material: '#plastic',
    preNotation: '1',
    notation: [
      {
        outputName: 'screen_coords',
        type: 'screen_coords',
        renderPass: 'screen_coords',
        suffix: '_1',
      },
      {
        outputName: 'mask Puzzle_2',
        type: 'mask',
        renderPass: 'Puzzle_2',
        processing: [
          {
            effectName: 'Invert',
          },
        ],
      },
      {
        outputName: 'mask PuzzleScreen minus PuzzleGlass',
        type: 'mask_subtract',
        renderPass: 'PuzzleScreen',
        processing: [
          {
            effectName: 'maskSubtract',
            renderPass: 'PuzzleGlass',
          },
          {
            effectName: 'flatten',
          },
          {
            effectName: 'invert',
          },
        ],
      },
      {
        outputName: 'mask PuzzleBodyColor',
        type: 'mask',
        renderPass: 'PuzzleBodyColor',
        processing: [
          {
            effectName: 'Invert',
          },
        ],
      },
      {
        outputName: 'Beauty - bake mask contour Puzzle_2',
        type: 'raster',
        renderPass: 'Beauty',
        processing: [
          {
            effectName: 'cropSizeOptimize',
            mask: {
              renderPass: 'Puzzle_2',
              maximumRadius: 80,
            },
            bgColor: 'white',
            // open mask, apply filter, copy mask, apply to layer,
            // turn off original mask layer, flatten
          },
          {
            effectName: 'Desaturate',
            mask: {
              renderPass: 'PuzzleGlass',
              inverted: true,
            },
          },
        ],
      },
      // // -------------- grp1 →
    ],
  },
  {
    grp: ['4'],
    // grp: [''],
    material: '#plastic',
    preNotation: '1',
    notation: [
      {
        renderPass: 'screen_coords',
        type: 'screen_coords',
        outputName: 'screen_coords',
        suffix: '_1',
      },
      {
        outputName: 'mask Puzzle_2',
        type: 'mask',
        renderPass: 'Puzzle_2',
        processing: [
          {
            effectName: 'Invert',
          },
        ],
      },
      {
        outputName: 'Shades (Hard Light, 45%) - bake mask contour Puzzle_2',
        type: 'raster',
        renderPass: 'Beauty',
        willBeBlendMode: 'Hard Light',
        processing: [
          {
            effectName: 'cropSizeOptimize',
            mask: {
              renderPass: 'Puzzle_2',
              maximumRadius: 80,
            },
            bgColor: 'white',
          },
          {
            effectName: 'Desaturate',
          },
          {
            effectName: 'Levels',
            settings: [0, 255, 1, 0, 138],
          },
        ],
      },
      {
        outputName: 'Highlights (Screen, 100%) - bake mask contour Puzzle_2',
        type: 'raster',
        renderPass: 'Beauty',
        willBeBlendMode: 'Screen',
        processing: [
          {
            effectName: 'cropSizeOptimize',
            mask: {
              renderPass: 'Puzzle_2',
              maximumRadius: 80,
            },
            bgColor: 'white',
          },
          {
            effectName: 'Desaturate',
          },
          {
            effectName: 'Levels',
            settings: [31, 255, 0.16, 0, 138],
          },
        ],
      },
      // -------------- grp1 →
    ],
  },
];

export default () => {
  return recipes;
};
