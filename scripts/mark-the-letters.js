H5P.MarkTheLetters = (function($,UI){


function MarkTheLetters(params,id){
//constructor

  var self = this;
  this.id = id;
  this.params = params;

  var html = self.params.textField;

  self.attach = function($container){
    $container.append('<div class="task-description">'+ self.params.question +'</div>');
    var str1=[];
    var answer = self.params.solution;
    answer=answer.replace(/\,/g,"");

    var div = document.createElement("div");
    div.innerHTML = html;
    var str = div.innerText;
    // $container.append('<div class="text-field">'+ str +'</div>');
    for (var i = 0; i < str.length; i++) {

        var nod = str[i];
        console.log(str.charCodeAt(i));
        var $li = $('<li>'+ nod +'</li>').appendTo($container);
        if(str.charCodeAt(i)!==32)
        {
          if(str.charCodeAt(i)!==44)
          {
            if(str.charCodeAt(i)!==46){
              $li.addClass("new-li");
            }
          }

        }
        else{
          $li.removeClass("newli");
        }




        $li.click(function(){
                    $(this).addClass("div-alpha");
                    // $(this).attr("disabled", true);
                    var flag = 0;
                    for (i = 0; i < answer.length; i++) {

                        if (answer[i] == this.innerHTML) {

                            console.log(this.innerHTML);
                            flag = 1;

                        }


                      }

          });

        // console.log(nod);
    }



console.log(answer);


  }
}


return MarkTheLetters;
})(H5P.jQuery,H5P.JoubelUI);
