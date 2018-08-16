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
      str1=str;
      var str2=str;
      var answer = self.params.solution;
      answer=answer.replace(/\,/g,"");
      var result = [];
      // var start,delCount,newSubStr;

      if($(answer).val()!==null)
      {
        for(i=0;i<str.length;i++){

          for(var j=0;j<answer.length;j++)
          {
            if(str[i]==answer[j]){
              result.push(i);

            }

          }

        }
        console.log(result);

        // for(k=0;k<result.length;k++){
        //   var i = 0;
        //   var b='/';
        //   if(i<str1.length){
        //     var before = str1.slice(i, result[k]) + b + str1.slice(result[k]+1);
        //   }
        //   str1 = before;
        //   // var after = before.substring(i,result[k]+1) + str[result[k]] + before.substring(result[k]+1);
        //   i = i+result[k];
        //
        // }
        // console.log(str1);

      }


      console.log(result.length);

      // str1=str;
      var input=[];
      var index= [];
      input=str.match(/(\*.\*)/g);
      str=str.replace(/(\*)/g,"");
      for(i=0;i<input.length;i++)
      {
        input[i]=input[i].replace(/(\*)/g,"");
          index.push(str.indexOf(input[i]));
      }


      // str = $(str).text();

      console.log(index);
      // console.log(str);
      // console.log(output);
      for (i = 0; i < str.length; i++) {
        var node = str[i];

          console.log(str.charCodeAt(i));
          var $li = $('<li>'+ node +'</li>').appendTo($container);
          var nodeIndex = i;
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
            $li.removeClass("new-li");
          }

          $li.click(function(){

              $(this).attr("disabled", true);
              $(this).addClass("div-alpha");
              $(this).removeClass("new-li");
              var x=str.indexOf(this.innerHTML);
              console.log(x);
              for(k=0;k<index.length;k++){
                if(x==index[k]){
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
