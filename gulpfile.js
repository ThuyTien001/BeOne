/* eslint-disable */
var gulp = require('gulp');
var javascriptObfuscator = require('gulp-javascript-obfuscator');

exports.obfuscator = function (cb) {
    gulp.src('dist/**/*.js')
        .pipe(javascriptObfuscator())
        .pipe(gulp.dest('dist'));
    cb();
};

// ------------------------------------------------------------------------
// Merge I18n JSON
// ------------------------------------------------------------------------

var merge = require('gulp-merge-json');

function mergeEnJson(cb) {
    gulp.src('src/i18n/**/en.json')
        .pipe(merge({
            fileName: 'en.json'
        }))
        .pipe(gulp.dest('./output-i18n'));
    if (cb) cb();
}
function mergeViJson(cb) {
    gulp.src('src/i18n/**/vi.json')
        .pipe(merge({
            fileName: 'vi.json'
        }))
        .pipe(gulp.dest('./output-i18n'));
    if (cb) cb();
}

exports.mergeI18nJson = function (cb) {
    mergeEnJson();
    mergeViJson();
    cb();
}

exports.WatchMergeI18nJson = function (cb) {
    gulp.watch('src/i18n/**/en.json', mergeEnJson);
    gulp.watch('src/i18n/**/vi.json', mergeViJson);
    cb();
}
