var paginator = {
  visibleElements: function(array, page, per_page) {
    page=page || 1;
    per_page=per_page || 20;

    var start=(page - 1) * per_page;
    var end=start + per_page;

    return array.slice(start, end);
  },

  paginationParamsWithDefaults: function(params, defaults) {
    return {
      page: params['page'] || defaults['page'] || 1,
      per_page: params['per_page'] || defaults['per_page'] || 20
    }
  }
}


module.exports = paginator;