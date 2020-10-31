const headers = {
    "Content-Type": "application/json",
};

const client = {};

client.get = (url) => {
    return fetch(url).then((e) => e.json());
};

client.post = (url, body) => {
    return fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers,
    }).then((e) => e.json());
};

export default client;
