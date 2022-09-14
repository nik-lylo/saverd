// env-based configs
export const {
  API_URL,
} = {
  // command: `npm run build`
  production: {
    API_URL: 'https://saverd-qa321.herokuapp.com/',
  },

  // command: `npm run start`
  development: {
    API_URL: 'https://saverd-qa321.herokuapp.com/',
  },
}[ process.env.BUILD_MODE ]
