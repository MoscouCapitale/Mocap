import { useState } from "preact/hooks";

/**
 * The possible cursor states.
 */
type cursorState =
  | "default" // default cursor
  | "hover" // hover cursor
  | "hover-card" // hover on a card 
  | "text" // text cursor
  | "resize"
  | "resize-x"
  | "resize-y";


/**
 * Retrieves the cursor state based on the provided element.
 * 
 * @param element - The HTML element to determine the cursor state for.
 * @returns The cursor state as a string.
 */
const getCursorsState = (element: HTMLElement): cursorState => {
  if (element.attributes.getNamedItem("data-hover")) return "hover";
  if (element.attributes.getNamedItem("data-hover-card")) return "hover-card";
  const tag = element.tagName.toLowerCase();
  switch (tag) {
    case "input":
    case "textarea":
    case "select":
      return "text";
    case "col":
    case "colgroup":
      return "resize-x";
    case "a":
    case "iframe":
    case "object":
    case "embed":
    case "canvas":
    case "video":
    case "audio":
    case "progress":
    case "meter":
    case "map":
    case "area":
    case "svg":
      return "hover";
    default:
      return "default";
  }
};

export default function Cursor() {
  const [useCustomCursors, setUseCustomCursors] = useState(true);

  const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

  class Cursor {
    target: { x: number; y: number };
    cursor: { x: number; y: number };
    speed: number;
    raf?: number;
    // deno-lint-ignore no-explicit-any
    [key: string]: any;
    cursorInner?: HTMLDivElement;

    constructor() {
      // config
      this.target = { x: 0.5, y: 0.5 }; // mouse position
      this.cursor = { x: 0.5, y: 0.5 }; // cursor position
      this.speed = 0.1;
      this.init();
    }
    bindAll() {
      ["onMouseMove", "render"].forEach((
        fn,
      ) => (this[fn] = this[fn].bind(this)));
    }
    onMouseMove(e: MouseEvent) {
      if (!this.cursorInner) {
        const cursorInner = document.querySelector("#cursor-inner");
        if (cursorInner) this.cursorInner = cursorInner as HTMLDivElement;
      } else if (e.target) {
        this.cursorInner.setAttribute(
          "data-state",
          getCursorsState(e.target as HTMLElement),
        );
      }

      //get normalized mouse coordinates [0, 1]
      this.target.x = e.clientX / globalThis.innerWidth;
      this.target.y = e.clientY / globalThis.innerHeight;
      // trigger loop if no loop is active
      if (!this.raf) this.raf = requestAnimationFrame(this.render);
    }
    render() {
      //calculate lerped values
      this.cursor.x = lerp(this.cursor.x, this.target.x, this.speed);
      this.cursor.y = lerp(this.cursor.y, this.target.y, this.speed);
      document.documentElement.style.setProperty(
        "--cursor-x",
        String(this.cursor.x),
      );
      document.documentElement.style.setProperty(
        "--cursor-y",
        String(this.cursor.y),
      );
      //cancel loop if mouse stops moving
      const delta = Math.sqrt(
        Math.pow(this.target.x - this.cursor.x, 2) +
          Math.pow(this.target.y - this.cursor.y, 2),
      );
      if (delta < 0.001 && this.raf) {
        cancelAnimationFrame(this.raf);
        this.raf = undefined;
        return;
      }
      //or continue looping if mouse is moving
      this.raf = requestAnimationFrame(this.render);
    }
    init() {
      globalThis.document.body.setAttribute("data-custom-cursor", "true");
      this.bindAll();
      globalThis.addEventListener("mousemove", this.onMouseMove);
      this.raf = requestAnimationFrame(this.render);
    }
  }

  if (globalThis) {
    if (useCustomCursors) {
      globalThis.onload = () => new Cursor();
      return (
        <div id="cursor">
          <div id="cursor-inner" onLoad={(e) => console.log("loaded", e)}>
            <div id="cursor-front">
              <img
                className={""}
                src="/cursor/default.svg"
                width="120"
                height="120"
              />
            </div>
            <div id="cursor-back">
              <img
                className={""}
                src="/cursor/hover.svg"
                width="120"
                height="120"
              />
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
}
