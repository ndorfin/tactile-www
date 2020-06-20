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

module.exports = function(eleventyConfig) {

  /* Collections */
  eleventyConfig.addCollection('postsGroupedByMonth', function(collection) {
    return collection
      .getAll()
      .filter(item => item.data.tag === 'post')
      .reduce((groupedPostsObj, item) => {
        let key = getISOMonth(item.data.date);
        if (!groupedPostsObj[key]) {
          groupedPostsObj[key] = [];
        }
        groupedPostsObj[key].push(item);
        return groupedPostsObj;
      }, {});
  });

  /* Filters */
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
      "jpg",
    ],
    dir: {
      includes: "_includes",
      layouts: "_layouts",
    }
  }
}
