var hljs = new function () {
	function k(v) {
	return v.replace(/&/gm, "&amp;").replace(/</gm, "&lt;").replace(/>/gm, "&gt;")
	function t(v) {
	return v.nodeName.toLowerCase()
	function i(w, x) {
	    var v = w && w.exec(x);
	return v && v.index == 0
	function d(v) {
	return Array.prototype.map.call(v.childNodes, 
	function (w) {
	     if (w.nodeType == 3) {
	return b.useBR ? w.nodeValue.replace(/\n/g, "") : w.nodeValue
	if (t(w) == "br") {
	return"\n"
	return d(w)
	function r(w) {
	   var v = (w.className + " " + (w.parentNode ? w.parentNode.className : "")).split(/\s+/);
	return x.replace(/^language-/, "")
	return v.filter(function (x) {
	return j(x) || x == "no-highlight"
	function o(x, y) {
	var v = {};
	for (var w in x) {