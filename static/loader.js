/* The loader is in a js script, to be loaded independently of the rest of the page,
to make the loader appear as soon as possible, and disappear as soon as the page is loaded. */

const getRandomColor = (saturation = 100, lightness = 50) => `hsl(${Math.floor(Math.random() * 360)}, ${saturation}%, ${lightness}%)`;

// "Manual" colors array, to get some colors that can ressemble a cdèdisc hue
const generateDiscHue = () => {
  const hues = [getRandomColor(10, 90), getRandomColor(70, 90), getRandomColor(), getRandomColor(), getRandomColor(0, 0), getRandomColor()];
  // Return a full rotation of same colors, with a last one for smooth transition
  return [...hues, ...hues, hues[0]];
};

const loader = document.createElement("div");
loader.id = "page-loader-cd";
loader.className = "page-loader-cd";

const loaderInner = document.createElement("div");
loaderInner.id = "loader-inner";
loaderInner.className = "loader-inner";

// Generate 12 colors for the loader, and add them to the css variables
Array.from({ length: 13 }, () => `conic-gradient(${generateDiscHue().join(", ")})`).forEach((color, index) =>
  loaderInner.style.setProperty(`--cd-color-${index}`, color)
);

const loaderImg = document.createElement("img");
loaderImg.src = "/loader.svg";
loaderImg.className = "loader-img";

loaderInner.appendChild(loaderImg);
loader.appendChild(loaderInner);
document.body.appendChild(loader);

// Lock scroll while loading
document.body.style.overflow = "hidden";

const removeLoader = () => {
  if (document.readyState === "complete")
    requestAnimationFrame(() => {
      loader.remove();
      document.body.style.overflow = "initial";
    });
};

globalThis.addEventListener("DOMContentLoaded", removeLoader);

// Fallback in case the load event is not triggered
globalThis.addEventListener("load", () => {
  removeLoader();
  clearInterval(intervalId);
});
const intervalId = setInterval(removeLoader, 1000);
