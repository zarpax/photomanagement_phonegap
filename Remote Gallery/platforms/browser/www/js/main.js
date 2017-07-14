var app = {
  server: "192.168.2.7:8080",
  // var myScroll;
  appSettings : {},
  firstGalleryLoaded : false,
  thumbs: [],
  thumbIndex: 0,
  thumbWidth: 100,
  thumbHeight: 100,

  main: function() {
    FastClick.attach(document.body);
    this.initButtons();
    this.readSettings();
  },

  verifySettings : function() {
    // alert("verifySettings app.appSettings[" + JSON.stringify(app.appSettings) + "]");
    app.calculateThumbSize();

    alert("Thumbs calculated width[" + app.thumbWidth + "] height[" + app.thumbHeight + "]");

    if (app.appSettings.userSettings == null) {
        $.mobile.changePage("#pageSettings");
    } else {
      app.login();
    }
  },

  calculateThumbSize: function() {
    var pixelRatio = 1;

    if (window.devicePixelRatio) {
      pixelRatio = window.devicePixelRatio;
    }

    var physicalScreenWidth = window.screen.width * pixelRatio;

    if (physicalScreenWidth > 1000) {
      app.thumbWidth = 150;
      app.thumbHeight = 150;
    } else if (physicalScreenWidth > 720) {
      app.thumbWidth = 100;
      app.thumbHeight = 100;
    }
  },

  initButtons: function() {
    var buttonSettingsUpdate = document.querySelector('#settingUpdateButton');
    var buttonRefreshGallery = document.querySelector('#refreshGalleryButton');

    buttonSettingsUpdate.addEventListener('click' ,this.prepareSettingsForSave ,false);
    buttonRefreshGallery.addEventListener('click' ,this.refreshGallery ,false);
  },

  readSettings: function() {
    window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, this.getFS4Read, this.fail);
  },

  getFS4Read: function(fileSystem) {
    fileSystem.getFile("files/"+"settings.json", null, app.getFileEntry, app.noFile);
  },

  getFileEntry: function(fileEntry) {
    fileEntry.file(app.readFile, app.fail);
  },

  readFile: function(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
      var data = evt.target.result;
      app.appSettings = JSON.parse(data);
      $('#settingsName').val(app.appSettings.userSettings.name);
      $('#settingsPassword').val(app.appSettings.userSettings.password);
      //alert(" readFile data[" + data + "]");
      app.verifySettings();
    };

    reader.readAsText(file);
  },

  noFile: function(error) {
    alert("noFile [" + error.code + "]");
    app.appSettings = {};
  },

  fail: function(error) {
    alert("fail [" + error.code + "]");
    console.log(error.code);
  },

  prepareSettingsForSave: function() {
    //alert("prepareSettingsForSave");
    //alert("this.appSettings[" + JSON.stringify(this.appSettings) + "]");

    var userForm = JSON.stringify({userSettings:{name:$('#settingsName').val(), password:$('#settingsPassword').val()}});
    //alert(userForm);
    app.appSettings = JSON.parse(userForm);
    app.saveSettings();
  },

  saveSettings: function() {
    window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, this.getFS4Write, this.fail);
  },

  getFS4Write: function(fileSystem) {
    fileSystem.getFile("files/"+"settings.json", {create: true, exclusive: false}, app.getFileEntry4Write, app.fail);
  },

  getFileEntry4Write: function(fileEntry) {
    fileEntry.createWriter(app.saveFile, app.fail);
  },

  saveFile: function(writer) {
    writer.onwriteend = function(evt) {
      app.login();
      console.log("saved");
    };

    alert("Saving.... " + JSON.stringify(app.appSettings));
    writer.write(JSON.stringify(app.appSettings));
  },

  login: function() {
    //alert("Doing login on server");
    loginUser(app.appSettings.userSettings.name, app.appSettings.userSettings.password);
    //alert("Login request sent");
  },

  callbackLogin: function(status) {
    if (status != false) {
      alert("Login hecho!");
    } else  {
      alert("Login incorrecto");
    }
  },

  showImage: function(response) {
    $('#imgDetail').attr('src', "data:image/jpeg;base64," + response);
    $('#imgDetail').attr('height', "100%");
    $('#imgDetail').attr('width', "100%");
    $.mobile.changePage("#pageImgDetail");

  },

  showPhoto: function(photoId, width, heigth) {
    $('#imgDetail').attr('src', "http://" + app.server + "/fileService/getPhoto/" + photoId + "/" + width + "/" + heigth);
    // $('#imgDetail').attr('height', heigth);
    // $('#imgDetail').attr('width', width);
    $.mobile.changePage("#pageImgDetail");
  },

  tapPhoto: function(event) {
    var pixelRatio = 1;

    if (window.devicePixelRatio) {
      pixelRatio = window.devicePixelRatio
    }

    var physicalScreenWidth = window.screen.width * pixelRatio;
    var physicalScreenHeight = window.screen.height * pixelRatio;

    app.showPhoto(event.target.id, physicalScreenWidth, physicalScreenHeight);
  },

  refreshGallery: function() {
    $('#divPhotos').empty();
    getThumbs();
  },

  loadThumb: function() {
    alert("loadThumb");
    if (app.thumbs[app.thumbIndex]) {
      thumb = app.thumbs[app.thumbIndex];
      downloadThumb(thumb.photoId, thumbWidth, thumbHeight);
      app.thumbIndex = app.thumbIndex + 1;
    } else {
      $('#divPhotos').trigger('resize');
    }
  },

  createThumbs: function() {
    for(number in app.thumbs) {
      thumb = app.thumbs[number];
      var img = $('<img id="' + thumb.photoId + '" data-theme="a">'); //Equivalent: $(document.createElement('img'))
      img.attr('src', "http://" + app.server + "/fileService/getThumb/" + thumb.photoId + "/" + app.thumbWidth + "/" + app.thumbHeight);
      img.attr('height', app.thumbWidth + "px");
      img.attr('width', app.thumbHeight + "px");
      img.tap(app.tapPhoto);
      img.appendTo('#divPhotos');
    }
  }

};

  if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
      app.main();
    }, false);
  };

  $(document).on("pageshow","#pageGallery",function(){ // When entering pagetwo
    if (!app.firstGalleryLoaded) {
      app.firstGalleryLoaded = true;
      app.refreshGallery();
    }
  });
