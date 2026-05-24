import yaml from 'js-yaml';

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

export default function(config) {

  /* Data extensions */
  config.setDataDeepMerge(true);
  config.addDataExtension("yaml", contents => yaml.load(contents));

  /* Collections */
  config.addCollection('sortedPosts', getAllSortedPosts);

  config.addCollection('postsGroupedByMonth', function(collection) {
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
  config.addFilter("cssmin", function(code) {
    let minifiedCode = code
      .replace(/[\n\t]/gi, '')
      .replace(/\:\s/gi, ':')
      .replace(/\s\s/gi, '')
      .replace(/\s\{/gi,'{')
      .replace(/;\}/gi,'}');
    return minifiedCode;
  });
  config.addNunjucksAsyncFilter("jsmin", async (code, callback) => {
    try {
      const minified = await Terser.minify(code);
      return callback(null, minified.code);
    } catch (err) {
      console.error("Error during terser minify:", err);
      return callback(err, code);
    }
  });

  config.addFilter("postUrl", function(post) {
    let postDate = getISODate(post.date).substring(0, 10);
    let fileName = `${post.fileSlug}.html`;
    return `/blog/${postDate}/${fileName}`;
  });

  config.addFilter("getYear", function(date) {
    return new Date(date).getUTCFullYear();
  });

  config.addFilter("ISOMonth", function(date) {
    return getISODate(date).substring(0,7);
  });

  config.addFilter("dateISO", function(date) {
    return getISODate(date);
  });

  config.addFilter("ccyyMMdd", function(date) {
    return getISODate(date).substring(0, 10);
  });

  config.addFilter("day", function(date) {
    return new Date(date).getDate();
  });

  config.addFilter("month", function(date) {
    // Get full month name (e.g., "January")
    return date.toLocaleString('default', { month: 'long' });
  });

  config.addFilter("mon", function(date) {
    // Get short month name (e.g., "Jan")
    return date.toLocaleString('default', { month: 'short' });
  });

  config.addFilter("formattedMonthYear", function(ISOYearMonth) {
    return getMonthYearStringFromISO(ISOYearMonth);
  });

  /* Directives */

  /* Copy files in the `_root` folder to the `_site` root */
  config.addPassthroughCopy({ "_root/*": "/" });

  /* Copy CSS and JS from the base folder to the `_site` root */
  config.addPassthroughCopy({ "css/**/*": "css" });
  config.addPassthroughCopy({ "js/**/*": "js" });

  return {
    templateFormats: [
      "html",
      "njk",
      "avif",
      "jpeg",
      "mp4",
      "jpg",
      "png",
      "svg",
      "webp",
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
