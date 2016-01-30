(function() {

  var IO = PhiloGL.IO;

  function onSuccess(data) {
    // Add the editor div.
    var editorDiv = document.createElement('div');
    editorDiv.className = 'editor';
    editorDiv.style.display = 'none';
    document.body.appendChild(editorDiv);

    // Configure the editor div.
    var editor = ace.edit(editorDiv);
    editor.getSession().setUseWorker(false);
    editor.$blockScrolling = Infinity;
    editor.setTheme('ace/theme/tomorrow');
    editor.getSession().setMode('ace/mode/javascript');
    editor.renderer.setShowGutter(true);
    editor.setShowPrintMargin(false);
    editor.setHighlightActiveLine(false);
    editor.setDisplayIndentGuides(false);
    editor.setValue(data);
    editor.setReadOnly(true);
    editor.setFontSize(14);
    editor.getSession().selection.clearSelection();

    // Add the buttons div.
    var div = document.createElement('div');
    div.className = 'buttons';
    document.body.appendChild(div);

    var controlsDiv = document.getElementById('controls');
    controlsDiv.style.display = 'none';

    // Add the editor button.
    var span = document.createElement('span');
    span.className = 'button';
    span.innerHTML = '<span class="glyphicon glyphicon-search"></span> Source';
    span.onclick = function() {
      controlsDiv.style.display = 'none';
      if (editorDiv.style.display !== 'none') {
        editorDiv.style.display = 'none';
      } else {
        editorDiv.style.display = 'block';
      }
    }
    div.appendChild(span);

    // Add the controls button.
    if (controlsDiv.innerHTML !== '') {
      var span = document.createElement('span');
      span.className = 'button';
      span.innerHTML = '<span class="glyphicon glyphicon-cog"></span> Controls';
      span.onclick = function() {
        editorDiv.style.display = 'none';
        if (controlsDiv.style.display !== 'none') {
          controlsDiv.style.display = 'none';
        } else {
          controlsDiv.style.display = 'block';
        }
      }
      div.appendChild(span);
    }

    // Add the prev/next buttons.
    var baseurl = window.location.pathname.split('/').slice(0,3).join('/') + '/';
    var current = parseInt(window.location.pathname.split('/')[3]);
    var prev = current - 1;
    var next = current + 1;
    if (prev > 0) {
      var span = document.createElement('span');
      span.className = 'button';
      span.innerHTML = '<a href="' + baseurl + prev + '"><span class="glyphicon glyphicon-chevron-left"></span> Previous</a>';
      div.appendChild(span);
    } else {
      var span = document.createElement('span');
      span.className = 'button';
      span.innerHTML = '<a href="' + baseurl + 16 + '"><span class="glyphicon glyphicon-chevron-left"></span> Lesson 16</a>';
      div.appendChild(span);
    }
    var span = document.createElement('span');
    span.className = 'button';
    span.innerHTML = '<span style="color:yellow">Lesson ' + current + '</span>';
    div.appendChild(span);
    if (next < 17) {
      var span = document.createElement('span');
      span.className = 'button';
      span.innerHTML = '<a href="' + baseurl + next + '">Next <span class="glyphicon glyphicon-chevron-right"></span></a>';
      div.appendChild(span);
    } else {
      var span = document.createElement('span');
      span.className = 'button';
      span.innerHTML = '<a href="' + baseurl + 1 + '">Lesson 1 <span class="glyphicon glyphicon-chevron-right"></span></a>';
      div.appendChild(span);
    }

  }

  function onError() {
    console.error("Error loading lesson source.");
  }

  function onLoad() {
    new IO.XHR({
      url: window.location + 'index.js',
      onSuccess: onSuccess,
      onError: onError
    }).send();
  }

  window.addEventListener('load', onLoad);

})();