const Interceptor = (toIntercept = {}) => {
    // /* INTERCETTO FETCH SU SEARCHRESULT */
    const { fetch: originalFetch } = window;
    window.fetch = async (...args) => {
        let [resource, config] = args; // console.log('Res', resource); // console.log('Conf', config); // console.log('Args', args);
        let response = await originalFetch(resource, config);

        // console.log(resource,config);
        // response interceptor
        response
            .clone()
            .json()
            .then(function (json) { // console.log('JSON: ', json);
                if (json) {
                    Object.keys(toIntercept).map((param) => {
                        // console.log(param);
                        if (resource.indexOf(param) >= 0) { // callback(json); console.log('Find!!');
                            // console.log(config);
                            toIntercept[param].cb(
                                toIntercept[param].response ? json : config
                            )
                        }
                    })
                }

            })

        return response;
    }
}

export default Interceptor;