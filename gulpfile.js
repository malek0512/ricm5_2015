var gulp				= require('gulp')
  , gutil				= require("gulp-util")
  , webpack				= require("webpack")
  , ExtractTextPlugin	= require("extract-text-webpack-plugin")
  , uglify				= require('gulp-uglify')
  , watch				= require('gulp-watch')
  , cached				= require('gulp-cached')
  , remember			= require('gulp-remember')
  , jshint				= require('gulp-jshint')
  , stylish				= require('jshint-stylish-ex')
  , jshintOptions		= {	"laxbreak"	: true,
							"laxcomma"	: true,
							"asi"		: true,
							"esnext"	: true,
							"devel"		: true,
							"latedef"	: true,
							"undef"		: true,
							"unused"	: "vars",
							"globals"	: { "document"		: false
										  , "$"				: false
										  , "angular"		: true
										  , "__dirname"		: false
										  , "require"		: false
										  , "setTimeout"	: false
										  , "clearTimeout"	: false
										  , "clearInterval"	: false
										  , "exports"		: false
										  , "DOMParser"		: false
										  , "process"		: false
										  , "module"		: true
										  , "XMLHttpRequest": false
										  , "FormData"		: false
										  , "setInterval"	: false
										  , "Int8Array"		: false
										  , "google"		: false
										  , "window"		: false
										  , "webkitSpeechRecognition"	: false
										  , "SpeechSynthesisUtterance"	: false
										  , "speechSynthesis"			: false
										  , "localStorage"				: false
										  , "sessionStorage"			: false
										  , "HTMLElement"				: false
										  , "SVGMatrix"					: false
										  , "SVGPoint"					: false
										  }
							}
  ;

gulp.task('lint', function () {
    return gulp.src	( [ './js/**/*.js'
					  ]
					)
		.pipe(cached('scripts'))
		.pipe(jshint(jshintOptions))
		.pipe(jshint.reporter(stylish))
		.pipe(remember('scripts'))
		;
});

gulp.task("webpack", function(callback) {
    // run webpack
    webpack({
			entry	: {
				tpMatriceBundle		: "./js/tpMatrice.js"
			},
			output	: {
				path			: "./",
				filename		: "[name].js",
			},
			progress: false,
			stats: {
				colors			: true ,
				modules			: false,
				reasons			: false
			},
			module	: {
				loaders: [
					{ test	: /\.css$/	, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
					{ test	: /\.html$/	, loader: 'raw-loader'},
                    { test: /\.(png|woff|jpg|jpeg|gif)$/, loader: 'url-loader?limit=100000' }
				]
			},
			plugins: [ new ExtractTextPlugin("[name].css")
					 ],
			failOnError	: false
    }, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log( "[webpack]"
				 , stats.toString( { colors		: true
								   , modules	: false
								   , chunck		: false
								   }
								 )
				 );
        callback();
    });
});




var filesToWatch =	[ 'js/**/*.js'
					, 'js/**/*.css'
					];


gulp.task('watch', function () {
  var watcher = gulp.watch(filesToWatch, ['lint', 'webpack']);
  watcher.on('change', function (event) {
    if (event.type === 'deleted') {                   // if a file is deleted, forget about it
      delete cached.caches.scripts[event.path];       // gulp-cached remove api
      remember.forget('scripts', event.path);         // gulp-remember remove api
    }
  });
});

gulp.task('default', ['lint', 'webpack', 'watch'], function() {
	var port = 8080;
	
	var express = require('express');
	var app = express();
	app.use(express.static(__dirname + '/images'));
	app.use(express.static(__dirname + '/js'));
	
	app.get('/images/:id',function(req, res){
		res.sendFile(__dirname+'/images/'+req.params.id)
	})

	app.get('/js/:id',function(req, res){
		res.sendFile(__dirname+'/js/'+req.params.id)
	})

	app.get('/:id',function(req, res){
		res.sendFile(__dirname+'/'+req.params.id)
	})

	app.get('/', function(req, res){
		res.sendFile(__dirname+'/index.html');
	})

	app.listen(port, function(){
		console.log('Listening on', port)
	});
	
	console.log("Done!");
});



