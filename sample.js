var loadFile = function (event) {
    var image = document.getElementById("profile-avatar");
    image.src = URL.createObjectURL(event.target.files[0]);
  };
  