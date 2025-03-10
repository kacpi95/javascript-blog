"use strict";

const titleClickHandler = function (event) {
	event.preventDefault();
	const clickedElement = this;

	/* remove class 'active' from all article links  */

	const activeLinks = document.querySelectorAll(".titles a.active");

	for (let activeLink of activeLinks) {
		activeLink.classList.remove("active");
	}

	/* add class 'active' to the clicked link */

	clickedElement.classList.add("active");
	console.log("Clicked element:", clickedElement);

	/* remove class 'active' from all articles */
	const activeArticles = document.querySelectorAll(".post.active");

	for (let activeArticle of activeArticles) {
		activeArticle.classList.remove("active");
	}

	/* get 'href' attribute from the clicked link */
	const articleSelector = clickedElement.getAttribute("href");

	/* find the correct article using the selector (value of 'href' attribute) */
	const targetArticle = document.querySelector(articleSelector);

	/* add class 'active' to the correct article */
	targetArticle.classList.add("active");
};

function generateTitleLinks() {
	const titleLists = document.querySelector(".titles");
	const articleAll = document.querySelectorAll(".post");

	titleLists.innerHTML = "";

	for (const article of articleAll) {
		const articleId = article.getAttribute("id");
		const postTitle = article.querySelector(".post-title");
		const titleArticle = postTitle.textContent;
		const linkHtml = `<li><a href="#${articleId}"><span>${titleArticle}</span></a></li>`;

		titleLists.innerHTML += linkHtml;
	}

	const links = document.querySelectorAll(".titles a");
	for (let link of links) {
		link.addEventListener("click", titleClickHandler);
	}
}
generateTitleLinks();
