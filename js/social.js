var friendCache = {};




function listen_to_json ()
  {
       socket.on("data", function(msg){read_j(msg);});
  }


function read_j(msg)
{
  
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
  },{scope: 'public_profile,email,user_friends,user_likes'});
}

function getMe(callback) {
  FB.api('/me', {fields: 'id,email,name,first_name,gender,hometown,languages,locale,location,relationship_status,age_range,picture.width(120).height(120)',}, function(response){
    if( !response.error ) {
      friendCache.me = response;

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


function putInvitableFriends()
{
  //console.log(friendCache.invitable_friends);
  for(i = 0; i < 10; i++)
  {
   //console.log(friendCache.invitable_friends.data[i]); +friendCache.invitable_friends.data[i].picture.data.url+  +friendCache.invitable_friends.data[i].name+
   // <img class="left" src="img/choose-cat.png">
   html_thing='<li class="game-list-game row clearfix" onclick="invite_this_one(&#39'+friendCache.invitable_friends.data[i].id+'&#39)"><a class="games-list-partner-avatar left" href="#"><img src="'+friendCache.invitable_friends.data[i].picture.data.url+'"></a><a class="games-list-partner-name left" href="#">'+friendCache.invitable_friends.data[i].name+'</a><a class="clearfix games-list-my-icon right" href="#"><div class="right games-list-item-status">pending</div></a></li>';
   $("#invite_list").append(html_thing);
  }
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
  sessionStorage.game_id=String(sessionStorage.other_id)+'_'+String(sessionStorage.my_id).trim();
 }
 else
 {
  sessionStorage.game_id=String(sessionStorage.my_id)+'_'+String(sessionStorage.other_id).trim();
 }
  //getFriendsInGame(putFriendsInGame);
  //
  window.location.href="game.html#";
  
}

function putFriendsInGame()
{
  console.log("Zionism IS SHIT");
  console.log(friendCache.friends.data[0].id);
  for(i = 0; i < friendCache.friends.data.length ; i++)
  {
    id=friendCache.friends.data[i].id;
   //console.log(friendCache.invitable_friends.data[i]); +friendCache.invitable_friends.data[i].picture.data.url+  +friendCache.invitable_friends.data[i].name+
   //<img class="left" src="img/choose-cat.png">
   //friendCache.friends.data[0].id
   // &#39'+friendCache.friends.data[i].id+'&#39
   html_thing='<li class="game-list-game row clearfix" onclick="show_chars( &#39 '+String(id)+' &#39)"><a class="games-list-partner-avatar left" href="#"><img src="'+friendCache.friends.data[i].picture.data.url+'"></a><a class="games-list-partner-name left" href="#">'+friendCache.friends.data[i].name+'</a><a class="clearfix games-list-my-icon right" href="#"><div class="right games-list-item-status">pending</div></a></li>';
   $("#available_friends_list").append(html_thing);
  }
}

function show_chars(id)
{
  id = id.trim();
  //sessionStorage.new_char=type;
  $('#char_choose').css('display','block');
  sessionStorage.other_id=id;
  //console.log("START GAME");
}

function writeMe()
{
  sessionStorage.my_id=friendCache.me.id;

 
  jason = friendCache.me;
  jason.data_type="player";
  console.log('HHHHHHHH');
  txt=JSON.stringify(jason);

  console.log(jason);
  console.log("What");
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