const yaml = require("js-yaml");
const CleanCSS = require("clean-css");
const Terser = require("terser");
const minify = require('html-minifier').minify;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function getISODate(date) {
  return new Date(date).toISOString();
}

function monthName(date) {
  let monthIndex = new Date(date).getMonth();
  return MONTHS[monthIndex];
}

function getISOMonth(date) {
  return getISODate(date).substring(0,7);
}

function getMonthYearStringFromISO(date) {
  let month = MONTHS[parseInt(date.split('-')[1]) - 1];
  let year = date.split('-')[0];
  let formattedDate = `${month}, ${year}`;
  return formattedDate;
}

function getAllSortedPosts(collection) {
  return collection
      .getAll()
      .filter(item => item.data.tag === 'post')
      .sort((a, b) => {
        if (a.url > b.url) {
          return 1;
        }
        if (b.url > a.url) {
          return -1;
        }
        return 0;
      });
}

module.exports = function(eleventyConfig) {

  /* Data extensions */
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  /* Collections */
  eleventyConfig.addCollection('sortedPosts', getAllSortedPosts);

  eleventyConfig.addCollection('postsGroupedByMonth', function(collection) {
    let groupedPosts = getAllSortedPosts(collection)
      .reduce((groupedPostsArray, item) => {
        let key = getISOMonth(item.data.date);
        let currentIndex = groupedPostsArray.findIndex((post) => {
          return post.month === key;
        });
        if (currentIndex > -1) {
          groupedPostsArray[currentIndex].posts.push(item);
        } else {
          groupedPostsArray.push({
            month: key,
            posts: [item]
          });
        }
        return groupedPostsArray;
      }, []);
    return groupedPosts;
  });

  /* Filters */
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });
  eleventyConfig.addNunjucksAsyncFilter("jsmin", async (code, callback) => {
    try {
      const minified = await Terser.minify(code);
      return callback(null, minified.code);
    } catch (err) {
      console.error("Error during terser minify:", err);
      return callback(err, code);
    }
  });

  eleventyConfig.addFilter("htmlmin", function(code) {
    var result = minify(code, {
      collapseWhitespace: true
    });
    return result;
  });

  eleventyConfig.addFilter("postUrl", function(post) {
    let postDate = getISODate(post.date).substring(0, 10);
    let fileName = `${post.fileSlug}.html`;
    return `/blog/${postDate}/${fileName}`;
  });

  eleventyConfig.addFilter("getYear", function(date) {
    return new Date(date).getUTCFullYear();
  });

  eleventyConfig.addFilter("ISOMonth", function(date) {
    return getISODate(date).substring(0,7);
  });

  eleventyConfig.addFilter("dateISO", function(date) {
    return getISODate(date);
  });

  eleventyConfig.addFilter("ccyyMMdd", function(date) {
    return getISODate(date).substring(0, 10);
  });

  eleventyConfig.addFilter("day", function(date) {
    return new Date(date).getDate();
  });

  eleventyConfig.addFilter("month", function(date) {
    return monthName(date);
  });

  eleventyConfig.addFilter("mon", function(date) {
    return monthName(date).substring(0, 3);
  });

  eleventyConfig.addFilter("formattedMonthYear", function(ISOYearMonth) {
    return getMonthYearStringFromISO(ISOYearMonth);
  });

  /* Directives */

  /* Copy files in the `_root` folder to the `_site` root */
  eleventyConfig.addPassthroughCopy({ "_root/*": "/" });

  /* Copy CSS and JS from the base folder to the `_site` root */
  eleventyConfig.addPassthroughCopy({ "css/**/*": "css" });
  eleventyConfig.addPassthroughCopy({ "js/**/*": "js" });

  return {
    templateFormats: [
      "html",
      "njk",
      "jpeg",
      "mp4",
      "jpg",
      "png",
      "svg",
      "yaml",
    ],
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      includes: "_includes",
      layouts: "_layouts",
    }
  }
}
