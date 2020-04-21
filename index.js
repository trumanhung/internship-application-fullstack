addEventListener('fetch', event => {
  const API_URL = "https://cfw-takehome.developers.workers.dev/api/variants";
  event.respondWith(handleRequest(API_URL));
})

/**
 * Make a fetch request to one of the two URLs, and return it as the response from the script
 * @param {Request} request
 */
async function handleRequest(request) {

  // Request the URLs from the API
  const response = fetch(request)
    .then(response => {

      // error checking
      if (response.status !== 200) {
        throw `API is down! :( Status code: ${request.status}`;
      }

      return response.json();
    })
    .then(data => {
      let url1 = data.variants[0];
      let url2 = data.variants[1];

      let zeroOrOne = Math.floor(Math.random() * 2)

      let finalResponse;

      // 50% chance of return either url1 or url2.
      if (zeroOrOne) {
        finalResponse = fetch(url1);
      } else {
        finalResponse = fetch(url2);
      }

      return finalResponse;
    })
    .catch(err => {
      console.log(`Fetch Error! :( ${err}`)

      return new Response(`Fetch Error! :( ${err}`, {
        headers: { 'content-type': 'text/plain' },
      })

    });

    return response;






}

