module.exports = function (grunt) {
  grunt.loadNpmTasks("grunt-war");
  grunt.loadNpmTasks("grunt-shell");

  grunt.initConfig({
    shell: {
      deploy: {
        options: { stdout: true },
        command: ["rm -rf dist", "ng build --base-href . --prod"].join("&&"),
      },
    },

    pkg: grunt.file.readJSON("package.json"),
    war: {
      target: {
        options: {
          war_dist_folder: "war_file",
          war_name: "ceropapelapp",
        },
        files: [
          {
            expand: true,
            cwd: "dist/ceropapelapp",
            src: ["**"],
            dest: "",
          },
        ],
      },
    },
  });

  grunt.registerTask("default", ["shell", "war"]);
};
