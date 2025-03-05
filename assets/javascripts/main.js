---
---

/*!
 * Basically Basic Jekyll Theme 1.4.5
 * Copyright 2017-2018 Michael Rose - mademistakes | @mmistakes
 * Free for personal and commercial use under the MIT license
 * https://github.com/mmistakes/jekyll-theme-basically-basic/blob/master/LICENSE
 */

var menuItems = document.querySelectorAll("#sidebar li");

// Get vendor transition property
var docElemStyle = document.documentElement.style;
var transitionProp =
  typeof docElemStyle.transition == "string"
    ? "transition"
    : "WebkitTransition";

// Animate sidebar menu items
function animateMenuItems() {
  for (var i = 0; i < menuItems.length; i++) {
    var item = menuItems[i];
    // Stagger transition with transitionDelay
    item.style[transitionProp + "Delay"] = i * 75 + "ms";
    item.classList.toggle("is--moved");
  }
}

var myWrapper = document.querySelector(".wrapper");
var myMenu = document.querySelector(".sidebar");
var myToggle = document.querySelector(".toggle");
var myInitialContent = document.querySelector(".initial-content");
var mySearchContent = document.querySelector(".search-content");
var mySearchToggle = document.querySelector(".search-toggle");

// Toggle sidebar visibility
function toggleClassMenu() {
  myMenu.classList.add("is--animatable");
  if (!myMenu.classList.contains("is--visible")) {
    myMenu.classList.add("is--visible");
    myToggle.classList.add("open");
    myWrapper.classList.add("is--pushed");
  } else {
    myMenu.classList.remove("is--visible");
    myToggle.classList.remove("open");
    myWrapper.classList.remove("is--pushed");
  }
}

// Animation smoother
function OnTransitionEnd() {
  myMenu.classList.remove("is--animatable");
}

myMenu.addEventListener("transitionend", OnTransitionEnd, false);
myToggle.addEventListener(
  "click",
  function () {
    toggleClassMenu();
    animateMenuItems();
  },
  false
);
myMenu.addEventListener(
  "click",
  function () {
    toggleClassMenu();
    animateMenuItems();
  },
  false
);
if (mySearchToggle) {
  mySearchToggle.addEventListener(
    "click",
    function () {
      toggleClassSearch();
    },
    false
  );
}

// Toggle search input and content visibility
function toggleClassSearch() {
  mySearchContent.classList.toggle("is--visible");
  myInitialContent.classList.toggle("is--hidden");
  setTimeout(function () {
    document.querySelector(".search-content input").focus();
  }, 400);
}

/** Obsidian callouts ==========================================================
 * Obsidian callouts have the following format:
 * ```
 * > [!<case insensitive callout type>]<optional - or +>
 * > callout content
 * ```
 *
 * Example:
 * ```
 * > [!nOtE]+ Hello
 * > This Obsidian callout is collapsible and displays its content by default.
 * ```
 * =============================================================================
 */
// Select all blockquotes
const blockquotes = document.querySelectorAll("blockquote");

// Obsidian has 27 types of callouts
const calloutTypes = [
  "abstract", "attention", "bug", "cite", "caution", "check", "danger", "done",
  "error", "example", "fail", "failure", "faq", "help", "hint", "important",
  "info", "missing", "note", "question", "quote", "success", "summary", "tip",
  "tldr", "todo", "warning",
];

const MAX_CALLOUT_CONTENT_HEIGHT = "1000px";

// Regular expression to match the pattern [!<callout_type>]<optional - or +>
const calloutPattern = new RegExp(
  `^\\[!(${calloutTypes.join("|")})\\]([\\+\\-]?)`,
  "i"
);

// Function to create an SVG arrow given its rotation
// 0 deg for right arrow and 90 for down arrow
function createArrow(rotation = 0) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.classList.add("callout-arrow");
  svg.style.transform = `rotate(${rotation}deg)`;

  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", "M4 2 L12 8 L4 14 Z"); // Draw right arrow by default
  path.setAttribute("fill", "currentColor");

  svg.appendChild(path);
  return svg;
}

// Function to toggle callout content visibility and arrow orientation
function toggleCallout(contentDiv, arrowSVG) {
  // Check callout content visibility and toggle it
  const isClosed = contentDiv.dataset.state === "closed";
  contentDiv.dataset.state = isClosed ? "open" : "closed";

  if (isClosed) {
    // Show content, have arrow point down
    contentDiv.style.maxHeight = contentDiv.scrollHeight + "px";
    contentDiv.style.opacity = "1";
    arrowSVG.style.transform = "rotate(90deg)";
  } else {
    // Hide content, have arrow point right
    contentDiv.style.maxHeight = "0px";
    contentDiv.style.opacity = "0";
    arrowSVG.style.transform = "rotate(0deg)";
  }
}

// For each blockquote...
blockquotes.forEach((blockquote) => {
  // Attempt to store its first paragraph
  const firstParagraph = blockquote.querySelector("p");
  if (!firstParagraph) return;

  // Check if the first paragraph begins with Obsidian-style callout syntax
  const match = firstParagraph.textContent.match(calloutPattern);
  if (!match) return;

  // Store callout type and attempt to store callout option
  const calloutType = match[1].toLowerCase();
  const option = match[2];
  const isCollapsible = option === "+" || option === "-";

  // Create callout header
  const calloutHeader = document.createElement("div");
  calloutHeader.classList.add("callout-header");

  let arrowSVG;
  if (isCollapsible) {
    // Callout header will contain arrow and hover effect
    arrowSVG = createArrow(option === "+" ? 90 : 0);
    calloutHeader.appendChild(arrowSVG);
    calloutHeader.classList.add("collapsible-callout-header");
  }

  // Add callout title to callout header
  const calloutTitle = document.createElement("span");
  calloutTitle.textContent = firstParagraph.textContent
    .replace(calloutPattern, "")
    .trim();
  calloutTitle.classList.add("callout-title");
  calloutHeader.appendChild(calloutTitle);

  // Place callout content into a div for smooth animation
  const contentDiv = document.createElement("div");
  contentDiv.classList.add("callout-content");
  contentDiv.dataset.state = option === "-" ? "closed" : "open";

  // Transfer blockquote content (except its first paragraph) into contentDiv
  Array.from(blockquote.children)
    .slice(1)
    .forEach((p) => contentDiv.appendChild(p));
  blockquote.appendChild(contentDiv);

  // Set initial state for contentDiv (hidden or shown)
  if (option === "-") {
    // Hidden by default
    contentDiv.style.maxHeight = "0px";
    contentDiv.style.opacity = "0";
  } else {
    // Shown by default
    contentDiv.style.maxHeight = MAX_CALLOUT_CONTENT_HEIGHT;
    contentDiv.style.opacity = "1";
  }

  // Add toggle functionality
  if (isCollapsible) {
    calloutHeader.addEventListener("click", () =>
      toggleCallout(contentDiv, arrowSVG)
    );
  }

  // Replace first paragraph with callout header
  // Render blockquote as an Obsidian-style callout appropriately
  firstParagraph.innerHTML = "";
  firstParagraph.appendChild(calloutHeader);
  blockquote.classList.add("callout", calloutType);
});
