var htmlparser = require("htmlparser2"),
    fs = require("fs"),
    path = require("path"),
    vow = require('vow'),
    promisify = require('vow-node').promisify,
    //htmlSource = process.argv[2] ? path.resolve(process.argv[2]) : 'index.html',
    classes = [],
    stat = promisify(fs.stat);

/**
 * Returns unique CSS class names from html string in source file order.
 * @param {string} html
 * @returns {string[]} class names
 */
function getClasses(html) {
    var parser = new htmlparser.Parser({
        onopentag: function(name, attribs){
            if(attribs.class){
                attribs.class.split(' ').forEach(function(className) {
                    (classes.indexOf(className) === -1) && classes.push(className);
                });
            }
        },
    }, {decodeEntities: true});
    parser.write(html);
    parser.end();
    return classes;
}

/**
 * Returns file names from CSS classes with redifinition levels on fs.
 * @param {string[]} blocks
 * @param {string[]} levels
 * @returns {string[]}
 */
function getFilesFromBlocks(blocks, levels) {
    var cssFiles = [],
        blockDirs = [];

    return vow.all(levels.map(function(level) {
        return vow.allResolved(blocks.map(function(blockName) {
            var dirName = path.resolve('./' + level + '/' + blockName + '/');
            return stat(dirName).then(function (stats) {
                if (stats.isDirectory()) {
                    blockDirs.push(dirName);
                    var fileName = path.resolve(dirName + '/' + blockName + '.css');
                }
                if (fs.statSync(fileName).isFile()) {
                    cssFiles.push(fileName);
                }
                return stats;
            });
        }));
    })).then(function() {
        return { css: cssFiles, dirs: blockDirs };
    });
}

/**
 * Возвращает объект со списком css файлов.
 * Имена файлов извлекаются из классов DOM-узлов html файла, который передается как params.index
 * @param {Object} params
 * @param {string} params.index html file name for parsing
 * @param {(string|string[])} params.levels — redefinition levels
 *
 **/
exports.files = function(params) {
    var htmlSrc = fs.readFileSync(params.index, 'utf8'),
        blocks = getClasses(htmlSrc);

    return getFilesFromBlocks(blocks, params.levels).then(function(files) {
        return files;
    });
};
