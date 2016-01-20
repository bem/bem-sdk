var fs = require('fs'),
    path = require('path');

module.exports = {

    /**
     * Duplicate of the real file system for passed dir, used for mock fs for tests
     * @param {String} dir – filename of directory (full path to directory)
     * @returns {Object} - object with duplicating fs
     */
    duplicateFSInMemory: function (dir) {
        var _this = this,
            obj = {};

        /**
         * Function to traverse the directory tree
         * @param {Object} obj
         * @param {String} root
         * @param {String} dir
         */
        function process(obj, root, dir) {
            var dirname = dir ? path.join(root, dir) : root,
                basename = dir || root,
                additionObj = obj[basename] = {};

            fs.readdirSync(dirname).forEach(function (basename) {
                var filename = path.join(dirname, basename),
                    stat = fs.statSync(filename);

                if (stat.isDirectory()) {
                    process(additionObj, dirname, basename);
                } else {
                    additionObj[basename] = _this.readFile(filename);
                }
            });
        }

        fs.readdirSync(dir).forEach(function (basename) {
            var filename = path.join(dir, basename),
                stat = fs.statSync(filename);

            if (stat.isDirectory()) {
                process(obj, dir, basename);
            } else {
                obj[basename] = _this.readFile(filename);
            }
        });

        return obj;
    },

    /**
     * Helper for reading file.
     * For text files calls a function to delete /r symbols
     * @param {String} filename
     * @returns {*}
     */
    readFile: function (filename) {
        var ext = path.extname(filename);

        if (['.gif', '.png', '.jpg', '.jpeg', '.svg'].indexOf(ext) !== -1) {
            return fs.readFileSync(filename);
        }

        return fs.readFileSync(filename, 'utf-8');
    },

    /**
     * 1. Remove all css comments, because they going to remove after @import stylus
     * 2. Remove all spaces and white lines
     * @param str {String}
     * @returns {String}
     */
    normalizeFile: function (str) {
        return str
            .replace(/(\r\n|\n|\r)/gm, '') // remove line breaks
            .replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '') // spaces
            .trim();
    }
};
