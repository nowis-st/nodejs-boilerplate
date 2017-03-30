const gulp = require('gulp')
const minifyHtml = require('gulp-minify-html')
const minifier = require('gulp-uglify/minifier')
const strip = require('gulp-strip-comments')
const jsonminify = require('gulp-jsonminify')
const del = require('del')
const uglifyjs = require('uglify-js')
const pump = require('pump')
const minifyCss = require('gulp-minify-css')
const path = require('path')
const gulpDocumentation = require('gulp-documentation')
const apidoc = require('gulp-apidoc')
const eslint = require('gulp-eslint')

/**
 * Name of production foler, who will contains production's sources
 * @type {String}
 */
const prodFolderName = 'prod'

gulp.task('lint', () => {
  // ESLint ignores files with "node_modules" paths.
  // So, it's best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  return gulp.src(['**/*.js', '!node_modules/**', '!documentation/**', '!prod/**'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError())
})

/**
 * Delete the existing prod folder
 */
gulp.task('deleteExistingProdFolder', ['lint'], (cb) => {
  del(path.join(__dirname, prodFolderName)).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'))
    cb()
  })
})

/**
 * Delete the existing documentation folder
 */
gulp.task('deleteExistingDocFolder', ['lint'], (cb) => {
  del(path.join(__dirname, 'documentation')).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'))
    cb()
  })
})

/**
 * Minify JS files
 * The deleteExistingProdFolder task is require before this task.
 *
 * We get all JS file, except JS into node_modules and this file.
 * strip() will remove all comments.
 * minifier will minify JS files. We add into the second parameter uglifyjs, specifically
 * add from Harmony branch of UglifyJS project (see package.json).
 * Then, all minified JS files will be send into prod folder.
 */
gulp.task('js', ['lint', 'deleteExistingProdFolder'], () => {
  return pump([
    gulp.src([
      path.join(__dirname, '**', '*.js'),
      '!' + path.join(__dirname, 'node_modules', '**', '*.*'),
      '!' + path.join(__dirname, 'test', '**', '*.*'),
      '!' + path.join(__dirname, 'gulpfile.js'),
      '!' + path.join(__dirname, 'documentation', '**', '*.*')
    ]),
    strip(),
    minifier(null, uglifyjs).on('error', (err) => {
      console.log(err)
    }),
    gulp.dest(path.join(__dirname, prodFolderName))
  ])
})

/**
 * Minify JSON files.
 * The deleteExistingProdFolder task is require before this task.
 */
gulp.task('json', ['lint', 'deleteExistingProdFolder'], () => {
  return gulp.src([
    path.join(__dirname, '**', '*.json'),
    '!' + path.join(__dirname, 'node_modules', '**', '*.*'),
    '!' + path.join(__dirname, 'documentation', '**', '*.*')
  ])
  .pipe(jsonminify())
  .pipe(gulp.dest(path.join(__dirname, prodFolderName)))
})

/**
 * Minify HTML files.
 * The deleteExistingProdFolder task is require before this task.
 *
 * We does not use HTML files but EJS engine files.
 * This make not any problem :)
 */
gulp.task('html', ['lint', 'deleteExistingProdFolder'], () => {
  return gulp.src([
    path.join(__dirname, 'views', '**', '*.ejs'),
    '!' + path.join(__dirname, 'node_modules', '**', '*.*'),
    '!' + path.join(__dirname, 'documentation', '**', '*.*')
  ])
  .pipe(minifyHtml())
  .pipe(gulp.dest(path.join(__dirname, prodFolderName, 'views')))
})

/**
 * Minify public JS files.
 * The deleteExistingProdFolder task is require before this task.
 *
 * Very similary than previous JS task.
 */
gulp.task('public:js', ['lint', 'deleteExistingProdFolder'], () => {
  return pump([
    gulp.src([
      path.join(__dirname, 'public', 'js', '*.js'),
      '!' + path.join(__dirname, 'node_modules', '**', '*.*'),
      '!' + path.join(__dirname, 'documentation', '**', '*.*')
    ]),
    strip(),
    minifier(null, uglifyjs),
    gulp.dest(path.join(__dirname, prodFolderName, 'public', 'js'))
  ])
})

/**
 * Minify CSS files.
 * The deleteExistingProdFolder task is require before this task.
 */
gulp.task('public:css', ['lint', 'deleteExistingProdFolder'], () => {
  return gulp.src([
    path.join(__dirname, 'public', 'css', '*.css'),
    '!' + path.join(__dirname, 'node_modules', '**', '*.*'),
    '!' + path.join(__dirname, 'documentation', '**', '*.*')
  ])
  .pipe(minifyCss())
  .pipe(gulp.dest(path.join(__dirname, prodFolderName, 'public', 'css')))
})

/**
 * Generate developer documentation in HTML format
 */
gulp.task('generate-html-doc', ['deleteExistingDocFolder'], () => {
  return gulp.src('./bundles/**/*.js')
    .pipe(gulpDocumentation('html', {}, {
      name: 'Boilerplate',
      version: '1.0.0'
    }))
    .pipe(gulp.dest(path.join(__dirname, 'documentation', 'developer')))
})

/**
 * Generate API documentation in HTML format
 */
gulp.task('generate-api-doc', ['deleteExistingDocFolder'], (done) => {
  apidoc({
    src: path.join(__dirname, 'bundles'),
    dest: path.join(__dirname, 'documentation', 'api'),
    debug: false,
    config: path.join(__dirname, 'config', 'apidoc')
  }, done)
})

/**
 * Default task.
 * Will run when `gulp` command will used without parameter.
 */
gulp.task('default', ['lint', 'deleteExistingProdFolder', 'deleteExistingDocFolder', 'generate-html-doc', 'generate-api-doc', 'js', 'json', 'html', 'public:js', 'public:css'])
