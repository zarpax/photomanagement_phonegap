function loginUser(userName, userPassword) {
	// alert("loginUser username[" + userName + "] password[" + userPassword + "]");
	$.ajax({
	    type       : "POST",
	    url        : "http://192.168.2.3:8080/fileService/login",
	    crossDomain: true,
	    beforeSend : function() {$.mobile.loading('show')},
	    complete   : function() {$.mobile.loading('hide')},
			dataType	 : "json",
	    data       : JSON.stringify(app.appSettings.userSettings),
			contentType: "application/json; charset=utf-8",
			async			 : false,
	    success    : function(response) {

					if (response == true) {
						$.mobile.changePage("#pageGallery");
					} else {
						$.mobile.changePage("#pageSettings");
					}

	    },
	    error      : function(xhr, status, error) {
	        alert("ERROR - xhr.status: " + xhr.status + '\nxhr.responseText: ' + xhr.responseText + '\nxhr.statusText: ' + xhr.statusText + '\nError: ' + error + '\nStatus: ' + status);
	    }
	}, false);
}

function getPhoto(photoId) {
	$.ajax({
	    type       : "POST",
	    url        : "http://192.168.2.3:8080/fileService/getPhoto",
	    crossDomain: true,
	    beforeSend : function() {$.mobile.loading('show')},
	    complete   : function() {$.mobile.loading('hide')},
			dataType	 : "json",
	    data       : '{"photoId":' + photoId + '}',
			contentType: "application/json; charset=utf-8",
	    success    : function(response) {
				app.showImage(response);
	    },
	    error      : function(xhr, status, error) {
	        //console.error("error");
	        alert("ERROR - xhr.status: " + xhr.status + '\nxhr.responseText: ' + xhr.responseText + '\nxhr.statusText: ' + xhr.statusText + '\nError: ' + error + '\nStatus: ' + status);
	    }
	}, false);
}

function getRecentThumbs() {
	$.ajax({
	    type       : "POST",
	    url        : "http://192.168.2.3:8080/fileService/getLast100Thumbs",
	    crossDomain: true,
	    beforeSend : function() {$.mobile.loading('show')},
	    complete   : function() {$.mobile.loading('hide')},
			dataType	 : "json",
			contentType: "application/json; charset=utf-8",
	    success    : function(response) {
				for(number in response) {
					thumb = response[number];
					var img = $('<img id="' + thumb.id + '">'); //Equivalent: $(document.createElement('img'))
					img.attr('src', "data:" + thumb.mime + ";base64," + thumb.bytes);
					img.attr('height', "50px");
					img.attr('width', "50px");
					img.tap(app.tapPhoto);
					img.appendTo('#divPhotos');
				};
	    },
	    error      : function(xhr, status, error) {
	        //console.error("error");
	        alert("ERROR - xhr.status: " + xhr.status + '\nxhr.responseText: ' + xhr.responseText + '\nxhr.statusText: ' + xhr.statusText + '\nError: ' + error + '\nStatus: ' + status);
	    }
	}, false);
}
