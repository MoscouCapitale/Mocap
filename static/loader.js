/* The loader is in a js script, to be loaded independently of the rest of the page,
to make the loader appear as soon as possible, and disappear as soon as the page is loaded. */

const loader = document.createElement("div");
loader.id = "page-loader-cd";
loader.className = "page-loader-cd";

const loaderInner = document.createElement("div");
loaderInner.id = "loader-inner";
loaderInner.className = "loader-inner";

const loaderImg = document.createElement("img");
loaderImg.src = "/loader.svg";
loaderImg.className = "loader-img";

loaderInner.appendChild(loaderImg);
loader.appendChild(loaderInner);
document.body.appendChild(loader);

const checkReadyState = () => {
  if (document.readyState === "complete") loader.remove();
};

checkReadyState();

const intervalId = setInterval(checkReadyState, 1000);

document.addEventListener("onload", () => {
  if (document.readyState === "complete") clearInterval(intervalId);
});
