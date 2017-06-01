var app = {
  // var myScroll;
  appSettings : {},

  main: function() {
    FastClick.attach(document.body);
    this.initButtons();
    this.readSettings();
  },

  verifySettings : function() {
    // alert("verifySettings app.appSettings[" + JSON.stringify(app.appSettings) + "]");

    if (app.appSettings.userSettings == null) {
        $.mobile.changePage("#pageSettings");
    } else {
      app.login();
      //$.mobile.changePage("#pageGallery");
      //getRecentThumbs();
    }
  },

  initButtons: function() {
    var buttonSettingsUpdate = document.querySelector('#settingUpdateButton');
    // var settingsGalleryButton = document.querySelector('#settingsGalleryButton');
    // var gallerySettingsButton = document.querySelector('#gallerySettingsButton');

    buttonSettingsUpdate.addEventListener('click' ,this.prepareSettingsForSave ,false);
    // settingsGalleryButton.addEventListener('click' ,this.settingsGalleryButtonEvent ,false);
    // gallerySettingsButton.addEventListener('click' ,this.gallerySettingsButtonEvent ,false);
  },

  settingsGalleryButtonEvent : function() {
    $('#pageSettings').hide();
    $('#pageGallery').show();
    getRecentThumbs();
  },

  gallerySettingsButtonEvent : function() {
    $('#pageGallery').hide();
    $('#pageSettings').show();
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
    $('#imgDetail').attr('src', "data:" + response.mime + ";base64," + response.bytes);
    $('#imgDetail').attr('height', "100%");
    $('#imgDetail').attr('width', "100%");
    $.mobile.changePage("#pageImgDetail");

  },

  tapPhoto: function(event) {
    getPhoto(event.target.id);
  }

};



  if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
      app.main();
    }, false);
  };

  $(document).on("pageshow","#pageGallery",function(){ // When entering pagetwo
    $('#divPhotos').empty();
    getRecentThumbs();
  });

  // function calcular(){
  // //Obtenemos el ancho del dispositivo
  // widthScreen = innerWidth;
  // x$('#zoom').css({ width: widthScreen+'px' });
  //
  // /*Calculamos el ancho que deben tener cada foto en miniatura segun el ancho de la pantalla para poder asignarle el mismo alto*/
  // if(widthScreen>='960') heightCapa = (widthScreen / 10)-10;
  // if(widthScreen>='768' && widthScreen<='959') heightCapa = (widthScreen / 8)-10;
  // if(widthScreen<='767') heightCapa = (widthScreen / 4)-10;
  // if(widthScreen>='480' && widthScreen<='767') heightCapa = (widthScreen / 6)-10;
  // x$('.contenedorBoton .contenedorBlanco .icono').css({ height: heightCapa+'px' });
  //
  // myScroll.refresh();
  // x$('#cargando').css({ visibility: 'hidden'});
  // if(estadoZoom==1) x$('.md-modal').css({ visibility: 'visible' });
  // x$('#wrapper').css({ visibility: 'visible' });
  //
  // }



  // x$(window).orientationchange(function(e) {
  //   x$('#cargando').css({ visibility: 'visible'});
  //   //Comprobamos si el zoom esta activado, y si lo esta lo ocultamos mientras aparece el gif cargando
  //   if(estadoZoom==1) x$('.md-modal').css({ visibility: 'hidden' });
  //   //Ocultamos la capa contenedora de las miniaturas
  //   x$('#wrapper').css({ visibility: 'hidden' });
  //   //Esperamos unos 300 ms para que al dispositivo le de tiempo girar la pantalla, y ejecutamos la funcion calcular
  //   setTimeout(calcular,300);
  // });

  // $( ".settingUpdateButton" ).bind( "click", function(event, ui) {
  //   app.saveSettings();
  // });
