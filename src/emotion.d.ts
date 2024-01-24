import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      brand?: string;
      primary: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
      };
      base: {
        black: string;
        white: string;
        gray: {
          light: string;
          medium: string;
          dark: string;
          darker: string;
        };
      };
    };
  }
}
