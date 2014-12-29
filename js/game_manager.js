
var game_manager = 
{

  score:0,
  health:100,
  health_proxy:100,
  level:0,
  food_opened:0,
  current_emoticons:[],
  possible_emoticon_list:[],
  dead:0,
  health_timer:{},
  message_number:0,
  emoticon_number:0,
  local:0,
  cat_sleep:0,
  head_clicked:0,
  belly_clicked:0,
  food_bowl_opened:0,
  food_at_bowl:0,
  normal_mode:1,
  new_emoticon_pack:[],
  fish_there:0,
  scratching:0,
  timeouts:{},
  scratch_mark:0,
  last_timestamp:0,
  last_health_timestamp:0,
  interval_for_scratching:7000,
  animations:{"cat_stage":"cat_breathing","cat_hidden_stage":"wanting_caress","cat_hidden_stage2":"caressing_going_on"},
  displayed_cat_stage:"cat_stage",
  
  achieve_state:{
    times_food:0,
    times_revived:0,
    times_died:0,
    times_scratched:0,
    times_stppped_scratching:0,
    times_ate_while_really_hungry:0,
    times_slept:0,

    time_played:0,
    time_not_dying:0,
    time_both_online:0,
    time_without_scratching:0,

    times_messaged:0,

  },
    achive_timeouts:{},
    achievements_reached:[],
    achievements_seen:[],
    possible_achievements:["food_once","food_when_really_hungry","slept_once","scratched_once","stopped_scratching_once","revived_once","99_seconds_playing","9_minutes_playing",],

  //cat_animation_loop

  cat_stage:"cat_stage",                  // "swiffycontainer" <--> "cat_stage"
  cat_hidden_stage:"cat_hidden_stage",    // "swiffycontainer2" <--> "cat_hidden_stage"
  cat_hidden_stage2:"cat_hidden_stage2",  // "swiffycontainer3" <--> "cat_hidden_stage2"
  fish_stage:"fish_stage",               // "fish-swiffy" <--> "fish_stage"

  player:"Norman",
  other_player_name:"Norman",

  level_modal_open:0,
  game_id:0,
  modal_cue:[],
  health_interval:25000,
  health_interval_while_asleep:50000,
  my_id:0,
  other_id:0,
  mouse_down:0,
  chat_opened:0,
  cat:1,
  initialized:0,
  notifications:[0,0],
  socket:{},
  me_name:"",
  other_name:"",

/*
  read_j: function(txt)
  {
    var jason = JSON.parse(txt);

  if(jason.game_id==this.game_id)// || jason.cat_sender===undefined)
    {
      this.read_j_for_parse(txt);
    }
  
  },
 // read_j_for_parse: function(txt)
  */

  read_j: function(txt)
  {
  
  /*
JSON object to come out:
{
"sender": string,     ---- name of who initiated the action
"text":string,    --- text for the chat
"emoticon":pre-defined string,     --- which emoticon was sent ("happy", "sad"...)
"food_offered":number, designating serial number of food type,  ---- an offering of food (1:"food1", 2:"food2"...)
"food_accepted":0 - NOT accepting,  1,2.. types of food    --- cat accepting or rejecting food 
"action":???,     --- some other action...?
"score":number,    --- a change to score
"notification":1 --- a new notification
"nu_health":number
"cat_animation_loop": string - put an animation
"cat_anim1":string - put an animation BEFORE ANOTHER (cat_anim2)
"cat_anim2":string - second animation
"time_between_animations" - time between cat_anim1 and cat_anim2
dead:0,1  - if dead
cat_sleep: 0,1
head_clicked:0,1
belly_clicked:0,1
cat_sender:0,1
food_bowl:0,1
sent_sound: name of sound that was sent 
food_sent: type of food sent to food bowl (0 if nothing)
food_eaten:1 if food was eaten
general_animation_loop: string - put an animation
animation_stage: string - animation's stage
fish_there: 1,0 - change fish status
function_w_anim1
function_w_anim2
timer_stop: name of the stage where the timer should stop
change_displayed_cat_stage_from: name of the stage to display
change_displayed_cat_stage_to: 
}
*/
  console.log("Reading JSON message");
  console.log(txt);

    if (typeof(txt)=="string")
    {
      var big_jason = JSON.parse(txt);
    }
    else
    {
      big_jason=txt;
    }

    if(big_jason.initialize)
    {
      this.initialize(big_jason);
      return;
    }

    if (!this.initialized)
    {
      return;
    }

    if (big_jason.timestamp)
    {
      this.last_timestamp=big_jason.timestamp;
    }
    else
    {
      return;
    }

    /*
    if(!jason.sender )// || jason.cat_sender===undefined)
    {
      document.write("ERROR - NO SENDER");
    }
    */

    var jason = big_jason.actions;

    if (jason.timer_stop) // ---- IMPORTANT!!!! HAS TO BE FIRST!!!
    {
      animation_manager.stop_timer(jason.timer_stop);
    }

    if (jason.text)
    {
      this.print_text(jason.text,jason.sender);
    }

    if (jason.emoticon)
    {
      this.put_emoticon(jason.emoticon, jason.sender);
    }

    if (jason.food_offered)
    {
      if (this.cat)
       { 
         this.offer_food(jason.food_offered, jason.sender);
       }
    }

    if (jason.food_eaten)
    {
      this.cat_ate_food(jason.food_eaten);
    }

    if (jason.food_at_bowl)
    {
      this.put_food_in_bowl(jason.food_at_bowl);
    }


    if (jason.food_accepted>=1 || jason.food_accepted===0)
    {
     this.accept_food(jason.food_accepted, jason.sender);
    }

    if (jason.score)
    {
      this.change_score(jason.score);
    }

       if (jason.notification)
    {
      this.add_notification(big_jason.id);
    }
    
    if(jason.health)
    {
      this.health_me(jason.health);
    }

    if(jason.last_health_timestamp)
    {
      this.last_health_timestamp=jason.last_health_timestamp;
    }


    if(jason.cat_animation_loop)
    {
      this.put_animaiton_loop(jason.cat_animation_loop,jason.sent_sound,this.cat_stage);
    }

    if(jason.general_animation_loop && jason.animation_stage)
    {
      this.put_animaiton_loop(jason.general_animation_loop,jason.sent_sound,jason.animation_stage);
    }

    if(jason.cat_anim1 && jason.cat_anim2 && jason.time_between_animations)
    {
      this.put_animaiton_plus_loop(jason.cat_anim1,jason.cat_anim2,jason.time_between_animations,this.cat_stage,jason.sent_sound,jason.sent_sound2,jason.function_w_anim1,jason.function_w_anim2);
     }

    if (jason.normal_mode>=1 || jason.normal_mode===0)
    {

      this.normal_mode=jason.normal_mode;
      if (jason.normal_mode>=1)
      {
        this.make_normal();
      }
    }

    if(jason.dead)
    {
      this.dead=1;
      this.score=0;
      this.level=0;
    }

    if (jason.fish_there>=1 || jason.fish_there===0)
    {
     this.fish_there=jason.fish_there;
    }

    if (jason.dead===0)
    {
      this.dead=0;
    }

    if(jason.cat_sleep==1 || jason.cat_sleep===0)
    {
      this.change_sleep(jason.cat_sleep);
    }

    if(jason.scratching==1 || jason.scratching===0)
    {
      this.change_scratch(jason.scratching);
    }

    if(jason.scratch_mark>=1 || jason.scratch_mark===0)
    {
      this.make_scratch_mark(jason.scratch_mark);
    }
    
    if (jason.head_clicked>=1 || jason.head_clicked===0)
    {
      this.head_clickdown(jason.head_clicked); 
    }

    if (jason.food_bowl)
    {
      this.open_close_food_bowl();
    }

    if (jason.change_displayed_cat_stage_from && jason.change_displayed_cat_stage_to)
    {
      this.change_cat_display(jason.change_displayed_cat_stage_from,jason.change_displayed_cat_stage_to);
    }

    if (jason.achievements_reached)
    {
      this.achievements_reached=jason.achievements_reached;
    }

    if (jason.achievements_seen)
    {
      this.show_achievements(jason.achievements_seen);
    }

    //this.check_achievements(jason.achieve_state);
  },

  show_achievements: function(achievements_seen)
  {
    
    
  },


    add_achievement: function(achievement)
    {
      
    },

  initialize: function(jason)
  {


    /*
  Game initialization JSON:
    
  {
    game_state:{
        cat:1,
        score:0,
        health:100,
        health_proxy:100,
        level:0,
        player:"Norman",
        other_player_name:"Norman",
        current_emoticons:[],
        possible_emoticon_list:[],
        notifications:0,
        dead:0,
        health_timer:{},
        modal_cue:[],
        message_number:0,
        emoticon_number:0,
        cat_sleep:0,
        food_bowl_opened:0,
        food_at_bowl:0,
        normal_mode:1,
        new_emoticon_pack:[],
        fish_there:0,
        scratching:0,
        displayed_cat_stage:"swiffycontainer",
        timeouts:{},
        game_id:0,
        my_id:0,
        other_id:0,
        scratch_mark:0,
        animations:{cat_stage:"",cat_hidden_stage:"",cat_hidden_stage2:""},
        },
        chat_history:[
        {},
        ],
    }

    */

    this.game_id=sessionStorage.game_id;
    this.me_id=sessionStorage.me_id;
    this.human_id=parseInt(this.game_id.split('_')[0]);
    this.cat_id=parseInt(this.game_id.split('_')[1]);
    this.me_name = sessionStorage.me_name.split(' ')[0];
    this.other_name = sessionStorage.other_name.split(' ')[0];

    if (this.me_id==this.human_id)
    {this.cat=0;}
    else
    {this.cat=1;}

    $.each(jason.game_state, function(prop_name,val){
      if (!isNaN(parseInt(val)) && prop_name!="game_id")
      {
        game_manager[prop_name]=parseInt(val);

      }
      else
      {
        game_manager[prop_name]=val;
      }
    });

  /*
    $.each(this.animations, function(stage_name,anim){
      //console.log(this.animations+ "  "+ anim);
      game_manager.put_animaiton_loop(anim,undefined,stage_name); // <--------SHOULD BE "GAME_MANAGER"!!!!
    });
   */

       this.current_emoticons=this.current_emoticons.split(',');

    if(this.cat==1)
    {
      this.configure_for_cat();
    }
    else
    {
      this.configure_for_human(); 
    }

    this.make_normal();

    if (this.scratching)
    {
      if (($.now()-this.last_timestamp)<this.interval_for_scratching)
      {
       this.put_animaiton_plus_loop("scratching_animation","cat_breathing",this.interval_for_scratching,this.cat_stage,undefined,undefined,"scratch_begin","scratch_end");
      }
      else
      {
        this.scratch_mark=5;
      }
    }
    else if (this.cat_sleep)
    {
      this.change_sleep(this.cat_sleep);
      this.put_animaiton_loop("sleeping_cat",undefined,this.cat_stage);
    }
    else
    {
      this.put_animaiton_loop("cat_breathing",undefined,this.cat_stage); 
    }

    this.make_scratch_mark(this.scratch_mark);
    this.put_food_in_bowl(this.food_at_bowl);
    
    if (this.food_bowl_opened)
    {
      this.open_close_food_bowl();
      $('.food-bowl').animate({
        left:"0vw",
      }, 500, function(){});
    }
    else
      {
        $('.food-bowl').animate({
        left:"-50vw",
      }, 500, function(){});
      };

    $("#score_number").html(this.score);
    $("#level").html(this.level);    

    this.notifications=0;

    for(i = jason.chat_history.length; i > 0; i--)
    {
      jason.chat_history[i-1][jason.json_content_type]=jason.json_content;

      if (jason.chat_history[i-1].json_content_type=="emoticon")
      {
        this.put_emoticon(jason.chat_history[i-1].json_content,jason.chat_history[i-1].json_sender);
      }
      else if (jason.chat_history[i-1].json_content_type="text")
      {

        this.print_text(jason.chat_history[i-1].json_content,jason.chat_history[i-1].json_sender);
      }

      if (!jason.chat_history[i-1].message_seen)
      {
        this.notifications++;
      }
    }
    
    this.update_notifications();

    /*
    general_animation_loop:"fish_regular",
        animation_stage:this.fish_stage,
    */

    if(this.fish_there)
    {
      this.put_animaiton_loop("fish_regular",undefined,this.fish_stage);
    };  

    var time_since_last_health_update = $.now()-this.last_health_timestamp;
    
    while (time_since_last_health_update>this.health_interval)
    {
      time_since_last_health_update=time_since_last_health_update-this.health_interval;
      this.health=this.health-4;

    }

    $('#cat_hidden_stage').css({'display':'none'});
    $('#cat_hidden_stage2').css({'display':'none'}) 

    this.possible_emoticon_list=get_possible_emoticons();
    this.update_emoticon_html();

    this.initialized=1;

    this.adjust_health_pic();
    //this.update_health(1);
    //this.update_notifications();
    
  },

  onload_game: function()
  {
   
    this.game_id=sessionStorage.game_id;
    this.my_id=sessionStorage.my_id;
    this.other_id=sessionStorage.other_id;

    if (!this.local)
    { 
        this.socket = io();
        this.listen_to_json();
          jason={
           data_type:"game_init",
           game_id:this.game_id,
          };  
        this.socket.emit('join',jason);      
    };


// ---- > Prevent the form refresh thing

   $("#in-chat-input").submit(function(e) {
      e.preventDefault();
    });

// ---- > hide achievement thing

    $('#points-drop').hide();

// ---- > Bind modal cue

   $('#foodModal').bind('close', function() 
      { 
        game_manager.progress_cue();
      });

    $('#foodModal-approve').bind('closed', function() 
      { 
        game_manager.progress_cue();
      });

    $('#levelModal').bind('closed', function() 
      { 
        game_manager.progress_cue();
      });

    $('#landingModal').bind('closed', function() 
      { 
        game_manager.progress_cue();
      });

    $('#levelgiftModal').bind('closed', function() 
      { 
        game_manager.progress_cue();
      });
   
   // ------ > SOUND
    ion.sound({
    sounds: [
            {
            name: "snap",
            },
            {
              name: "miau1",
            },
            {
              name: "notification",
            },
            {
              name: "glass",
            },
            {
              name: "water_droplet",
            },
            {
               name: "miau2",
                // volume: 0.3,
               // preload: false
            }
          ],
        volume: 0.5,
        path: "sounds/",
        preload: true
      });
 

      // ----- > Bind chat open and close events
  $("#chat-drop").on("opened",function(){
    game_manager.chat_opened=1;
    game_manager.update_notifications();
   });

    $("#chat-drop").on("closed",function(){
    game_manager.chat_opened=0;
   });

    $('#while-scratch-clickable').on('click',function(){
      game_manager.stop_scratch_clicked();
    })

      $('body').mousedown(function() {
    game_manager.mouse_is_down();
    });

        $('body').mouseup(function() {
    game_manager.mouse_is_up();
    });

  this.clickable_on();


    animation_manager.play_anim_loop("wanting_caress",this.cat_hidden_stage);
    animation_manager.play_anim_loop("caressing_going_on",this.cat_hidden_stage2);

  },



    clickable_on: function()
    {

    $('#clickable').mousedown(function() {
    game_manager.cat_click_down();
    });

    $('#clickable').mousemove(function() {
    game_manager.cat_mousemove();
    });

    /*
    $('#clickable').mouseup(function() {
    game_manager.cat_click_up();
    });
    */
  },

   clickable_off: function()
    {
      $('#clickable').off();
    },

  make_normal: function()
  {
    $('#clickable').show();
    $('#while-scratch-clickable').hide();
  },

  make_not_normal: function()
  {
    $('#clickable').hide();
  },

  make_during_scratch: function()
  {
    $('#while-scratch-clickable').show();
  },

  configure_for_human: function()
  {
    //var hi_there = "Hi, "+this.player;
    $(".food_sender_name").html("Hi "+this.player+", ");
    $("#health-image").hide();
    $("#text_with_food").html("would you like to send your cat some food?");
    $("#offered_food_image").attr("src",get_food_file("1"));
    $('#sleep_button').hide();
    $('#scratch_button').hide();

    //$(".human-feed").on("click",open_food_thing);
    
    $("#chat-drop .orbit-container").hide();
    
    //this.other_player_name="Pips";
    
    $(".human-feed").show(); 
  },

 configure_for_cat: function()
  {

    //this.player="Pips";
    
    $("#offered_food_image").attr("src",get_food_file("1"));
     
   // emoticon_array=['emo-happy','emo-mad','emo-food','emo-love','emo-night','emo-kania'];
     
   //  this.add_emoticons(emoticon_array);

   this.update_emoticon_html();

   this.add_modal("#landingModal");
  },

  sleep_clicked: function()
  {
    var sleep=1;
    var normal=0;
    var anim="sleeping_cat";
    var bowl_close=0;
    if (this.cat_sleep)
    {
      sleep=0;
      normal=1;
      anim="cat_breathing";
    }

    if (this.food_bowl_opened && sleep)
    {
      bowl_close=1;
    }

    nu_sleep = this.achieve_state.times_slept+sleep;
     var sender_dude=game_manager.get_player_name();
      var jesson =
  {
    sender:sender_dude,
    cat_sleep:sleep,
    cat_animation_loop:anim,
    food_bowl:bowl_close,
    normal_mode:normal,
    cat_sender:this.cat,
    achieve_state:{times_slept:nu_sleep},
  };

  var  txt = JSON.stringify(jesson);
  if(game_manager.is_local())
  {
    game_manager.read_j(txt);
  }
  game_manager.send_j(txt);

  },
  
  mouse_is_down: function()
  {
    this.mouse_down=1;
  },

  mouse_is_up: function()
  {
    this.mouse_down=0;
  },

  head_clickdown: function(head_clicked)
  {
      this.head_clicked=head_clicked;
      
      $('#clickable').off();
      if (jason.head_clicked)
      {
      $('#clickable').mouseup(function() {
       game_manager.cat_click_up();
      });
      }
      
  },

  cat_click_down: function()
  {

   var delayed_by=100;
     this.timeouts[this.cat_stage]=setTimeout(function(){
      if(this.mouse_down)
      {
        game_manager.delayed_clickdown();
      };
    },delayed_by);
  
 // this.delayed_clickdown()

  },


  delayed_clickdown: function()
  {
    if(this.normal_mode || this.head_clicked>0)
    {
     
      var normal=0;
     if(this.head_clicked)
     {
        var stage_from=this.displayed_cat_stage;
        var stage_to=this.cat_hidden_stage2;
        var head_clicking=2;
        /*
        var caress_anim="caressing_going_on";
        var after_caressing="cat_breathing";
        var caressing_time=10000;
        var caressing_sound="";
        var post_caressing_sound="";
        var function_at_start="caressing_begin";
        var function_at_end="caressing_end";
        */
      }
      else
      {
        var stage_from=this.displayed_cat_stage;
        var stage_to=this.cat_hidden_stage;
        var head_clicking=1;
        /*
        var caress_anim="wanting_caress";
        var after_caressing="cat_breathing";
        var caressing_time=10000;
        var caressing_sound="";
        var post_caressing_sound="";
        var function_at_start="caressing_proposed";
        var function_at_end="caressing_turned_down";
        */
     }

     var sender_dude=game_manager.get_player_name();
      var jesson =
      {
       sender:sender_dude,
       cat_sender:this.cat,
       normal_mode:normal,
       /*
       cat_anim1:caress_anim,
       cat_anim2:after_caressing,
       time_between_animations:caressing_time,
       sent_sound:caressing_sound,
       sent_sound2:post_caressing_sound,
       function_w_anim1:function_at_start,
       function_w_anim2:function_at_end,
       timer_stop:this.cat_stage,
       */
       head_clicked:head_clicking,
       change_displayed_cat_stage_from:stage_from,
       change_displayed_cat_stage_to:stage_to,
      };

      var  txt = JSON.stringify(jesson);
      if(game_manager.is_local())
     {
       game_manager.read_j(txt);
     }
     game_manager.send_j(txt);

    } 
  },

  cat_mousemove: function()
  {
    if (this.head_clicked && this.mouse_down)
    {
      this.cat_click_up();
    }
  },

  cat_click_up: function()
   {

    // jason.cat_animation_loop,jason.sent_sound

      var sender_dude=game_manager.get_player_name();
      var jesson =
      {
       sender:sender_dude,
       cat_sender:this.cat,
       normal_mode:1,
       /*
       cat_animation_loop:"cat_breathing",
       sent_sound:"",
       timer_stop:this.cat_stage,
       */
       head_clicked:0,
       change_displayed_cat_stage_from:this.displayed_cat_stage,
       change_displayed_cat_stage_to:this.cat_stage,
      }

      var  txt = JSON.stringify(jesson);
      if(game_manager.is_local())
      {
        game_manager.read_j(txt);
      }
      game_manager.send_j(txt);
      
   },

   caressing_begin: function()
   {
    console.log("Begins");
   },

   caressing_end: function()
   {
    alert("Ends");
   },

   caressing_proposed: function()
   {
    
   },

   caressing_turned_down: function()
   {
     alert("turned down");
   },

   change_cat_display: function(stage_from,stage_to)
   {
    this.stop_timer(stage_from);
    this.stop_timer(stage_to);
    var id="#"+stage_from;
    var id2="#"+stage_to;
    delayed_by=100;
    
    //$("#clickable").hide();
    this.timeouts[stage_from]=setTimeout(function(){game_manager.delayed_hide_stage(id);},delayed_by);
    
    $(id2).css({'display':'block'});
    this.displayed_cat_stage=stage_to;
    console.log($("#cat_stage").css('display'));
   },

   delayed_hide_stage: function(stage_from_id)
   {
      $(stage_from_id).css({'display':'none'});
      //$("#clickable").show();
   }, 

   stop_timer: function(stagee)
  {
    clearTimeout(this.timeouts[stagee]);
  },


   open_close_food_bowl: function()
   {
    
    if (this.food_bowl_opened)
    {

      $('.food-bowl').animate({
        left:"-50vw",
      }, 500, function(){});
      this.food_bowl_opened=0;
    }
    else
    {
      $('.food-bowl').animate({
        left:"0vw",
      }, 500, function(){});
      this.food_bowl_opened=1;
      
    }
   },

   food_bowl_clicked:function()
   {
    if (this.cat)
    {
      if (!this.food_at_bowl)
      { 
        alert("cat wants food");
      }
      else
      {
        nu_food_times:this.achievements_state.times_food+1;
        var score_change=100;
        var sender_dude=game_manager.get_player_name();  
        var jesson =
        {
         sender:sender_dude,
         food_eaten:this.food_at_bowl,
         score:score_change,
         cat_sender:game_manager.cat,
         achieve_state:{times_food:nu_food_times},
        };

        txt=JSON.stringify(jesson);

         if(this.local)
         {  
           this.read_j(txt);
         }

        this.send_j(txt);
      }
    }
    else
    {
      if (!this.food_at_bowl)
      {
        game_manager.add_modal('#foodModal');
        game_manager.open_food_thing=1;
      }
      else
      {

      }
    }

   },

  change_sleep: function(sleep)
  {
    this.cat_sleep=sleep;
  },

  add_emoticons: function(emotic_arr)
  {
    for(i = 0; i < emotic_arr.length; i++)
    {
      console.log("JJJJJ "+this.current_emoticons);
     this.current_emoticons.push(emotic_arr[i]);
    }
    this.update_emoticon_html();
    // put emoticon in the HTML ----------
  },

update_emoticon_html: function()
{
  $(".three-emoticons").remove();
  var dumdum=0;
  for(i = 0; i < this.current_emoticons.length; i++)
  {
    switch (dumdum)
    {
      case 0:
      this.add_three_emoticons(this.current_emoticons[i],this.current_emoticons[i+1],this.current_emoticons[i+2]);
      dumdum=1;
      break;
      case 1:
      dumdum=2;
      break;
      case 2:
      dumdum=0;
      break;
    }
  }
},

add_three_emoticons: function(emoti1,emoti2,emoti3)
{
  var emoti_cont='<li class="three-emoticons"><ul class="small-block-grid-3">';
  //this.current_emoticons.push(emotic1);
  emoti_cont=emoti_cont+'<li onclick="javascript:emoticon_clicked(&#39'+emoti1+'&#39)" class="chat-cat-emoticon"><img src="'+get_emoticon_file(emoti1)+'" alt="slide 1" /></li>';
  
  //this.current_emoticons.push(emotic2);
   emoti_cont=emoti_cont+'<li onclick="javascript:emoticon_clicked(&#39'+emoti2+'&#39)" class="chat-cat-emoticon"><img src="'+get_emoticon_file(emoti2)+'" alt="slide 1" /></li>';
  
  //this.current_emoticons.push(emotic3);
   emoti_cont=emoti_cont+'<li onclick="javascript:emoticon_clicked(&#39'+emoti3+'&#39)" class="chat-cat-emoticon"><img src="'+get_emoticon_file(emoti3)+'" alt="slide 1" /></li>';
emoti_cont=emoti_cont+' </ul></li>';  

$(".emoticons-slider").append(emoti_cont);
},

put_animaiton_loop: function(anim,sent_sound,stage)
  {
    if (stage===undefined)
    {
      stage=this.cat_stage;
    }
      animation_manager.play_anim_loop(anim,stage,sent_sound);
  },



   send_animation_loop: function(anim)
  {
    var sender_dude=game_manager.get_player_name();
      var jesson =
  {
    sender:sender_dude,
    cat_animation_loop:anim,
    cat_sender:this.cat,
  };

  txt=JSON.stringify(jesson);

    if(this.local)
      {  
        this.read_j(txt);
      }

      this.send_j(txt);
  },

  put_animaiton_plus_loop: function(anim1,anim2,time_str,stage,sent_sound1,sent_sound2,function1,function2)
  {
    //   this.put_animaiton_plus_loop(cat_anim1,jason.cat_anim2,jason.time_between_animations,this.cat_stage,jason.sent_sound,jason.sent_sound2,jason.function_w_anim1,jason.function_w_anim2);
    
    if (stage===undefined)
    {
      stage=this.cat_stage;
    }
    time=Number(time_str);
    animation_manager.play_anim_and_loop(anim1,anim2,time,stage,sent_sound1,sent_sound2,function1,function2);
     
  },

   send_animation_plus_loop: function(anim1,anim2,time,sound_to_send)
  {
    var sender_dude=game_manager.get_player_name();
      var jesson =
  {
    sender:sender_dude,
    cat_anim1:anim1,
    cat_anim2:anim2,
    time_between_animations:time,
    sent_sound:sound_to_send,
    cat_sender:this.cat,
  };

  txt=JSON.stringify(jesson);

    if(this.local)
      {  
        this.read_j(txt);
      }

      this.send_j(txt);
  },

  cat_clicked: function() // DEPRECIATED !!!!! ! !!!! !! 
  {
    if (!this.dead)
    {
      //ion.sound.play("water_droplet");
      this.send_animation_plus_loop('eyes_twitch','cat_breathing',1000,"water_droplet");
    }
  },


  scratch_clicked: function()
  {

    if (this.normal_mode)
    {

      var sender_dude=game_manager.get_player_name();
      var jesson =
  {
    sender:sender_dude,
    cat_anim1:"scratching_animation",
    cat_anim2:"cat_breathing",
    time_between_animations:this.interval_for_scratching,
    normal_mode:0,
    scratching:1,
    function_w_anim1:"scratch_begin",
    function_w_anim2:"scratch_end",
    cat_sender:this.cat,
  };

  txt=JSON.stringify(jesson);

    if(this.local)
      {  
        this.read_j(txt);
      }

      this.send_j(txt); 
    }
  },

  change_scratch: function(scratching)
  {
    this.scratching=scratching;
  },

  scratch_begin: function()
  {
    //this.scratching=1;
    $('#clickable').hide();
    $('#while-scratch-clickable').show();
  },

   scratch_end: function()
  {
    //SHOW SCRATCH!!
    
    //$('#scratch_image').show();



     var sender_dude=game_manager.get_player_name();
      var jesson =
  {
    sender:sender_dude,
    scratch_mark:5,
    normal_mode:1,
    scratching:0,
    cat_sender:this.cat,
    timer_stop:this.cat_stage,
    achieve_state:{times_scratched:this.achieve_state.times_scratched+1},
  };

  txt=JSON.stringify(jesson);

    if(this.local)
      {  
        this.read_j(txt);
      }

      this.send_j(txt); 
    
  },

  make_scratch_mark: function(scratch_mark)
  {
    this.scratch_mark=scratch_mark;
    if(scratch_mark===0)
    {
      $("#scratch-image").hide();
    }
    else
    {
      $("#scratch-image").show();
      var op = scratch_mark/5;
      $("#scratch-image").css('opacity',op);
    }

  },

  scratch_image_clicked: function()
  {
     new_scratch_mark= this.scratch_mark-1;
     var sender_dude=game_manager.get_player_name();
      var jesson =
  {
    sender:sender_dude,
    scratch_mark:new_scratch_mark,
    cat_sender:this.cat,
  };

  txt=JSON.stringify(jesson);

    if(this.local)
      {  
        this.read_j(txt);
      }

      this.send_j(txt); 
  },

  stop_scratch_clicked: function()
  {
    if (this.scratching)
    {
      var sender_dude=game_manager.get_player_name();
      var jesson =
    {
     sender:sender_dude,
     cat_animation_loop:"cat_breathing",
     sent_sound:"",
     timer_stop:this.cat_stage,
     normal_mode:1,
     scratching:0,
     cat_sender:this.cat,  
     achieve_state:{times_stppped_scratching:this.achieve_state.times_stppped_scratching+1},
    };
    txt=JSON.stringify(jesson);
    
    if(this.local)
    {  
      this.read_j(txt);
    }
    
    this.send_j(txt); 
    }
  },

  cat_ate_food: function(accept)
  {
    this.food_at_bowl=0;
    $("#food-bowl-img").attr("src",get_food_file("0",1));

    // ----------::::::::>>>>>>>>>This should, at some point, be changed that the health is sent as JSON?
    this.update_health(accept);

    if (this.cat)
    {
      $(".food_acceptor_name").html("You");
      $("#yay").html("Yay!!!!!! ");
      $("#approve-img").attr("src","img/food-approve-img.png");
      $("#food_acceptor_text").html(" just had lunch!");
      $("#foodModal-approve-points").html("+100");
      
    }
    else
    {
      $(".food_acceptor_name").html(this.other_name);
       $("#yay").html("Yay!! ");
       $("#food_acceptor_text").html(" just had lunch!");
       $("#foodModal-approve-points").html(" +100 Points! ");
      
    }
      //this.open_food_thing=1;
      this.add_modal("#foodModal-approve");
  },

  food_bowl_button_clicked: function()
  {
    var sender_dude=this.get_player_name();
    var jesson =
  {
    sender:sender_dude,
    cat_sender:this.cat,
    food_bowl:1,
  };

  txt=JSON.stringify(jesson);

    if(this.local)
      {  
        this.read_j(txt);
      }

      this.send_j(txt);
  },

  put_food_in_bowl: function(food_sent)
  {
    $("#food-bowl-img").attr("src",get_food_file(food_sent,1));
    this.food_at_bowl=food_sent;
  },


  add_notification: function(json_id)
  {

    if(!this.chat_opened)
    {
      this.notifications++;
      ion.sound.play("notification");
      this.update_notifications();
    }
    else
    {

    if (parseInt(json_id.split('_')[3])!=this.cat)
    {
     
     var sender_dude=this.get_player_name();
     var jesson =
    {
     sender:sender_dude,
     cat_sender:this.cat,
     chat_ack:1,
     data_type:"chat_ack",
     };

      txt=JSON.stringify(jesson);

     if(this.local)
       {  
         this.read_j(txt);
       }

       this.send_j(txt);
      }
  }
  },


  update_notifications: function()
  {
    if (this.chat_opened)
    {

      if (this.notifications>0)
      {
       var sender_dude=this.get_player_name();
       var jesson =
       {
         sender:sender_dude,
         cat_sender:this.cat,
         chat_ack:1,
         data_type:"chat_ack",
       };

      txt=JSON.stringify(jesson);

         if(this.local)
        {  
         this.read_j(txt);
        };

        this.send_j(txt);
      }

      this.notifications=0;

      $('.chat-notifications').hide();
    }
    else
    {
      if (this.notifications)
      {
        $('.chat-notifications').html(this.notifications);
        $('.chat-notifications').show();
      }
      else
      {
        $('.chat-notifications').hide();
      }
    }
  },  

  close_open_chat: function()
  {
    //$(".chat-trigger").trigger('click');
    //this.change_chat_status();
  },

  chat_clicked: function()
  {
    ion.sound.play("snap");
    
    
    /*
    if (this.chat_opened==9)
    {
      this.chat_opened=1;
    }
    else
    {
      this.chat_opened=1;
    }
   */ 
    //this.update_notifications();
  },

  print_text: function (txt,sender)
  {
    /*

      ========> Sample Chat HTML: <========  
      <li class="chat-message">
              <span class="chat-name">uri hamstr</span>
              <span class="chat-time">23:33</span>
              <span class="chat-single-message">Im so fucking dipressed...I hate my job, and my life...</span>
            </li>
    */
    var text_class = "other-message";
    if (this.me_id==sender)
      {
        text_class = "own-message";
        sender_name=this.me_name;
      }
      else
      {
        sender_name = this.other_name;
      }

    var chat_message='<li class="chat-message '+text_class+'"><span class="chat-name">'+sender_name+'</span><span class="chat-single-message">'+txt+'</span></li>';
    $(".chat-thread").append(chat_message);
    this.message_number++;
    $(".chat-message")[this.message_number-1].scrollIntoView();
    
    if (this.chat_opened)
    {
      ion.sound.play("glass");
    }
  },

 put_emoticon: function(emoti,sender)
  {
    var text_class = "other-message";
    if (this.me_id==sender)
      {
        text_class = "own-message";
        sender_name=this.me_name;
      }
      else
      {
        sender_name = this.other_name;
      }

    var chat_message='<li class="chat-message2 '+text_class+'"><span class="chat-name">'+sender_name+'</span><img class="sent-emoticon" src="'+get_emoticon_file(emoti)+'" alt="slide 1" /></li>';
    $(".chat-thread").append(chat_message);
     this.emoticon_number++;
    $(".chat-message2")[this.emoticon_number-1].scrollIntoView();
     
     if (this.chat_opened)
     {
      ion.sound.play("miau1");
     }
  },

  offer_food: function(food,sender)
  {
    /*
          =====> Sample Food HTML: <======

         <div id="foodModal" class="reveal-modal" data-reveal>
          <p class="lead"> <span class="food_sender_name">Uri</span> thinks you might be Hungry. are you?</p>
          <p class="food-type-cat"><img id="offered_food_image" src="img/food.png"></p>
          <div class="small-12 columns food-buttons-cat">
            <button class="red-x small-6 columns"><i class="fa fa-times"></i></button>
            <button class="green-y small-6 columns"><i class="fa fa-check"></i></button>
          </div>
        <a class="close-reveal-modal">&#215;</a>
        </div>
    */
    $(".food_sender_name").html(sender);
    $("#text_with_food").html("thinks you might be Hungry. are you?");
    $("#offered_food_image").attr("src",get_food_file(food));
    if (this.cat)
    {
      this.food_opened=1;
      
      /*
      if (this.chat_opened)
      {
        this.close_open_chat(); 
      }
      */
      /*
      if(this.food_opened)
      {
        close_food_thing();
      }
      */

      //$('#foodModal').foundation('reveal', 'open');
      this.add_modal("#foodModal");
    }
  },


  add_modal: function(modal_id)
  {
    this.modal_cue.push(modal_id);
    this.operate_cue();
  },

  operate_cue: function()
  {

    /*
    if (this.chat_opened)
    {
      this.close_open_chat();
    }
    */

    if(this.modal_cue.length>0)
    {
      var displayed = $(this.modal_cue[0]).css("display");

      if (displayed=="none")
      { 
        $(this.modal_cue[0]).foundation('reveal', 'open');
      }
    }
  },

  progress_cue: function()
  {
    this.modal_cue.reverse();
    this.modal_cue.pop();
    this.modal_cue.reverse();
    this.operate_cue();
  },

  accept_food: function(accept,sender)
  {
    this.update_health(accept);
    if (this.cat)
    {
      $(".food_acceptor_name").html("You");
      if(accept)
      {
       $("#yay").html("Yay!!!!!! ");
       $("#approve-img").attr("src","img/food-approve-img.png");
       $("#food_acceptor_text").html(" just had lunch!");
       $("#foodModal-approve-points").html("+100");
      }
      else
      {
        $("#yay").html("Ok ok. ");
       $("#food_acceptor_text").html(" are not hungry at the moment");
      }
    }
    else
    {
      $(".food_acceptor_name").html(sender);
      if(accept)
      {
       $("#yay").html("Yay!! ");
       $("#food_acceptor_text").html(" just had lunch!");
       $("#foodModal-approve-points").html(" +100 Points! ");
      }
      else
      {
       $("#food_acceptor_text").html(" is not hungry at the moment");
      }
    }
      this.open_food_thing=1;
      
      /*
      if (this.chat_opened)
      {
        this.close_open_chat(); 
      }
      */

      /*
      if(this.food_opened)
      {
        close_food_thing();
      }
      */
      //$('#foodModal-approve').foundation('reveal', 'open');
      this.add_modal("#foodModal-approve");
    
  },


  health_me: function(new_health)
  {
    this.health=new_health;
    this.adjust_health_pic();
  },


  update_health: function(food)
  {
   
    
    if (food)
    {

      var new_health=106+Math.random()*20;
      var sender_dude=this.get_player_name();  

      var jesson={
        sender:sender_dude,
        health:new_health,
        dead:0,
        normal_mode:1,
        last_health_timestamp:$.now(),
        cat_animation_loop:"cat_breathing",
        cat_sender:this.cat,
      }
      if (this.health>0 && this.health<25)
      {
        jesson.achieve_state.times_ate_while_really_hungry=this.achieve_state.times_ate_while_really_hungry+1;
      }

      if (this.dead)
        {jesson.achieve_state.times_revived=this.achieve_state.times_revived+1;}

      var  txt = JSON.stringify(jesson);

      if(this.local)
      {  
       game_manager.read_j(txt);
      }

      game_manager.send_j(txt);

      //if (this.cat)
      if(1==1)
        {
          window.clearInterval(this.health_timer);
          this.set_health_timer();
        }
    }
    else
    {
      
    }
    /*
    if (this.health<0)
    {
      this.play_dead();
    }
    */
  },

  hunger_tick: function()
  {
    new_health = this.health-5;
    var sender_dude=this.get_player_name();

      var jesson={
        sender:sender_dude,
        health:new_health,
        last_health_timestamp:$.now(),
        cat_sender:this.cat,
      }

      var  txt = JSON.stringify(jesson);
      
      if(this.local)
      {  
        game_manager.read_j(txt);
      }

      game_manager.send_j(txt);
  },

  adjust_health_pic: function()
  {
    if (this.cat)
    {
      if (this.health>=75)
      {
       $("#health-image").attr("src",get_health_file("health1"));
       $("#cat_avatar").attr("src",get_cat_file("healthy"));    
      }
      else if (this.health>=50)
      {
        $("#health-image").attr("src",get_health_file("health2"));
        $("#cat_avatar").attr("src",get_cat_file("healthy")); 
      }
      else if (this.health>=25)
      {
         $("#health-image").attr("src",get_health_file("health3"));
         $("#cat_avatar").attr("src",get_cat_file("healthy")); 
      }
       else if (this.health>=0)
     {
        $("#health-image").attr("src",get_health_file("health4"));
        $("#cat_avatar").attr("src",get_cat_file("healthy")); 
      }
      else if (0>this.health)
      {
        $("#health-image").attr("src",get_health_file("health5"));
        //$("#cat_avatar").attr("src","img/cat-sick.png"); 
         if (!this.dead)
         {
         this.play_dead();
        }
     }
    }
  },


  set_health_timer: function()
  {
    this.health_timer=setInterval(function () {game_manager.hunger_tick()}, this.health_interval);
  },

  play_dead: function()
  {
    
      var sender_dude=game_manager.get_player_name();
      var jesson =
      {
        sender:sender_dude,
        cat_animation_loop:"sick_cat",
       dead:1,
       normal_mode:0,
       timer_stop:this.cat_stage,
       cat_sender:this.cat,
      };

      if (!this.dead)
        {jesson.achieve_state.times_died=this.achieve_state.times_died+1;}

    txt=JSON.stringify(jesson);

    if(this.local)
      {  
        game_manager.read_j(txt);
      }

      game_manager.send_j(txt);
    //this.put_animaiton_loop("sick_cat",'swiffycontainer');
    
  },

  decide_level: function()
  {
    levels_array=[0,100,300,600,1000]
    level=0;
    for(i = 0; i < levels_array.length; i++)
      {
        if (this.score>=levels_array[i])
        {
          level = i;
        }
        else
        {
          return(level);
        }
      }
  },


  adjust_level: function()
  {
    if (this.decide_level()>this.level)
    {
      this.leveled_up(this.decide_level()-this.level);
    }
    $("#level").html(this.level);
  },

  change_score: function(change)
  {
    this.score=this.score+change;
    this.adjust_level();
    $("#score_number").html(this.score);
  },

  leveled_up: function(up)
  {
    this.level=this.level+up;
    $('.level-modal-level').html(this.level)
    //this.close_all();
    //$('#levelModal').foundation('reveal', 'open');
    this.add_modal('#levelModal');
    this.level_modal_open=1;
    this.new_level_logic();
  },

  new_level_logic: function()
  {
    switch (this.level)
    {
      case 1:
      if (this.cat)
      {
        this.adjust_modal_to_choose_emoticons();        
        this.add_modal('#levelgiftModal');
      }
      break;

      case 2:

      this.add_modal('#fish-gift-modal');

      var sender_dude=game_manager.get_player_name();
      var jesson =
      {
        sender:sender_dude,
        general_animation_loop:"fish_regular",
        animation_stage:this.fish_stage,
        fish_there:1,
        cat_sender:this.cat,
      };

    txt=JSON.stringify(jesson);

    if(this.local)
      {  
        game_manager.read_j(txt);
      }

      game_manager.send_j(txt);

      break;

      case 3:

      break;
    }
  },

  adjust_modal_to_choose_emoticons: function()
  {
    for(i = 0; i < this.possible_emoticon_list.length; i++)
    {
      if(this.current_emoticons.indexOf(this.possible_emoticon_list[i])<0)
      {
        
        var emoticon_choice='<li class="emoticon-choice" ><img id="emoticon-choice-'+this.possible_emoticon_list[i]+'" onclick="javascript:game_manager.emoticon_chosen(&#39'+this.possible_emoticon_list[i]+'&#39)" src="'+get_emoticon_file(this.possible_emoticon_list[i])+'"></li>';
        $("#choose_new_emoticons_area").append(emoticon_choice);
      }
    }
  },

  emoticon_chosen: function(emoti_chosen)
  {
    this.new_emoticon_pack.push(emoti_chosen);
    if (this.new_emoticon_pack.length==3)
    {
      this.add_emoticons(this.new_emoticon_pack);
      this.new_emoticon_pack=[];
      $('#levelgiftModal').foundation('reveal', 'close');
    }
    var idee="#emoticon-choice-"+emoti_chosen;
    $(idee).addClass("emoticon-chosen");
  },


  close_all: function() // DEPRECIATED. FOR NOW NO USE WHATSOEVER!!!
  {
    if (this.level_modal_open)
    {
      $('#levelModal').foundation('reveal', 'close');
      this.level_modal_open=0;
    }

    if (this.food_opened)
    {
     close_food_thing();
     this.food_opened=0;
    }
  },

  get_player_name: function()
  {
    return(this.player);
  },

  get_score: function()
  {
    return(this.score);
  },

  is_cat: function()
  {
    return(this.cat);
  },

  is_local: function()
  {
    return(this.local);
  },

  send_j:function(txt)
  {
    if (!this.local)
    {
      //this.socket.emit(this.game_id, txt);   

       if (typeof(txt)=="string")
      {
        txt = JSON.parse(txt);
      }
      txt = this.add_standards(txt);
      
      if (txt.actions.achieve_state)
      {
        txt = check_achievements(txt);
      }

      console.log(txt);
      this.socket.emit(String(this.game_id), txt);
    }
  },

   check_achievements: function(jason)
    {
      var proxy = this.achieve_state;
       $.each(jason.actions.achieve_state, function(prop_name,val){      
        proxy[prop_name]=jason.actions.achieve_state[prop_name];
      });
  // ["food_once","food_when_really_hungry","slept_once","scratched_once","revived_once","99_seconds_playing","9_minutes_playing",],

      var nu_achievement=0;

       if (!this.achievements_reached["food_once"])
       {
        if (proxy.times_food>1)
        {
          jason=this.nu_achievement(jason,"food_once");
        }
       }

         if (!this.achievements_reached["food_when_really_hungry"])
       {
        if (proxy.times_ate_while_really_hungry>1)
        {
          jason=this.nu_achievement(jason,"food_when_really_hungry");
        }
       }

         if (!this.achievements_reached["stopped_scratching_once"])
       {
        if (proxy.times_stppped_scratching>1)
        {
          jason=this.nu_achievement(jason,"stopped_scratching_once");
        }
       }

        if (!this.achievements_reached["slept_once"])
       {
         if (proxy.times_slept>1)
        {
          jason=this.nu_achievement(jason,"slept_once");
        }
       }

        if (!this.achievements_reached["scratched_once"])
       {
        if (proxy.times_scratched>1)
        {
          jason=this.nu_achievement(jason,"scratched_once");
        }
       }

        if (!this.achievements_reached["revived_once"])
       {
           if (proxy.times_revived>1)
        {
          jason=this.nu_achievement(jason,"revived_once");
        }
       }

           if (!this.achievements_reached["99_seconds_playing"])
       {

       }

        if (!this.achievements_reached["9_minutes_playing"])
       {
        
       }

       return(jason);

    },


    nu_achievement: function(jason,nu)
    {
        jason.achievements_reached[nu]=1;
        jason.achievements_seen[nu]=[0,0];
        jason.actions.achievements_reached[nu]=1;
        jason.actions.achievements_seen[nu]=[0,0];
    },

  add_standards: function(txt)
  {
    var jason = {};
    //jason.actions=JSON.parse(txt);
    jason.actions=txt;

    var game_stats = {
      score:0,
      health:100,
      health_proxy:100,
      level:0,
      food_opened:0,
      current_emoticons:[],
      possible_emoticon_list:[],
      dead:0,
      health_timer:{},
      message_number:0,
      emoticon_number:0,
      local:0,
      cat_sleep:0,
      head_clicked:0,
      belly_clicked:0,
      food_bowl_opened:0,
      food_at_bowl:0,
      normal_mode:1,
      new_emoticon_pack:[],
      fish_there:0,
      scratching:0,
      timeouts:{},
      scratch_mark:0,
      last_timestamp:$.now(),
      last_health_timestamp:0,
      interval_for_scratching:7000,
      animations:{"cat_stage":"cat_breathing","cat_hidden_stage":"wanting_caress","cat_hidden_stage2":"caressing_going_on"},
      displayed_cat_stage:"cat_stage",
      cat_animation_loop:'cat_breathing',
    };

   $.each(game_stats, function(prop_name,val){      
     game_stats[prop_name]=game_manager[prop_name];
    });

   $.each(jason.actions, function(prop_name,val){      
     game_stats[prop_name]=jason.actions[prop_name];
    });

   jason.actions.sender = this.me_id;

    game_stats.current_emoticons = JSON.stringify(game_stats.current_emoticons);   

   if (!txt.data_type)
    {
      jason.game_state = game_stats;
      jason.data_type="game";
    }
    else
    {
      jason.data_type=txt.data_type;
    }

    jason.game_id=this.game_id;
    jason.human_id=this.human_id;
    jason.sent_by=this.cat;
    jason.cat_id=this.cat_id;
    jason.timestamp=$.now();
    jason.id = jason.game_id+'_'+jason.timestamp+'_'+this.cat;
    jason.date_time=new Date(jason.timestamp);
    //txt = JSON.stringify(jason);
    return(jason);
  },

  listen_to_json: function()
  {
    if (!this.local)
    {
     // this.socket.on(this.game_id, function(msg){game_manager.read_j(msg);});
       this.socket.on(String(this.game_id), function(msg){game_manager.read_j(msg);});
    }
  }

};



//////------------------------ END OF GAME MANAGER -------------------
//////------------------------ END OF GAME MANAGER -------------------
//////------------------------ END OF GAME MANAGER -------------------
//////------------------------ END OF GAME MANAGER -------------------
//////------------------------ END OF GAME MANAGER -------------------



function open_food_thing()
{
  //$('#foodModal').foundation('reveal', 'open');
  game_manager.add_modal('#foodModal');
  game_manager.open_food_thing=1;
}

function close_food_thing()
{
  $('#foodModal').foundation('reveal', 'close');
  game_manager.open_food_thing=0;
}

function get_emoticon_file(txt)
{
  /*
  var diction = {
 "emo-happy":"img/emoticons/emo-happy.png",
 "emo-love":"img/emoticons/emo-love.png",
 "emo-dayan":"img/emoticons/emo-dayan.png",
 "emo-hipster":"img/emoticons/emo-hipster.png",
 "emo-kania":"img/emoticons/emo-kania.png",
 "emo-mad":"img/emoticons/emo-mad.png",
 "emo-night":"img/emoticons/emo-night.png",
 "emo-pilot":"img/emoticons/emo-pilot.png",
 "emo-worried":"img/emoticons/emo-worried.png",
 "emo-food":"img/emoticons/emo-food.png",
};

  if (diction[txt])
  {
    return(diction[txt]);
  }
  else
  {
    return("ERROR");
  } 

  */
  return("img/emoticons/"+txt+".png");
};

function get_possible_emoticons()
{
  var possible_emoticon_list=["emo-happy","emo-love","emo-dayan","emo-hipster","emo-kania","emo-mad","emo-night","emo-pilot","emo-worried","emo-food","emo-blue","emo-froid","emo-pig","emo-angel","emo-shark"];
  return(possible_emoticon_list);
};



function get_food_file(txt,at_bowl)
{
  if(at_bowl)
  {
    var diction = {"0":"img/foodbal-empty.png","1":"img/foodbal-full.png", "food2":"img/food.png"};
  }
  else
  {
    var diction = {"1":"img/food.png", "food2":"img/food.png"};
  }
   if (diction[txt])
  {
    return(diction[txt]);
  }
  else
  {
    return("ERROR");
  } 
};

function get_img_file(txt)
{
  return("img/"+txt);
}

function get_health_file(txt)
{
  var diction = {"health1":"img/health-01.png", "health2":"img/health-02.png", "health3":"img/health-03.png", "health4":"img/health-04.png","health5":"img/health-05.png"};

   if (diction[txt])
  {
    return(diction[txt]);
  }
  else
  {
    return("ERROR");
  } 
};

function get_cat_file(txt)
{
  var diction = { "healthy":"img/cat.png","sick":"img/cat-sick.png"};
   if (diction[txt])
  {
    return(diction[txt]);
  }
  else
  {
    return("ERROR");
  } 
};

function text_submitted()
{

  var submitted_txt = $('#chat_text').val();
  $('#chat_text').val("");
  var sender_dude=game_manager.get_player_name();

  if (game_manager.is_cat())
  {
    submitted_txt=break_and_miau(submitted_txt);
  }

  var jesson ={
    text:submitted_txt,
    sender:sender_dude,
    data_type:"chat_message",
    score:1,
    notification:1,
    cat_sender:game_manager.cat,
  };
  var  txt = JSON.stringify(jesson);
  if(game_manager.is_local())
  { 
    game_manager.read_j(txt);
  } 
  game_manager.send_j(txt);
}

function emoticon_clicked(emoti)
{
  var sender_dude=game_manager.get_player_name();
  var jesson ={
    sender:sender_dude,
    emoticon:emoti,
    data_type:"chat_message",
    score:2,
    notification:1,
    cat_sender:game_manager.cat,
  };
  var  txt = JSON.stringify(jesson);

  if(game_manager.is_local())
  { 
   game_manager.read_j(txt);
  }
  game_manager.send_j(txt);

}

function food_clicked(food)
{
  
var sender_dude=game_manager.get_player_name();
$('#foodModal').foundation('reveal', 'close');
game_manager.open_food_thing=0;

if (game_manager.is_cat())
{
  if (food)
    {var score_change=100;}
  else
    {var score_change=0;}

  var jesson =
  {
    sender:sender_dude,
    food_accepted:food,
    score:score_change,
    cat_sender:game_manager.cat,
  };

}
else
{
  if (food)
  {
    var jesson =
    {
     sender:sender_dude,
      //food_offered:food,
      food_at_bowl:food,
      //score:score_change,
      cat_sender:game_manager.cat,
     };
  }
  else
  {
    var jesson=false;
  }
}

if (jesson)
{
  var  txt = JSON.stringify(jesson);
  if(game_manager.is_local())
  {
    game_manager.read_j(txt);
  }
  game_manager.send_j(txt);
}

}

// ---------->--------------->-----------> Unrelated to the game manager!!!

/*
// ----> Remove address bar from browser
window.addEventListener("load",function() {
    // Set a timeout...
    setTimeout(function(){
        // Hide the address bar!
        window.scrollTo(0, 0);
    }, 0);
  });

*/


/*
function hideAddressBar()
{
  if(!window.location.hash)
  {
      if(document.height < window.outerHeight)
      {
          document.body.style.height = (window.outerHeight + 50) + 'px';
      }
 
      setTimeout( function(){ window.scrollTo(0, 1); }, 50 );
  }
}
 
window.addEventListener("load", function(){ if(!window.pageYOffset){ hideAddressBar(); } } );
window.addEventListener("orientationchange", hideAddressBar );
*/
