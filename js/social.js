var friendCache = {};


function listen_to_json ()
  {
       socket.on(friendCache.me.id, function(msg){ console.log("User ID Is "+ friendCache.me.id);
        read_j(msg);});
  }


function read_j(msg)
{
  console.log("MESSAGE ARRIVED");
  console.log(msg);

  console.log("Friends Friends")
  console.log(friendCache.friends);

  if (msg.player_first_entry)
  {
    friendCache.friends.data[friendCache.friends.data.length]=
    {
      first_name:msg.name.split(' ')[0],
      id:msg.player_first_entry,
      picture:msg.picture,
      name:msg.name,
    }
    put_games_and_ingame_friends();
  }
  else if(msg.notifications_mainscreen)
  {
    console.log("NOTIFICATION");

    if ( friendCache.me.id == msg.game_id.split('_')[0])
    {
      cat_man = 1;
    }
    else
    {
      cat_man = 0;
    }

    var not_idee = "#notifications_"+msg.game_id.split('_')[cat_man];
    var user_idee = "user_"+msg.game_id.split('_')[cat_man]; 

    for (i = 0 ; i <friendCache.game_mates.length ; i ++)
    {
      if (friendCache.game_mates[i].game_id == msg.game_id)
      {
        indx = i;
        break;
      }
    }
    if (friendCache.game_mates[indx].notifications==undefined)
      {friendCache.game_mates[indx].notifications=0;}

  friendCache.game_mates[indx].notifications++;
  
   var notifications_span_to_add = '<span id="notifications_num_'+String(friendCache.game_mates[indx].other_id)+'" class="notifications-number">'+friendCache.game_mates[indx].notifications+'</span>';
   num_id='#notifications_num_'+String(friendCache.game_mates[indx].other_id);
   span_id = '#notifications_span_'+String(friendCache.game_mates[indx].other_id);
   $(num_id).remove();
   $(span_id).append(notifications_span_to_add);
  }
  else if (msg.game_status=="new") // -----> Data type!!!
  { 
    console.log("Nu GAme Bitches");
    console.log(msg);

    if ( friendCache.me.id == msg.game_id.split('_')[0])
      {var other_is_cat=1;
        var me_cat=0;}
      else
      {var other_is_cat=0; 
        var me_cat=1;}

        var click_able = 1;

        if ( (msg.cat_last_login && me_cat) || (msg.human_last_login && !me_cat))
            {
              console.log("clickable gonna die "+me_cat)
              var click_able =0;
            }

            if (friendCache.game_mates==undefined)
              {friendCache.game_mates=[];}

      friendCache.game_mates[friendCache.game_mates.length]=
      {
        other_id:msg.game_id.split('_')[other_is_cat],
        cat:me_cat,
        game_id:msg.game_id,
        started:0,
        notifications:0,
        clickable:click_able
      };

      put_games_and_ingame_friends();
  }
  else if (msg.game_status=="started")
  {

    if ( friendCache.me.id == msg.game_id.split('_')[0])
      {var other_is_cat=1;
        var me_cat=0;}
      else
      {var other_is_cat=0; 
        var me_cat=1;}

     if (friendCache.game_mates==undefined)
        {friendCache.game_mates=[];}

      friendCache.game_mates[friendCache.game_mates.length]=
      {
        other_id:msg.game_id.split('_')[other_is_cat],
        cat:me_cat,
        game_id:msg.game_id,
        started:1,
        notifications:0,
        clickable:1,
      };

      put_games_and_ingame_friends();
  }
  else if (msg[0]!=undefined && msg[0].messages_unseen)
  {
    if (msg[0].messages_unseen)
    {
      for (i=0 ; i <msg.length ; i++)
      {
        for(j=0 ; j<friendCache.game_mates.length ; j++)
        {
            if (friendCache.game_mates[j].game_id == msg[i].game_id)
          {
            var indx = j;
            break;
          }
        }

        friendCache.game_mates[indx].notifications = msg[i].messages_unseen;
        var notifications_span_to_add = '<span id="notifications_num_'+String(friendCache.game_mates[indx].other_id)+'" class="notifications-number">'+friendCache.game_mates[indx].notifications+'</span>';
        idee = '#notifications_span_'+String(friendCache.game_mates[indx].other_id);
        $(idee).append(notifications_span_to_add);
      }
    }
  }
  else if(msg.games_list) 
  {
    msg = msg.result;
    console.log("HERE FUCK FUYCK");
    if (friendCache.game_mates==undefined)
    {friendCache.game_mates= [];}
    for (i=0 ; i <msg.length ; i++)
    {
      if ( friendCache.me.id == msg[i].game_id.split('_')[0])
      {var other_is_cat=1;
        var me_cat=0;}
      else
      {var other_is_cat=0; 
        var me_cat=1;}

        var click_able = 1;

      msg[i].game_id.split('_')[other_is_cat];
      if (msg[i].game_start)
        {start=1;}
      else
        {
          console.log("Cat Login is "+msg[i].cat_last_login+" and I am cat "+me_cat);
          if ( (msg[i].cat_last_login && me_cat) || (msg[i].human_last_login && !me_cat))
            {
              var click_able =0;
            }

            if (msg[i].cat_last_login && msg[i].human_last_login)
              { click_able =1;}

          start=0;
        }

      friendCache.game_mates[i]= 
      {
        other_id:msg[i].game_id.split('_')[other_is_cat],
        cat:me_cat,
        game_id:msg[i].game_id,
        notifications:msg[i].messages_unseen, // <------------ Where the notifications should be loaded fromt he DB
        started:start, // <------ CHANGE THE 'STARTED' THING LAGER
        clickable:click_able,
      }; 
          }
    friendCache.got_ongoing_games=1;

    console.log("Game Mating");
    console.log()
    put_games_and_ingame_friends();
  }
}

function put_games_and_ingame_friends()
{
 console.log("putting games and friends");
 console.log(friendCache.friends);

 console.log("Game Mates");
 console.log(friendCache.game_mates);

// if (friendCache.got_ongoing_games && friendCache.got_ingame_friends)
if (1==1)
 {
  $('.game-instance').remove();
  $('.in-game-friend-instance').remove();
  
  if (friendCache.friends!=undefined)
    {putFriendsInGame();}
  if (friendCache.game_mates!=undefined && friendCache.friends!=undefined)
    {putGames();}
 
 }
}


function putGames ()
{
  for(i = 0; i < friendCache.game_mates.length ; i++)
  {

    for (j = 0 ; j<friendCache.friends.data.length ; j++ )
    {
      if (friendCache.game_mates[i].other_id==friendCache.friends.data[j].id)
      {
        friendCache.game_mates[i].friend_index=j;
        break;
      }
    }

    console.log("Here cat is " + friendCache.game_mates[i].cat);
    
    var choose_image="img/choose-man.png";
    if (friendCache.game_mates[i].cat)
    {choose_image="img/choose-cat.png";}

    var is_pending="";

    if (!friendCache.game_mates[i].started)
    {
      is_pending='<div class="right games-list-item-status">pending</div>';
      bell ="";
    }
    else
    {
      bell = '<i class="fa fa-bell">';
    }
    //id=friendCache.game_mates[i].other_id;
//&#39'+i+'&#39

// ------>>>>>>>  addiing the game to the list ! ! ! 

  id = friendCache.friends.data[friendCache.game_mates[i].friend_index].id;

  html_id = "#user_"+String(id);

  // id=&#39user_'+String(id)+'&#39

var notifications_span_to_add="";

if (friendCache.game_mates[i].notifications)
{
  notifications_span_to_add = '<span id="notifications_num_'+String(friendCache.game_mates[i].other_id)+'" class="notifications-number">'+friendCache.game_mates[i].notifications+'</span>';
}

   html_thing='<li class="game-list-game row clearfix game-instance" id="user_'+String(id)+'" onclick="load_game('+i+','+friendCache.game_mates[i].clickable+')"><a class="games-list-partner-avatar left" href="#"><img src="'+friendCache.friends.data[friendCache.game_mates[i].friend_index].picture.data.url+'"></a><a class="games-list-partner-name left" href="#">'+friendCache.friends.data[friendCache.game_mates[i].friend_index].name+'</a><a class="clearfix games-list-my-icon right" href="#"><img class="left" src="'+choose_image+'">'+is_pending+'</a><span id="notifications_span_'+String(id)+'" class="game-notification-mainscreen right">'+bell+notifications_span_to_add+'</i></span></li>';
   $(html_id).remove();
   $("#available_friends_list").prepend(html_thing);
   friendCache.friends.data[friendCache.game_mates[i].friend_index].game_on=1;
  }
}

function load_game(index,clickable)
{

if (!clickable)
{
  console.log("here happens what happens when you click on a pending");
}
else
{
  index=parseInt(index);
  if (!friendCache.game_mates[index].started)  
  {
    var jason = {
      game_id:friendCache.game_mates[index].game_id,
      data_type:"game_enter",
      sent_by:friendCache.game_mates[index].cat,
    };
    
    jason.timestamp=$.now();
    jason.date_time=new Date(jason.timestamp);
    socket.emit('join',jason);
  }
  sessionStorage.game_id=friendCache.game_mates[index].game_id;
  sessionStorage.is_cat=friendCache.game_mates[index].cat;
  sessionStorage.other_name=friendCache.friends.data[friendCache.game_mates[index].friend_index].name;
  
  window.location.href="game.html#";
}
  
}

function putFriendsInGame()
{
  for(i = 0; i < friendCache.friends.data.length ; i++)
  {
    //if (!friendCache.friends.data[i].game_on)

    //id=&#39user_'+String(id)+'&#39

      if (1==1)
    {
      id=friendCache.friends.data[i].id;
      html_thing='<li class="game-list-game row clearfix in-game-friend-instance" id="user_'+String(id)+'" onclick="show_chars( &#39 '+String(id)+' &#39)"><a class="games-list-partner-avatar left" href="#"><img src="'+friendCache.friends.data[i].picture.data.url+'"></a><a class="games-list-partner-name left" href="#">'+friendCache.friends.data[i].name+'</a><a class="clearfix games-list-my-icon right" href="#"></a></li>';
      $("#available_friends_list").append(html_thing);
    }
  }
}


function putInvitableFriends()
{

  // ----> Removing the list of invitable blablablabla. To re-indroduce it, uncomment this AND uncommment invite_list in index.html
  /*
  for(i = 0; i < 10; i++)
  {
   //console.log(friendCache.invitable_friends.data[i]); +friendCache.invitable_friends.data[i].picture.data.url+  +friendCache.invitable_friends.data[i].name+
   // <img class="left" src="img/choose-cat.png">
   html_thing='<li class="game-list-game row clearfix" onclick="invite_this_one(&#39'+friendCache.invitable_friends.data[i].id+'&#39)"><a class="games-list-partner-avatar left" href="#"><img src="'+friendCache.invitable_friends.data[i].picture.data.url+'"></a><a class="games-list-partner-name left" href="#">'+friendCache.invitable_friends.data[i].name+'</a><a class="clearfix games-list-my-icon right" href="#"></a></li>';
   $("#invite_list").append(html_thing);
  }
  */
}




// ---------

function login_try()
{
  FB.login(function(response){
   
    console.log(response);

    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      //console.log(response.authResponse.accessToken);
      console.log("CONNECTED CONNECTED");
      take_out_login();
      put_games_screen();
      get_user_data_from_fb_api();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not the app.
      put_login();

    } else {
      // The person is not logged into Facebook, so we're not sure if
     put_login();
    }
  },{scope: 'public_profile,email,user_friends'});

  // {scope: 'public_profile,email,user_friends,user_likes'}); <<-------- we took out "user likes" cause of Mark Zukerberg being a prick
}

function getMe(callback) {
  FB.api('/me', {fields: 'id,email,name,first_name,gender,hometown,languages,locale,location,relationship_status,age_range,picture.width(120).height(120)',}, function(response){
    if( !response.error ) {
      friendCache.me = response;
      sessionStorage.me_id=friendCache.me.id;
      sessionStorage.me_name=friendCache.me.name;
       if (callback)
       {
        callback();
       }
      //document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.name + '!';
    } else {
      console.error('/me', response);
    }
  });
}

function invite_to_play(to, message, callback) {
  var options = {
    method: 'apprequests'
  };
  if(to) options.to = to;
  if(message) options.message = message;
  FB.ui(options, function(response) {
    if(callback) callback(response);
  });
}

function on_invite() {
  invite_to_play(null,'CatPeeps is a game where you can play my cat! Come and let me feed you!', function(response) {
    console.log('sendChallenge',response);
    response.data_type="invite";
    response.sender=friendCache.me.id;
    response.timestamp=$.now();
    response.date_time=new Date(response.timestamp);
    socket.emit("invite",response);
    if (response.to)
      {$('#invitation-modal').foundation('reveal', 'open');}
  });
}


function getInvitableFriends(callback) {
  FB.api('/me/invitable_friends', {fields: 'id,name,first_name,picture.width(120).height(120)'}, function(response){
    if( !response.error ) {
      friendCache.invitable_friends = response;
      callback();
    } else {
      console.error('/me/invitable_friends', response);
    }
  });
}

function getFriendsInGame(callback) {
  FB.api('/me/friends', {fields: 'id,email,name,first_name,picture.width(120).height(120)'}, function(response){
    if( !response.error ) {
      friendCache.friends = response;
      friendCache.got_ingame_friends=1;
         console.log(friendCache.friends);
      callback();
    } else {
      console.error('/me/friends', response);
    }
  });
}

function getPermissions(callback) {
  FB.api('/me/permissions', function(response){
    if( !response.error ) {
      friendCache.permissions = response;
      callback();
    } else {
      console.error('/me/permissions', response);
    }
  });
}

function invite_this_one(id)
{
  console.log("INVITE "+id);
  invite_to_play("AVndEDjmOviOQcEEHyNLegd-xQsUNTRXG77Xn1PWHyVziHDBGnP1s-6pLTeQZBfBmQBEKNi4Z3pkZVN47J1W2jmgqLhxKZ6MDip0Kh4srFl7Ig",'CatPeeps is a game where you can play my cat! Come and let me feed you!', function(response) {
    console.log('sendChallenge',response);
  });
}

function char_chosen(type)
{
  console.log("chosen "+type);
  sessionStorage.is_cat=type;
 if (type)
 {
  //sessionStorage.game_id=String(sessionStorage.other_id)+'_'+String(sessionStorage.my_id).trim();
  nu_game_id=String(sessionStorage.other_id)+'_'+String(sessionStorage.my_id).trim();
 }
 else
 {
  //sessionStorage.game_id=String(sessionStorage.my_id)+'_'+String(sessionStorage.other_id).trim();
  nu_game_id=String(sessionStorage.my_id)+'_'+String(sessionStorage.other_id).trim();
 }
var jason = {game_id:nu_game_id,
  data_type:"game_enter",
  sent_by:type,};
  jason.timestamp=$.now();
  jason.date_time=new Date(jason.timestamp);

  //socket.on(String(nu_game_id), function(msg){console.log(msg);});

 socket.emit('join',jason);

 //$('#char_choose').css('display','none');
  $("#choose_modal").foundation('reveal', 'close');

 console.log("SHOULD jOIN NOW "+nu_game_id);
  //getFriendsInGame(putFriendsInGame);
  //
  //window.location.href="game.html#";
  
}



function show_chars(id)
{
  id = id.trim();
  //sessionStorage.new_char=type;
 // $('#char_choose').css('display','block');

 $("#choose_modal").foundation('reveal', 'open');
  sessionStorage.other_id=id;
}

function writeMe()
{
  sessionStorage.my_id=friendCache.me.id;

  listen_to_json();

  jason = friendCache.me;
  jason.data_type="player";
  txt=JSON.stringify(jason);
  
  socket.emit('data', txt);

}


function writeUs()
{
  console.log(friendCache.friends);
}


function writePerm()
{
  console.log(friendCache.permissions);
}


function sendChallenge(to, message, callback) {
  var options = {
    method: 'apprequests'
  };
  if(to) options.to = to;
  if(message) options.message = message;
  FB.ui(options, function(response) {
    if(callback) callback(response);
  });
}

function onChallenge() {
  sendChallenge(null,'Zionism is bad! Send Me Some HTML Files!', function(response) {
    //console.log('sendChallenge',response);
  });
}


function put_login(){
$('body').addClass('index-inviter-login-wrapper');
$('#login_thing').css('display','block');
}

function take_out_login(){
$('body').removeClass('index-inviter-login-wrapper');
$('#login_thing').css('display','none');
}

function put_games_screen(){
$('#games_screen').css('display','block');
}




/*
function login(callback) {
  FB.login(callback);
}
function loginCallback(response) {
  console.log('loginCallback',response);
  if(response.status != 'connected') {
    top.location.href = 'https://www.facebook.com/appcenter/YOUR_APP_NAMESPACE';
  }
}
function onStatusChange(response) {
  if( response.status != 'connected' ) {
    login(loginCallback);
  } else {
    showHome();
  }
}
function onAuthResponseChange(response) {
  console.log('onAuthResponseChange', response);
}
*/