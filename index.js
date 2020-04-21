addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
})


/**
 * Getting cookie from the request headers
 * @param {Request} request
 * @param {string} name
 */
const getCookie = (request, name) => {
  let result = null;
  let cookieString = request.headers.get('Cookie')
  if (cookieString) {
    let cookies = cookieString.split(';')
    cookies.forEach(cookie => {
      let cookieName = cookie.split('=')[0].trim()
      if (cookieName === name) {
        let cookieVal = cookie.split('=')[1]
        result = cookieVal;
      }
    })
  }
  return result;
}


/**
 * Make a fetch request to one of the two URLs, and return it as the response from the script
 * @param {Request} request
 */
async function handleRequest(request) {
  const API_URL = "https://cfw-takehome.developers.workers.dev/api/variants";

  // Request the URLs from the API
  const variants = await fetch(API_URL)
    .then(response => {

      // error checking
      if (response.status !== 200) {
        throw `API is down! :( Status code: ${request.status}`;
      }

      return response.json();
    })
    .then(json => {
      return json.variants;
    })
    .catch(err => {
      console.log(`Fetch Error! :( ${err}`)

      return new Response(`Fetch Error! :( ${err}`, {
        headers: { 'content-type': 'text/plain' },
      })
    });


  // check if there is persisting variant.
  let zeroOrOne = getCookie(request, 'variantIndex');
  console.log(`Cookie variantIndex: ${zeroOrOne}`)

  // randomly pick either url1 or url2 for new visitor.
  if (!zeroOrOne) {
    zeroOrOne = Math.floor(Math.random() * 2)
  }

  let response = await fetch(variants[zeroOrOne]);
  response = new Response(response.body, response);

  // set cookie
  response.headers.set('Set-Cookie', `variantIndex=${zeroOrOne}`);

  return response;


}

