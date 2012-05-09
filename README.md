# inject_tumblr

## A jQuery plugin for putting some Tumblr posts on your site

### Instructions and Caveats

1. Get [mustache.js](https://github.com/janl/mustache.js) and inject-tumblr.js and put in your web directory.
1. Include both in a script tag:

        <script src="/javascripts/mustache.js" type="text/javascript"></script>
        <script src="/javascripts/inject_tumblr.js" type="text/javascript"></script>

1. Call inject_tumblr on a set of jQuery elements:

        <script>
          jq('#tumblr').inject_tumblr({
            tumblr_id: 'theonlymagicleftisart',
            data: {
              api_key: '3VCeCoG7JTnON_get_your_own_key_dude_WhAv0A'
            }
          });
        </script>

1. Optional and recommended! Provide your own mustache templates for rendering the output:

        <script>
          jq('#tumblr').inject_tumblr({
            tumblr_id: 'theonlymagicleftisart',
            down_template: jq('script.template[name="tumblr-down-template"]').first().html(),
            post_template: jq('script.template[name="tumblr-post-template"]').first().html(),
            data: {
              api_key: '3VCeCoG7JTnON_get_your_own_key_dude_WhAv0A'
            }
          });
        </script>

1. Optional! Make a cool pinwheel graphic or prancing unicorn that will display while the plugin gets posts from Tumblr, and then vanish like magic when it has loaded:

        <script>
          jq('#tumblr').inject_tumblr({
            tumblr_id: 'theonlymagicleftisart',
            loading_msg: jq('#tumblr .loading'),
            data: {
              api_key: '3VCeCoG7JTnON_get_your_own_key_dude_WhAv0A'
            }
          });
        </script>

1. A fairly complete set of configurable parameters is below, with their defaults:

        jq.fn.inject_tumblr.default_options = {
          timeout: 5000,
          templatize: true,
          tumblr_id: 'theonlymagicleftisart',
          loading_msg: '',
          post_template: jq.fn.inject_tumblr.post_template,
          down_template: jq.fn.inject_tumblr.down_template,
          no_posts_template: jq.fn.inject_tumblr.no_posts_template,
          post_type: 'text',
          data: {
            api_key: '',
            tag: '',
            limit: 10,
            filter: ''
          }
        }

1. There are certainly bugs, since it's my first jQuery plugin. What a great opportunity for us to learn from one another!
