H5P.MarkTheLetters = (function($,UI){


function MarkTheLetters(params,id){
//constructor

  var self = this;
  this.id = id;
  this.params = params;

  var html = self.params.textField;
  var str =self.params.textField;
  str = $(str).text();
  self.attach = function($container){
    $container.append('<div class="task-description">'+ self.params.question +'</div>');
    var str1=[];
    var answer = self.params.solution;
    answer=answer.replace(/\,/g,"");
    var result = [];
    if($(answer).val()!==null)
    {
      for(i=0;i<str.length;i++){
        for(var j=0;j<answer.length;j++)
        {
          if(str[i]==answer[j]){
            result.push(str[i]);
          }

        }

      }
      console.log(result);
    }


    console.log(result.length);

    str1=str;
    var input=[];
    var index= [];
    input=str.match(/(\*.\*)/g);
    for(i=0;i<input.length;i++)
    {
      input[i]=input[i].replace(/(\*)/g,"");
      index.push(str.indexOf(input[i]));
    }

    str=str.replace(/(\*)/g,"");
    // str = $(str).text();
    console.log(index);
    console.log(str);

    for (var i = 0; i < str.length; i++) {
      var node = str[i];
        console.log(str.charCodeAt(i));
        var $li = $('<li>'+ node +'</li>').appendTo($container);
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
            console.log("wrking");
            for(k=0;k<index.length;k++){
              if(this.innerHTML==str[index[k]]){
                console.log("correct");
              }
            }
        });
    }
console.log(answer);
  }
}


return MarkTheLetters;
})(H5P.jQuery,H5P.JoubelUI);
