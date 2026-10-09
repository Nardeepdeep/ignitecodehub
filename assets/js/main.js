(function () {
  var ROOT = document.body.getAttribute("data-root") || "./";
  var slug = function (s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); };
  var url = function (p) { return ROOT + (p ? p + "/" : "") + "index.html"; };

  /* ---- Edit the menu here. Folders are created from these names. ---- */
  var NAV = [
    { t: "HubSpot", k: ["HubSpot CMS", "HubSpot Development", "HubSpot Modules", "HubSpot Themes", "HubSpot Migration"] },
    { t: "WordPress", k: ["WordPress Development", "WordPress Design", "WordPress Migration"] },
    { t: "Web Design", k: ["Figma", "UI/UX", "Landing Pages", "Website Redesign"] },
    { t: "CMS Migration" },
    { t: "Digital Marketing", k: ["SEO", "Conversion", "Email Marketing"] },
    { t: "Blog" }, { t: "Tools" }, { t: "Resources" }, { t: "About" }
  ];

  var header = document.getElementById("site-header");
  header.innerHTML =
    '<div class="wrap bar">' +
    '<a class="brand" href="' + ROOT + 'index.html" aria-label="ignitecodehub home">' +
    '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#14123A"/><path d="M16.5 4c.6 4-3.8 6-3.8 10.2 0 1.6.8 2.7 1.9 3.3-.2-2.2.9-3.8 2.1-5.1 1.3 2.1 4.1 3.4 4.1 6.9 0 3.5-2.5 5.7-5.2 5.7S10 22.8 10 19.8c0-1.7.6-3 1.5-4.2C9.6 17 8 19 8 21.5 8 25.4 11.4 28 16 28s8-2.7 8-7.2c0-5.8-5.6-7.2-7.5-16.8z" fill="#FF4D2E"/></svg>' +
    '<span>ignite<b>codehub</b></span></a>' +
    '<nav id="menu" aria-label="Main"><ul class="top" id="top"></ul><a class="m-cta" href="' + url("contact") + '">Contact</a></nav>' +
    '<a class="cta" href="' + url("contact") + '">Contact</a>' +
    '<button class="icon-btn" id="search-btn" aria-label="Search" aria-expanded="false" aria-controls="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></button>' +
    '<button class="icon-btn" id="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="menu"><svg viewBox="0 0 24 24" id="menu-ico"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
    '</div>' +
    '<div id="search" role="search"><div class="wrap">' +
    '<form id="sform"><input id="q" type="search" placeholder="Search services, tools, blog…" autocomplete="off" aria-label="Search the site"><button class="btn p" type="submit">Search</button></form>' +
    '<ul id="res"></ul></div></div>';

  var footer = document.getElementById("site-footer");
  if (footer) footer.innerHTML = '<div class="wrap">© ' + new Date().getFullYear() + ' ignitecodehub. All rights reserved.</div>';

  var top = document.getElementById("top"), idx = [];
  NAV.forEach(function (n, i) {
    var li = document.createElement("li"), ps = slug(n.t);
    idx.push({ t: n.t, p: "", h: url(ps) });
    if (n.k) {
      var b = document.createElement("button");
      b.className = "tg"; b.type = "button"; b.textContent = n.t;
      b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-controls", "sub" + i);
      var u = document.createElement("ul"); u.className = "sub"; u.id = "sub" + i;
      n.k.forEach(function (k) {
        var l = document.createElement("li"), a = document.createElement("a"), h = url(ps + "/" + slug(k));
        a.href = h; a.textContent = k; l.appendChild(a); u.appendChild(l);
        idx.push({ t: k, p: n.t, h: h });
      });
      li.appendChild(b); li.appendChild(u);
    } else {
      var a = document.createElement("a"); a.href = url(ps); a.textContent = n.t; li.appendChild(a);
    }
    top.appendChild(li);
  });
  idx.push({ t: "Contact", p: "", h: url("contact") });

  function closeSubs(except) {
    top.querySelectorAll("li.open").forEach(function (li) {
      if (li !== except) { li.classList.remove("open"); li.firstChild.setAttribute("aria-expanded", "false"); }
    });
  }
  top.addEventListener("click", function (e) {
    var b = e.target.closest(".tg");
    if (b) {
      var li = b.parentNode, o = !li.classList.contains("open");
      closeSubs(li); li.classList.toggle("open", o); b.setAttribute("aria-expanded", o);
    }
  });

  var menu = document.getElementById("menu"), mb = document.getElementById("menu-btn"), ico = document.getElementById("menu-ico");
  var sp = document.getElementById("search"), sb = document.getElementById("search-btn"), q = document.getElementById("q"), res = document.getElementById("res");
  function setMenu(o) {
    menu.classList.toggle("open", o); mb.setAttribute("aria-expanded", o);
    ico.innerHTML = o ? '<path d="M6 6l12 12M18 6 6 18"/>' : '<path d="M4 7h16M4 12h16M4 17h16"/>';
    if (o) setSearch(false);
  }
  function setSearch(o) {
    sp.classList.toggle("open", o); sb.setAttribute("aria-expanded", o);
    if (o) { setMenu(false); q.focus(); }
  }
  function closeAll() { setMenu(false); setSearch(false); closeSubs(); }
  mb.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  sb.addEventListener("click", function () { setSearch(!sp.classList.contains("open")); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
  document.addEventListener("click", function (e) { if (!e.target.closest("header")) closeAll(); });

  function find() {
    var v = q.value.trim().toLowerCase(); res.innerHTML = "";
    if (!v) return;
    var hits = idx.filter(function (x) { return x.t.toLowerCase().indexOf(v) > -1 || x.p.toLowerCase().indexOf(v) > -1; }).slice(0, 8);
    if (!hits.length) {
      var li = document.createElement("li"); li.className = "empty";
      li.textContent = "No matches for \u201C" + q.value.trim() + "\u201D. Try HubSpot, WordPress or SEO.";
      res.appendChild(li); return;
    }
    hits.forEach(function (x) {
      var li = document.createElement("li"), a = document.createElement("a"), s = document.createElement("span"), m = document.createElement("small");
      a.href = x.h; s.textContent = x.t; m.textContent = x.p;
      a.appendChild(s); a.appendChild(m); li.appendChild(a); res.appendChild(li);
    });
  }
  q.addEventListener("input", find);
  document.getElementById("sform").addEventListener("submit", function (e) {
    e.preventDefault(); var a = res.querySelector("a"); if (a) window.location.href = a.href;
  });
  window.matchMedia("(min-width:75rem)").addEventListener("change", function () { setMenu(false); closeSubs(); });
})();
