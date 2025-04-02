//

import { isMathjaxRegExp, MathjaxContent } from './models';

//
export const isMathjax = (expression: string): boolean =>
  !!expression?.match(isMathjaxRegExp);

//
/**
 * find and return mathjax string from input
 * @param expressions
 * @returns mathjax string
 */
export const getMathjaxContent = (
  expressions: MathjaxContent | string
): string => {
  if (!expressions) return '';
  else if ('string' === typeof expressions) return expressions as string;
  else return expressions.latex ?? expressions.mathml ?? '';
};
/**
 * used to fix few issues with mathjax string in angular
 * @param  {string} jax mathjax string
 * @returns {string} fixed string
 */
export const fixMathjaxBugs = (jax: string): string => {
  return jax
    // line break error
    .replace(/<br \/>/gi, '<br/> ')
    // automatic breakline
    .replace(/[$]([\s\S]+?)[$]/gi, (m, p: string, o, s) => {
      //return /s/gi.test(p)
      return p.includes('\\\\') && !p.includes('\\begin')
        ? `$\\begin{align*}${p}\\end{align*}$`
        : `$${p}$`;
    });
};

/**
 * Fix space for mathjax string
 * @param  {string} jax mathjax string
 * @returns {string} fixed string
 */
export const fixMathjaxSpacing = (jax: string): string => {
  let arr = jax.split('$');
  for (let i = 0; i < arr.length; i++) {
    const str = arr[i];
    if (i % 2) {
      arr[i] = arr[i].replace(/\s/gi, '~');
    }
  }
  return arr.join('$');
};
