const dev = require('./config.development');
if(process.env.NODE_ENV == 'development')
{
    module.exports = dev;
}