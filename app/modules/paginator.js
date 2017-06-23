var paginator = {
  visibleElements: function(array, page, per_page) {
    page=page || 1;
    per_page=per_page || 20;

    var start=(page - 1) * per_page;
    var end=start + per_page;

    return array.slice(start, end);
  }
}


module.exports = paginator;