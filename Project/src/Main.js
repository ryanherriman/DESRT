document.getElementById("resourcesBtn").onclick = function(e) {
  console.log("Resources");
  var obj, dbParam, xmlhttp, myObj, x, txt = "";
  obj = {};

  var limit=14;
  var offset=0;
  dbParam = JSON.stringify(obj);
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      myObj = JSON.parse(this.responseText);
      var infoJson=myObj;
      console.log(infoJson.length);
      console.log(myObj.length);

      function creatbuttons(i,b) {
        page_nav = "";

        page_nav += "<li><a data-dego=" + b + ">" + i+ "</a></li>\n";
        return page_nav;
      }

      var text1="";

      var config = {
        max_results:infoJson.length,
        max_per_page: 10,
        page: 0
      },
      no_of_pages = Math.ceil( config.max_results / config.max_per_page ),
      results = [];

      console.log(no_of_pages);
      function init(){
        var txt="";
        txt += "<table border='1'>";

        for( var x = 0; x < config.max_results; x++ ){
          var textjson="";
          var obj = infoJson[x];

          for (var key in obj){
            var value = obj[key];

            textjson += " "+ value+" ";
          }

          results[x] =creatbuttons(textjson,infoJson[x].PID);
          console.log( infoJson.length,x);
        }

        document.getElementById("page_nav").onclick = function(e) {
          var page = e.srcElement.getAttribute("data-page");
          if(page){
            pager("goto", page);
            //config.page.classList.add('chosen');
            //page.classList.add('chosen');
          }
          console.log(config.page+" "+page)
          return false;
        };
        update_page();
      }

      function pager(action, page) {
        switch (action) {

          case "goto":
          config.page = page;
          break;
        }
        update_page();
      }
      function build_nav() {
        var i,
        page_nav = "";

        for( i = 0; i < no_of_pages; i++ ){
          page_nav += "<li><a data-page=" + (i+1) + ">" + (i+1) + "</a></li>\n";
        }
        return page_nav;
      }
      function build_results(){

        var i,
        tmp="";
        var  tmp1 = "<table border='1' id='tablo1'>";
        var tmp2= "<tr><td>";

        var  start = ( config.page !== 0 )? (config.page-1) * config.max_per_page : 1,
        end = start + config.max_per_page,
        result;

        for( i = start; i < end; i++ ){
          result = results[i];
          console.log(results[i]);
          if(typeof result !== "undefined"){
            tmp += result + "\n";
          }
          else {
            tmp += "";
          }
        }
        console.log(tmp);
          var texty= "Last name First name Resource/Role PID Location Employment Open for Time Entry Date of Hire";
        return tmp1+tmp2+texty+tmp+ "</td></tr></table>";
      }
      function update_page(){
        // if(config.page==0){
        //   document.getElementById("curr_page").innerText = config.page+1;
        // }else{
        //   document.getElementById("curr_page").innerText = config.page;
        // }
        console.log(build_nav());
        document.getElementById("page_nav").innerHTML = build_nav();
        document.getElementById("results").innerHTML = build_results();

        document.getElementById("results").onclick = function(e) {
          var id = e.srcElement.getAttribute("data-dego");
          var div1=document.getElementById("div1");

          var xhr=new XMLHttpRequest();

          xhr.open('GET','http://localhost:8080/DESRT/c/info/employees/'+id,true);
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.responseType='text';

          xhr.onload=function (){

            var infoJson=JSON.parse(xhr.responseText);

            var text1="";
            for (var i = 0; i < infoJson.length; i++){

              var obj = infoJson[i];
              for (var key in obj){
                var value = obj[key];
                if(key.toLowerCase()==="location"){
                  text1+= "<br>  " + key + ": " + creatbuttons(value.toLowerCase(), value);

                }
                else{
                  text1 += "<br>  " + key + ": " + value;
                }

              }}
              div1.innerHTML =text1;

            };
            xhr.send();

            console.log("tada");
            return false;
          };
        }
        init();

      }
    }
    xmlhttp.open('GET','data.json',true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded",'Accept', 'application/json');

    xmlhttp.send("x=" + dbParam);
  };
    
    function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);
