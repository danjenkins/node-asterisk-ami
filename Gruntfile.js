module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        '{,*/}*.js'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
};
