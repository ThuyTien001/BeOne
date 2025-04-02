/**
 * more complex mathjax content which support latex and MathML separately
 * will be considered for future development
 */
export interface MathjaxContent {
    latex?: string;
    mathml?: string;
}
/**
 * will help to check if expression is valid majax or not
 */
export const isMathjaxRegExp = /(?:\$|\\\(|\\\[|\\begin\{.*?})/;
//export const isMathJax = /(?:(?:^|[-+_*/])(?:\s*-?\d+(\.\d+)?(?:[eE][+-]?\d+)?\s*))+$/;
//
export const mathjax_url =
    'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/startup.js';

/**
 * config - http://docs.mathjax.org/en/latest/web/configuration.html#configuring-and-loading-mathjax
 */
export const MathjaxDefaultConfig = {
    loader: {
        load: ['output/chtml', '[tex]/require', '[tex]/ams'],
    },
   
    tex: {
        inlineMath: [['$', '$']],
        //displayMath: [['$$', '$$']],
        packages: ['base', 'require', 'ams'],
    },
    svg: { fontCache: 'global' },
    options: {
        processHtmlClass: 'mathjax-process',
        ignoreHtmlClass: 'no-mathjax',
    },
};
/**
 * config - http://docs.mathjax.org/en/latest/web/configuration.html#configuring-and-loading-mathjax
 * src - cdn url to js
 */
export class RootMathjaxConfig {
    config?: { [name: string]: any };
    src?: string;
}
