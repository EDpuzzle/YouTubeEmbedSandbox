if (Meteor.isClient) {

  var youtubeAPI,
      youtubeVideo;

  /* ====================================== */
  /*            Initialization              */
  /* ====================================== */

  Meteor.startup(function () {

    setInitialAppSessionState();

    window.onYouTubeIframeAPIReady =  function() {
      Session.set('apiReady', true);
      youtubeAPI = YT;
    }

    var tag = document.createElement('script');
    tag.src = "http://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  });


  /* ====================================== */
  /*        Session Initialization          */
  /* ====================================== */


  setInitialAppSessionState = function () {
    Session.setDefault('apiReady', false);
    Session.setDefault('embedMethod',  3);
    Session.setDefault('playerReady', false);
    Session.setDefault('playerStateAvailable', false);
  };

  initializePlayerTests = function () {
    Session.set('playerReady', false);
    Session.set('playerStateAvailable', false);
  };

  /* ====================================== */
  /*            YT Loading Test             */
  /* ====================================== */

  Template.ytIframeApi.apiReady = function () {
    return Session.get('apiReady');
  };

  /* ====================================== */
  /*             YT Player Tests            */
  /* ====================================== */


  Template.ytPlayerTests.playerReady = function () {
    return Session.get('playerReady');
  };

  Template.ytPlayerTests.playerStateAvailable = function () {
    return Session.get('playerStateAvailable');
  };


  /* ====================================== */
  /*             YT Embed Methods           */
  /* ====================================== */

  changeVideoState = function () {
    youtubeVideo.playVideo();
  };

  Template.ytPlayer.embedMethod = function (methodNumber) {
    return Session.equals('embedMethod', methodNumber);
  };

  Template.ytPlayer.rendered = function () {

    console.log('RENDERED');

    if (Session.get('embedMethod') === 3) {

      console.log('REnderer 3rd method');

      youtubeVideo = new youtubeAPI.Player("video-container", {
        events: {
          height:  '390',
          width:   '640',
          videoId: 'cN2VJsiZlk0',
          playerVars: {
            controls: 0,
            showinfo: 0,
            disablekb: 1,
            autoplay: 0,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            wmode: "transparent",
            enablejsapi: 1
          },
          onReady: function (event) {
            Session.set('playerReady', true);
          },
          onStateChange: function (event) {
            Session.set('playerStateAvailable', true);
          }
        }
      });

    } else {

      youtubeVideo = new youtubeAPI.Player("youtube-video-player", {
        events: {
          onReady: function (event) {
            Session.set('playerReady', true);
          },
          onStateChange: function (event) {
            Session.set('playerStateAvailable', true);
          }
        }
      });

    }

  };

  /* ====================================== */
  /*        Embed Methods Navigation        */
  /* ====================================== */

  updateMethodAndTests = function (methodNumber) {
    Session.set('embedMethod', methodNumber);
    initializePlayerTests();
  };

  Template.methodNav.activeMethod = function (methodNumber) {
    return Session.equals('embedMethod', methodNumber) ? "active" : "";
  };

  Template.methodNav.events = {
    'click #firstMethod': function () {
      updateMethodAndTests(1);
    },
    'click #secondMethod': function () {
      updateMethodAndTests(2);
    },
    'click #thirdMethod': function () {
      updateMethodAndTests(3);
    }
  };


}
