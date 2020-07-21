const express = require('express');
const router = express.Router();
const path              = require('path');
const moment            = require('moment');
const fs                = require('fs');
const numeral           = require('numeral');
const helpers           = require('./helpers');
const BrowserObject     = require('./browserObject');
const UploadObject = require('./uploadObject');

router.post('/files', function(req, res, next){

    const root_url  = path.resolve(helpers.root_url)+'/';

    const relPath   = req.body.path || '';
    const action    = req.body.action || 'item';
    const name      = req.body.name || '';
    const filepath  = req.body.filepath || '';
    const target    = req.body.target || '';

    const create    = action == 'create';
    const move      = action == 'move';
    const remove    = action == 'remove';
    const items     = action == 'items';
    const folder    = action == 'folder';

    const results   = new BrowserObject;

    var files       = [];
    var $path       = root_url;
    var filename    = helpers.sanitize_filename(name);


    try {
        var exists = fs.lstatSync(root_url+relPath);

        if (exists.isDirectory() && (root_url+relPath).indexOf(root_url) == 0) {
            $path = fs.realpathSync((root_url + relPath).replace(/[\/]+/g, '/')) + '/';
        }

        if (create) {
            fs.mkdirSync($path + filename);
            results.err = 0;
            results.msg.push(`Folder ${filename} was created.`);
        }

        if (remove) {
            try {
                if (target) {
                    fs.unlinkSync($path + target);
                } else {
                    fs.rmdirSync($path);
                }
                results.err = 0;
                results.msg.push('Successfully removed ' + path.basename($path));
            } catch (e) {
                results.err = -1;
                results.msg.push('Folder must be empty or file must not be write protected');
            }
        }

        if (move) {
            var oldPath = fs.realpathSync((root_url + filepath).replace(/[\/]+/g, '/'));
            var newPath = $path + path.basename(filepath);
            try {
                fs.renameSync(oldPath, newPath);
            } catch (e) {
                results.err = -1;
                results.msg.push('Cannot move file or folder to the specified location.');
            }
        }

    } catch (e) {
        console.log("lstatSync", e);

        results.err = -1;
        results.msg.push('Root folder does not exist');
    }

    results.path = $path.replace(root_url, '');

    if (!$path) {
        results.error = 10;
        results.msg = "Need path";
    }

    if (folder || items) {
        try {
            files = fs.readdirSync($path);
        } catch (e) {
            console.log(e)

            results.err = -1;
            results.msg.push('Folder does not exist');
        }

        if (folder) {
            if ($path == root_url) {
                results.files.push('.');

                results.err = 0;
                results.msg.push('This is the root folder');
            } else {
                results.files.push('..');
            }
        }
    }

    if (items && !files.length) {
        results.msg.push('This folder is empty');
    }

    if (files.length) {
        files.forEach((file) => {

            var item = fs.lstatSync($path+file);
            var actionCheck;

            if (folder && item.isDirectory()) {
                results.files.push(file);
            }

            if (items && item.isFile()) {
                var s = numeral(item.size);
                var size = s.format('0.00 b');
                var changed = moment(item.ctime).format('MM/DD/YYYY hh:mm:ss a');
                results.files.push({
                    file,
                    size,
                    changed
                });
            }
        });
    }

    res.json(results);
});
router.post('/uploads', function(req, res, next){

    const root_url = path.resolve(helpers.root_url) + '/';
    const relPath = req.body.path;

    var $path = root_url + relPath;

    const results = new UploadObject;

    const error_handler = helpers.error_handler.bind({}, results);

    // Put the files in a `{filename: file}` object for handling
    const files = helpers.get_payload_files(req.body);

    if (Object.keys(files).length) {
        _.each(files, (file, filename) => {

            // File must have a valid name
            if (!filename) {
                error_handler(1);
            }

            // File must be whitelisted
            if (!helpers.is_whitelisted(filename, 'images')) {
                error_handler(2);
            }

            var filepath = $path + filename;

            // File must not exist
            try {
                var fsstat = fs.lstatSync(filepath);
                error_handler(3);
            } catch (e) {

                // Write to filesystem
                file.pipe(fs.createWriteStream(filepath));
                results.files.push(filename);
            }

        });

        error_handler(0);
    } else {
        error_handler(5);
    }

    res.json(results);
});
module.exports = router;