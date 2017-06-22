function loginUser(userName, userPassword) {
	// alert("loginUser username[" + userName + "] password[" + userPassword + "]");
	$.ajax({
	    type       : "POST",
	    url        : "http://" + app.server + "/fileService/login",
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

function getPhoto(photoId, width, heigth) {
	$.ajax({
	    type       : "POST",
	    url        : "http://" + app.server + "/fileService/getPhoto",
	    crossDomain: true,
	    beforeSend : function() {$.mobile.loading('show')},
	    complete   : function() {$.mobile.loading('hide')},
	    data       : '{"photoId":' + photoId + ', "width":' + width + ', "heigth":' + heigth + '}',
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

function getPhotoById(photoId) {
	//alert("PhotoId[" + photoId + "] width[" + width + "] heigth[" + heigth + "]");
	$.ajax({
	    type       : "GET",
	    url        : "http://" + app.server + "/fileService/getPhoto",
	    crossDomain: true,
	    beforeSend : function() {$.mobile.loading('show')},
	    complete   : function() {$.mobile.loading('hide')},
			dataType	 : "json",
	    data       : '{"photoId":' + photoId + ', "width":' + width + ', "heigth":' + heigth + '}',
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

function getThumb(photoId, width, heigth) {
	alert("getThumb PhotoId[" + photoId + "] width[" + width + "] heigth[" + heigth + "]");
	$.ajax({
	    type       : "POST",
	    url        : "http://" + app.server + "/fileService/getThumb",
	    crossDomain: true,
	    beforeSend : function() {$.mobile.loading('show')},
	    complete   : function() {$.mobile.loading('hide')},
			dataType	 : "json",
	    data       : '{"photoId":' + photoId + ', "width":' + width + ', "heigth":' + heigth + '}',
			contentType: "application/json; charset=utf-8",
	    success    : function(response) {
					var img = $('<img id="' + response.id + '" data-theme="a">');
					img.attr('src', "data:" + response.mime + ";base64," + response.bytes);
					img.attr('height', "150px");
					img.attr('width', "150px");
					img.tap(app.tapPhoto);
					img.appendTo('#divPhotos');

					app.loadThumb();
	    },
	    error      : function(xhr, status, error) {
	        //console.error("error");
	        alert("ERROR - xhr.status: " + xhr.status + '\nxhr.responseText: ' + xhr.responseText + '\nxhr.statusText: ' + xhr.statusText + '\nError: ' + error + '\nStatus: ' + status);
	    }
	}, false);
}

function downloadThumb(photoId, width, heigth) {

	$.ajax({
	    type       : "POST",
	    url        : "http://" + app.server + "/fileService/downloadThumb",
	    crossDomain: true,
	    beforeSend : function() {$.mobile.loading('show')},
	    complete   : function() {$.mobile.loading('hide')},
			//dataType	 : "image/jpeg",
	    data       : '{"photoId":' + photoId + ', "width":' + width + ', "heigth":' + heigth + '}',
			contentType: "application/json; charset=utf-8",
	    success    : function(response) {
				var img = $('<img id="' + photoId + '" data-theme="a">'); //Equivalent: $(document.createElement('img'))

				img.attr('src', "data:image/jpeg;base64," + response);
				img.attr('height', "150px");
				img.attr('width', "150px");
				img.tap(app.tapPhoto);
				img.appendTo('#divPhotos');
				$('#divPhotos').trigger('resize');
				app.loadThumb();
	    },
	    error      : function(xhr, status, error) {
	        //console.error("error");
	        alert("ERROR - xhr.status: " + xhr.status + '\nxhr.responseText: ' + xhr.responseText + '\nxhr.statusText: ' + xhr.statusText + '\nError: ' + error + '\nStatus: ' + status);
	    }
	}, false);
}

function getThumbs() {
	$.ajax({
	    type       : "POST",
	    url        : "http://" + app.server + "/fileService/getThumbs",
	    crossDomain: true,
	    beforeSend : function() {$.mobile.loading('show')},
	    complete   : function() {$.mobile.loading('hide')},
			dataType	 : "json",
			contentType: "application/json; charset=utf-8",
	    success    : function(response) {
				app.thumbs = response;
				app.thumbIndex = 0;
				app.createThumbs();
	    },
	    error      : function(xhr, status, error) {
	        //console.error("error");
	        alert("ERROR - xhr.status: " + xhr.status + '\nxhr.responseText: ' + xhr.responseText + '\nxhr.statusText: ' + xhr.statusText + '\nError: ' + error + '\nStatus: ' + status);
	    }
	}, false);
}
