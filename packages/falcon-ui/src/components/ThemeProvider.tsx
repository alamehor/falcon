import React from 'react';
import { ThemeProvider as Provider } from 'emotion-theming';
import { Global, CacheProvider } from '@emotion/core';
import createCache from '@emotion/cache';
import { createTheme, Theme, CSSObject } from '../theme';
import { Root } from './Root';

// re-export withTheme from emotion so theme can be accessed from code
export { withTheme } from 'emotion-theming';

// IMPORTANT: those styles get injected as global styles
// every other reset style can be applied on Root component but not body margin
const tinyNormalizeStyles: CSSObject = {
  body: {
    margin: 0
  }
};
// IMPORTANT: temporary hack/workaround for not rendering styles
// when using emotion together with react-apollo after error on the server occured
// falcon-ui ThemeProvider now renders CacheProvider with always new cache provided when running on the server
// analogous to https://github.com/emotion-js/emotion/blob/master/packages/core/src/context.js#L54
const isServer = typeof document === 'undefined';
const cache = createCache();

export type ThemeProviderProps = {
  theme?: Theme;
  globalCss?: CSSObject;
  withoutRoot?: boolean;
};
export const ThemeProvider: React.SFC<ThemeProviderProps> = ({
  theme = createTheme(),
  globalCss = tinyNormalizeStyles,
  withoutRoot = false,
  ...rest
}) => (
  <CacheProvider value={isServer ? createCache() : cache}>
    <Provider theme={theme}>
      <Global styles={globalCss} />
      {withoutRoot ? rest.children : <Root {...rest} />}
    </Provider>
  </CacheProvider>
);
