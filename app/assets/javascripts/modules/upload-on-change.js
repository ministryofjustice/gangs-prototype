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
        this.uploadFile(file, response.signedRequest, response.url, response.key);
      }
      else{
        alert('Could not get signed URL.');
      }
    }
  };
  xhr.send();
}

function uploadFile(file, signedRequest, url, key){
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', signedRequest);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        document.getElementById('preview').src = url;
        document.getElementById('uploaded-image-url').value = url;
        document.getElementById('uploaded-image-key').value = key;
        document.getElementById('image-search-submit').removeAttribute('disabled');
      }
      else{
        alert('Could not upload file.');
      }
    }
  };
  xhr.send(file);
}
