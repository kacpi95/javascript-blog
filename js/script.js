'use strict';

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
    const linkHtml = `<li><a href="#${articleId}"><span>${titleArticle}</span></a></li>`;

    titleLists.innerHTML += linkHtml;
  }

  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}
function generateTags() {
  const articleAll = document.querySelectorAll('.post');
  for (const article of articleAll) {
    const articleBoxDataTags = article.getAttribute('data-tags');
    const arrayArticle = articleBoxDataTags.split(' ');
    const articleTagsSelector = article.querySelector('.post-tags .list');
    let tagsHtml = '';

    arrayArticle.forEach((article) => {
      tagsHtml += `<li><a href="#tag-${article}">${article}</a></li>`;
    });
    articleTagsSelector.insertAdjacentHTML('beforeend', tagsHtml);
  }
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
  const articleAll = document.querySelectorAll('.post');
  articleAll.forEach((el) => {
    const postAuthor = el.querySelector('.post-author');
    const authorName = el.getAttribute('data-author');
    let authorHtml = `<a href="#author-${authorName}">${authorName}</a>`;
    postAuthor.innerHTML = authorHtml;
  });
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
