const recipes = [
  {
    grp: ['2'],
    material: '#plastic',
    notation: [
      {
        renderPass: 'screen_coords',
        type: 'screen_coords',
        outputName: 'screen_coords',
        suffix: '_1',
      },
      {
        type: 'mask',
        renderPass: 'A_Beauty',
        outputName: 'mask Main',
        processing: [
          {
            effectName: 'Invert',
          },
        ],
      },
      {
        type: 'mask',
        renderPass: 'Puzzle_2',
        outputName: 'mask Phone',
        processing: [
          {
            effectName: 'Invert',
          },
        ],
      },
      {
        type: 'mask',
        renderPass: 'PuzzleBodyColor',
        outputName: 'mask Phone Body',
        processing: [
          {
            effectName: 'Invert',
          },
        ],
      },
      {
        type: 'mask-comp',
        renderPass: 'PuzzleScreen minus PuzzleGlass',
        outputName: 'mask Screen',
        processing: [
          {
            // exclude PuzzleGlass from PuzzleScreen
            // effectName: 'Invert',
          },
        ],
      },
      // {
      //   renderPass: 'Beauty',
      //   type: 'raster',
      //   outputName: 'Shades',
      //   specialMaterial: '#plastic_diffuse',
      //   processing: [
      //     {
      //       effectName: 'Desaturate',
      //     },
      //     {
      //       effectName: 'Levels',
      //       settings: [0, 255, 0.83, 0, 255],
      //     },
      //   ],
      // },
      // {
      //   renderPass: 'SpecularLighting',
      //   type: 'raster',
      //   outputName: 'Hightlights (Screen 100%)',
      //   processing: [
      //     {
      //       effectName: 'Desaturate',
      //     },
      //     {
      //       effectName: 'Levels',
      //       settings: [0, 255, 0.83, 0, 255],
      //     },
      //   ],
      // },
      // {
      //   renderPass: 'SpecularLighting',
      //   type: 'raster',
      //   outputName: 'Hightlights (Soft Light 100%)',
      //   processing: [
      //     {
      //       effectName: 'Desaturate',
      //     },
      //     {
      //       effectName: 'Levels',
      //       settings: [0, 237, 1.1, 30, 255],
      //     },
      //   ],
      // },
    ],
  },
];

export default () => {
  return recipes;
};
