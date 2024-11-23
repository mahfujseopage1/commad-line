const callApi = async (data) => {

  try {

    const response = await fetch('http://localhost:5000/take-screenshot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("result", result)
    return result
  } catch (error) {
    console.log("error in callApi", error)

  }

}


const data = [
  {
    url: 'https://www.npmjs.com/package/dom-to-image',
    width: 320,
    height: 568,
  },
  {
    url: 'https://www.npmjs.com/package/dom-to-image',
    width: 360,
    height: 740,
  },
  {
    url: 'https://www.npmjs.com/package/dom-to-image',
    width: 414,
    height: 896,
  },
  {
    url: 'https://www.npmjs.com/package/dom-to-image',
    width: 1024,
    height: 1366,
  },
  {
    url: 'https://www.npmjs.com/package/dom-to-image',
    width: 1366,
    height: 768,
  }
]

data.forEach(async (item, index) => {
  const result = await callApi({
    ...item,
    id: index
  })
  console.log("result", result)
})