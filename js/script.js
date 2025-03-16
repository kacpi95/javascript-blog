'use strict';
const templates = {
  articleLink: Handlebars.compile(
    document.querySelector('#template-article-link').innerHTML
  ),
  tagLink: Handlebars.compile(
    document.querySelector('#template-tag-link').innerHTML
  ),
  authorLink: Handlebars.compile(
    document.querySelector('#template-author-link').innerHTML
  ),
  tagCloudLink: Handlebars.compile(
    document.querySelector('#template-tag-cloud-link').innerHTML
  ),
};
const optCloudClassCount = 5;
const optCloudClassPrefix = 'tag-size-';

const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;

  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  clickedElement.classList.add('active');
  console.log('Clicked element:', clickedElement);

  const activeArticles = document.querySelectorAll('.post.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  const articleSelector = clickedElement.getAttribute('href');
  const targetArticle = document.querySelector(articleSelector);

  targetArticle.classList.add('active');
};

function generateTitleLinks(customSelector = '') {
  const articleAll = document.querySelectorAll(customSelector + '.post');
  const titleLists = document.querySelector('.titles');

  titleLists.innerHTML = '';

  for (const article of articleAll) {
    const articleId = article.getAttribute('id');
    const postTitle = article.querySelector('.post-title');
    const titleArticle = postTitle.textContent;
    const linkHTMLData = { id: articleId, title: titleArticle };
    const linkHtml = templates.articleLink(linkHTMLData);

    titleLists.innerHTML += linkHtml;
  }

  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}
function calculateTagsParams(tags) {
  const params = { max: 0, min: 9999 };
  for (let tag in tags) {
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }
  return params;
}
function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  return optCloudClassPrefix + classNumber;
}
function generateTags() {
  let allTags = { tags: [] };
  const articleAll = document.querySelectorAll('.post');
  for (const article of articleAll) {
    const articleBoxDataTags = article.getAttribute('data-tags');
    const arrayArticle = articleBoxDataTags.split(' ');
    const articleTagsSelector = article.querySelector('.post-tags .list');
    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams);
    let tagsHtml = '';

    arrayArticle.forEach((tag) => {
      const tagHtmlData = { id: tag, title: tag };
      const tagHtml = templates.tagLink(tagHtmlData);
      tagsHtml += tagHtml;
      if (!allTags[tag]) {
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    });
    articleTagsSelector.insertAdjacentHTML('beforeend', tagsHtml);
  }
  const tagsParams = calculateTagsParams(allTags);
  for (let tag in allTags) {
    const tagClass = calculateTagClass(allTags[tag], tagsParams);
    allTags.tags.push({ id: tag, count: allTags[tag], className: tagClass });
    console.log(allTags);
  }
  const tagList = document.querySelector('.sidebar .tags');
  tagList.innerHTML = templates.tagCloudLink(allTags);
}
function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  /* remove class active */
  activeTags.forEach((el) => {
    el.classList.remove('active');
  });
  /* END LOOP: for each active tag link */
  /* find all tag links with "href" attribute equal to the "href" constant */
  const selectTags = document.querySelectorAll(`a[href="${href}"]`);
  /* START LOOP: for each found tag link */
  /* add class active */
  selectTags.forEach((el) => {
    el.classList.add('active');
  });
  /* END LOOP: for each found tag link */
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks(`[data-tags~="${tag}"]`);
}
const generateAuthor = () => {
  const allAuthors = {};
  const articleAll = document.querySelectorAll('.post');
  articleAll.forEach((el) => {
    const authorName = el.getAttribute('data-author');
    const postAuthor = el.querySelector('.post-author');
    const authorHtmlData = { id: authorName, title: authorName };
    const authorHtml = templates.authorLink(authorHtmlData);
    if (!allAuthors[authorName]) {
      allAuthors[authorName] = 1;
    } else {
      allAuthors[authorName]++;
    }
    if (postAuthor) {
      postAuthor.innerHTML = authorHtml;
    }
  });
  const listAuthors = document.querySelector('.sidebar .authors');
  let authorHtml = '';
  for (let author in allAuthors) {
    authorHtml += `<li><a href="#author-${author}">${author} (${allAuthors[author]})</a></li>`;
  }
  listAuthors.insertAdjacentHTML('beforeend', authorHtml);
};

function addClickListenersToTags() {
  /* find all links to tags */
  const allLink = document.querySelectorAll('.post-tags a');
  /* START LOOP: for each link */
  /* add tagClickHandler as event listener for that link */
  allLink.forEach((el) => {
    el.addEventListener('click', tagClickHandler);
  });
  /* END LOOP: for each link */
}

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const authorHref = clickedElement.getAttribute('href');
  const author = authorHref.replace('#author-', '');
  const activeLinkAuthor = document.querySelectorAll('.post-author a.active');
  activeLinkAuthor.forEach((el) => {
    el.classList.remove('active');
  });
  clickedElement.classList.add('active');
  generateTitleLinks(`[data-author="${author}"]`);
}
const addClickListenersToAuthor = () => {
  const authorLinks = document.querySelectorAll('.post-author a');
  authorLinks.forEach((el) => {
    el.addEventListener('click', authorClickHandler);
  });
};

document.addEventListener('DOMContentLoaded', function () {
  generateTags();
  generateTitleLinks();
  addClickListenersToTags();
  generateAuthor();
  addClickListenersToAuthor();
});
