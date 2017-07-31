(() => {
  document.getElementById("image-input").onchange = () => {
    const files = document.getElementById('image-input').files;
    const file = files[0];
    if(file == null){
      return alert('No file selected.');
    }
    getSignedRequest(file);
  };
})();

function getSignedRequest(file){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        const response = JSON.parse(xhr.responseText);
<<<<<<< HEAD
        console.log("response  = ");
        console.log(response);
        this.uploadFile(file, response.signedRequest, response.url, response.key);
=======
        this.uploadFile(file, response.signedRequest, response.url);
>>>>>>> e0e6e982fb9db114cf015259af23d38de61d05b4
      }
      else{
        alert('Could not get signed URL.');
      }
    }
  };
  xhr.send();
}

<<<<<<< HEAD
function uploadFile(file, signedRequest, url, key){
=======
function uploadFile(file, signedRequest, url){
>>>>>>> e0e6e982fb9db114cf015259af23d38de61d05b4
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', signedRequest);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        document.getElementById('preview').src = url;
        document.getElementById('uploaded-image-url').value = url;
<<<<<<< HEAD
        document.getElementById('uploaded-image-key').value = key;
        console.log("uploaded-image-url = " + document.getElementById('uploaded-image-url').value);
=======
>>>>>>> e0e6e982fb9db114cf015259af23d38de61d05b4
      }
      else{
        alert('Could not upload file.');
      }
    }
  };
  xhr.send(file);
}
