H5P.MarkTheLetters = (function($,UI){


  function MarkTheLetters(params,id){
          //constructor

          var self = this;
          this.id = id;
          this.params = params;
          var str =self.params.textField;
          str = $(str).text();
          var str1 = str;
          self.attach = function($container){

                $container.append('<div class="task-description">'+ self.params.question +'</div>');
                // var str=[];
                // str=str;
                var str2=str;
                var answer = self.params.solution;
                answer=answer.replace(/\,/g,"");
                var result = [];

                if($(answer).val()!==null)
                {
                    // for(i=0;i<str.length;i++)
                    // {
                    //     for(var j=0;j<answer.length;j++)
                    //     {
                    //         if(str[i]===answer[j])
                    //         {
                    //           result.push(i);
                    //         }
                    //     }
                    // }
                    // console.log(result);
                    for(i=0;i<answer.length;i++){
                          var res = str.split(answer[i]);
                          var a = res.join("*"+answer[i]+"*");
                          str = a;
                    }



                }
                // console.log(result.length);

                var input=[];
                var index= [];
                input=str.match(/(\*.\*)/g);
                str=str.replace(/\*\*/g, '*');
                console.log(str);
                str=str.replace(/(\*)/g,"");
                for(i=0;i<input.length;i++)
                {
                    input[i]=input[i].replace(/(\*)/g,"");
                }

                for(i=0;i<str.length;i++)
                {
                  for(j=0;j<input.length;j++)
                  {
                    if(str[i]===input[j])
                    {
                      index.push(i);
                    }
                  }
                }

                console.log(input);
                // console.log(index);
                for (i = 0; i < str.length; i++) {

                        var node = str[i];
                        // console.log(str.charCodeAt(i));
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
                              $(this).addClass("div-alpha");
                              $(this).removeClass("new-li");
                              var x=str.indexOf(this.innerHTML);
                              console.log(x);
                              for(k=0;k<index.length;k++){
                                  if(x===index[k]){
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
