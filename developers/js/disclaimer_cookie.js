// JavaScript Document

/**
Par défaut, on cache l'affichage du disclaimer
On l'affiche si le cookie est absent
*/
jQuery(function(){

	jQuery('.disclaimer_bottom').hide();
	var disclaimerCookie = lire_cookie("cookie_ministere");
	if(disclaimerCookie == null){
		jQuery('.disclaimer_bottom').show();
	}
});
/**
Masque la barre d'affichage pour cookie
*/
function disclaimer_cookie(){
	jQuery('.disclaimer_bottom').hide();
	createcookie();
}
/**
Fonction qui génère le cookie 
*/
function createcookie(){
	var name = "cookie_ministere";
	var value = "disclaimer_cookie";
	var now = new Date();
	var time = now.getTime();
	time += 365 * 24 * 3600 * 1000;
	now.setTime(time);
	var expires = now.toUTCString();
	document.cookie = name+"="+value+"; expires="+expires+"; path=/";
}
/**
Fonction qui lit un cookie donné
*/
function lire_cookie(nom) {
  var arg=nom+"=";
  var alen=arg.length;
  var clen=document.cookie.length;
  var i=0;
  while (i<clen){
    var j=i+alen;
    if (document.cookie.substring(i, j)==arg)
       return arguments_cookies(j);
    i=document.cookie.indexOf(" ",i)+1;
    if (i==0) break;
  }
  return null; 
}
function arguments_cookies(offset){
  var endstr=document.cookie.indexOf (";", offset);
  if (endstr==-1) endstr=document.cookie.length;
  return unescape(document.cookie.substring(offset, endstr)); 
}