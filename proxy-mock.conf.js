const PROXY_CONFIG = [
  {
    context: '/api',

    // hostname to the target server
    target: 'http://localhost:8000',

    // set correct host headers for name-based virtual hosted sites
    changeOrigin: true,

    headers: {
      'Cache-Control': 'no-cache '
    },

    // enable websocket proxying
    ws: true,

    secure: false,

    // rewrite paths
    pathRewrite:
        function (path, req) {
          if(path.startsWith('/api/users/current.json')) {
            return '/api/redmine-users/v1/users/1';
          }
          if(path.startsWith('/api/enumerations/time_entry_activities.json')) {
            return '/api/redmine-activities/v1/activities/1';
          }
          if(path.startsWith('/api/issues.json')) {
            return '/api/redmine-issues/v1/issues/1';
          }
          if(path.startsWith('/api/time_entries.json?issue_id=')) {
            return path.replace('time_entries.json?issue_id=', 'redmine-time/v1/time_entries/').replace(/&user_id=\d*&limit=\d*/g, '');
          }
          if(path.startsWith('/api/time_entries.json')) {
            return '/api/redmine-time/v1/time_entries/';
          }
          return 'unknown'
        },

    // control logging
    logLevel: 'debug'

  }
]

/**
 * Create the proxy middleware, so it can be used in a server.
 */
module.exports = PROXY_CONFIG;
