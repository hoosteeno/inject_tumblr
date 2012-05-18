(function(jq){  

  jq.fn.inject_tumblr = function(options) {

    var required = [
      'api_key',
      'tumblr_id'
    ]
    for (i=0; i<required.length; i++) {
      if (options[required[i]] == null && options.data[required[i]] == null) {
        throw new Error('inject_tumblr: ' + required[i] + ' is required');
      }
    }

    options = jq.extend({}, jq.fn.inject_tumblr.default_options, options);

    var error = false;

    var enforce_timeout = window.setTimeout(function (){
      generate_error(options.down_template);
    }, options.timeout);

    function get_posts() {
      jq.ajax({
        url: 'http://api.tumblr.com/v2/blog/'+options.tumblr_id+'.tumblr.com/posts',
        //crossDomain: true,
        dataType: 'jsonp',
        jsonp: 'jsonp',
        context: this,
        success: function(data) {
          handle_response(data);
        },
        data: options.data
      });
    }

    function enhance_post(post) {

      post.date = new Date(parseInt(post.timestamp*1000));
      post.iso_date = post.date.toISOString();
      post.human_date = post.date.toDateString();
      post.year = post.date.getFullYear();
    
      if (post.type == 'text') {
        post.body = '<div>'+post.body+'</div>';

        post.first_picture = (function(){
          return jq(post.body).find('img').first().attr('src') || 'images/blog_thumb_default.jpg';
        })();

        post.blurb = (function(){
          var blurb = document.createElement('div');
          jq(blurb).append(jq(post.body).find('p').slice(0, 2));
          return jq(blurb).html();
        })();
      }
      else if (post.type == 'photo') {
        post.body = '<div>'+post.description+'</div>';
        post.blurb = (function(){
          var blurb = document.createElement('div');
          jq(blurb).append('<img src="'+post.photos[0].alt_sizes[3].url+'" />');
          jq(blurb).append(jq(post.body).find('p').slice(0, 2));
          return jq(blurb).html();
        })();
      }
      else {
        post.body = '<div>'+post.description+'</div>';
        post.blurb = (function(){
          var blurb = document.createElement('div');
          jq(blurb).append(jq(post.body).find('p').slice(0, 2));
          return jq(blurb).html();
        })();
      }
      
      return post;
    }

    function generate_error(template) {
      if (! error) {

        if (options.loading_msg != null) {
          jq(options.loading_msg).remove();
        }

        error = true;
        element.append(Mustache.render(template, ""));
      }
    }

    var element = this;
    var posts = [];

    get_posts();

    function handle_response(result){

      if (! error) {

        if (result.meta.status != 200) {
          generate_error(options.down_template);
        }

        else if (result.response.posts.length == 0) {
          generate_error(options.no_posts_template);
        }

        else {

          window.clearTimeout(enforce_timeout);

          if (options.loading_msg != null) {
            jq(options.loading_msg).remove();
          }

          posts = result.response.posts;

          jq(posts).map(function() { 
            var post = this;

            if (options.post_type != '' && post.type != options.post_type) {
              return null;
            }

            post = enhance_post(post);

            if (options.templatize == true) {
              post = Mustache.render(options.post_template, post);
            }

            element.append(post);

            return post;
          });
        }
      }
    };

    return element;

  }

  jq.fn.inject_tumblr.post_template = '<article><figure><a href="{{post_url}}"><img src="{{first_picture}}"></a></figure><div><h3><a href="{{post_url}}">{{title}}</a></h3><time datetime="{{iso_date}}">{{human_date}}</time>{{{blurb}}}<a href="{{post_url}}">More &raquo;</a></div></article>';
  jq.fn.inject_tumblr.down_template = '<article><h3>Uh oh..</h3><div>It looks like tumblr is down right now. Please refresh your browser window in a little while.</div></article>';
  jq.fn.inject_tumblr.no_posts_template = '<article><h3>No posts yet!</h3><div>This blog is empty right now. Please check again soon!</div></article>';

  jq.fn.inject_tumblr.default_options = {
    timeout: 5000,
    templatize: true,
    tumblr_id: 'dojo4',
    loading_msg: '',
    post_template: jq.fn.inject_tumblr.post_template,
    down_template: jq.fn.inject_tumblr.down_template,
    no_posts_template: jq.fn.inject_tumblr.no_posts_template,
    post_type: '',
    data: {
      api_key: '',
      tag: '',
      limit: 10,
      filter: ''
    }
  }

  

})(jQuery);
