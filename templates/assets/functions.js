(function() {
  var trees = document.getElementsByClassName('ui-tree'),
    lis = trees[0].getElementsByTagName('li'),
    li,
    i = 0,
    l = lis.length;

  function hasClass(el, cls) {
    return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
  }

  function handleClick(ev) {
    li = ev.target.parentNode;
    if (hasClass(li, 'open')) {
      li.className = '';
    } else {
      li.className = 'open';
    }
    ev.stopPropagation();
  }


  for (; i < l; i++) {
    var sp = document.createElement('span');
    li = lis[i];
    sp.addEventListener('click', handleClick, false);
    li.appendChild(sp);
  }
})();
