/*
 * Preview-only behaviour for the static HTML snapshot built by
 * scripts/build-preview.mjs (used for hosted previews that can't serve the
 * Next.js runtime from the domain root). It mirrors the React components:
 * Header (menu), Gallery + Lightbox, RevealObserver. The production site
 * uses the React components, not this file.
 */
(function () {
  var root = document.documentElement;

  /* ---------- Header ---------- */
  var header = document.querySelector("header");
  var toggle = header.querySelector("button[aria-controls=mobile-menu]");
  var panel = document.getElementById("mobile-menu");
  var label = toggle.querySelector("span");
  var bars = toggle.querySelectorAll("span[aria-hidden] > span");

  function onScroll() {
    var on = window.scrollY > 8 || !panel.hidden;
    header.classList.toggle("rule-dark", on);
    header.classList.toggle("border-transparent", !on);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open, restore) {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    label.textContent = open ? "Close" : "Menu";
    bars[0].className = "absolute left-0 h-px w-5 bg-ivory transition-transform duration-300 " + (open ? "top-1/2 rotate-45" : "top-0");
    bars[1].className = "absolute left-0 h-px w-5 bg-ivory transition-transform duration-300 " + (open ? "top-1/2 -rotate-45" : "bottom-0");
    root.style.overflow = open ? "hidden" : "";
    document.querySelectorAll("main, footer").forEach(function (el) { el.inert = open; });
    onScroll();
    if (open) panel.querySelector("a").focus();
    else if (restore) toggle.focus();
  }
  toggle.addEventListener("click", function () { setMenu(panel.hidden, false); });
  panel.querySelectorAll("a[href^='#']").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false, false); });
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) setMenu(false, true);
  });
  window.matchMedia("(min-width: 64rem)").addEventListener("change", function (e) {
    if (e.matches && !panel.hidden) setMenu(false, false);
  });

  /* ---------- Reveal ---------- */
  window.__revealReady = true;
  if (root.classList.contains("motion")) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  }

  /* ---------- Lightbox ---------- */
  var dialog = document.querySelector("dialog.lightbox");
  var triggers = Array.prototype.slice.call(document.querySelectorAll("#work ol button[aria-haspopup]"));
  var items = triggers.map(function (btn) {
    var img = btn.querySelector("img");
    var cap = btn.closest("figure").querySelector("figcaption span:last-child");
    var set = (img.getAttribute("srcset") || "").split(",").map(function (s) { return s.trim().split(" ")[0]; });
    return { src: set[set.length - 1] || img.src, alt: img.alt, caption: cap.innerHTML };
  });
  var count = items.length;
  var index = null;
  var pad = function (n) { return String(n).padStart(2, "0"); };
  var arrow = function (d) { return '<svg aria-hidden="true" viewBox="0 0 16 16" class="size-4" fill="none" stroke="currentColor" stroke-width="1.5"><path d="' + d + '"/></svg>'; };
  var navBtn = "inline-flex size-12 items-center justify-center border rule-dark transition-colors hover:border-ivory active:bg-ink-raised";

  function render() {
    var it = items[index];
    dialog.innerHTML =
      '<div class="flex h-full flex-col">' +
      '<div class="shell flex h-16 shrink-0 items-center justify-between">' +
      '<p class="label tabular-nums text-gray" aria-live="polite"><span class="text-ivory">' + pad(index + 1) + "</span> / " + pad(count) + "</p>" +
      '<button type="button" data-close class="label -mr-3 inline-flex min-h-12 items-center gap-3 px-3 text-ivory hover:text-gray">Close' + arrow("M3 3l10 10M13 3L3 13") + "</button></div>" +
      '<div class="relative min-h-0 flex-1 touch-pan-y" data-stage><img class="absolute inset-0 h-full w-full object-contain" alt="" src="' + it.src + '"></div>' +
      '<div class="shell flex shrink-0 flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">' +
      '<p id="lightbox-caption" class="text-sm text-ivory/90"><span class="label mr-3 text-gray">No. ' + pad(index + 1) + "</span>" + it.caption + "</p>" +
      '<div class="flex gap-2 self-end sm:self-auto">' +
      '<button type="button" data-prev class="' + navBtn + '" aria-label="Previous image">' + arrow("M13.5 8h-11M7 3.5L2.5 8 7 12.5") + "</button>" +
      '<button type="button" data-next class="' + navBtn + '" aria-label="Next image">' + arrow("M2.5 8h11M9 3.5L13.5 8 9 12.5") + "</button>" +
      "</div></div></div>";
    dialog.querySelector("[data-stage] img").alt = it.alt;
    [index - 1, index + 1].forEach(function (n) { new Image().src = items[(n + count) % count].src; });
  }

  function open(i) {
    index = i;
    render();
    dialog.showModal();
    root.style.overflow = "hidden";
    dialog.querySelector("[data-close]").focus();
  }
  function go(d) {
    var hadFocus = document.activeElement && document.activeElement.hasAttribute("data-prev") ? "[data-prev]" :
      document.activeElement && document.activeElement.hasAttribute("data-next") ? "[data-next]" : "[data-close]";
    index = (index + d + count) % count;
    render();
    dialog.querySelector(hadFocus).focus();
  }
  function close() {
    if (dialog.open) dialog.close();
    root.style.overflow = "";
    var i = index;
    index = null;
    dialog.innerHTML = "";
    if (i !== null) triggers[i].focus();
  }

  triggers.forEach(function (btn, i) { btn.addEventListener("click", function () { open(i); }); });
  dialog.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t) return;
    if (t.hasAttribute("data-close")) close();
    else if (t.hasAttribute("data-prev")) go(-1);
    else if (t.hasAttribute("data-next")) go(1);
  });
  dialog.addEventListener("cancel", function (e) { e.preventDefault(); close(); });
  dialog.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    else if (e.key === "Tab") {
      var f = dialog.querySelectorAll("button");
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  var tx = null;
  dialog.addEventListener("touchstart", function (e) { if (e.target.closest("[data-stage]")) tx = e.touches[0].clientX; }, { passive: true });
  dialog.addEventListener("touchend", function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  });
})();
