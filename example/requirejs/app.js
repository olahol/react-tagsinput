requirejs.config({
  paths: {
    'react': 'https://unpkg.com/react@16.3.1/umd/react.development',
    'react-dom': 'https://unpkg.com/react-dom@16.3.1/umd/react-dom.development',
    'prop-types': 'https://unpkg.com/prop-types@15.6.1/prop-types',
    'react-tagsinput': '../../react-tagsinput',
  },
});

requirejs(['main']);
