const button = document.querySelector("button")

button.addEventListener("click", () => {
  fetch("http://localhost:3000/api/v1/stripe/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      order_details: [
        {
          // deliverable_id: "1e1e1106-abb8-442d-b8b6-86f5d074bbbc",
          title: "Project File Submition",
          // deliverable_application: {
          //   application_id: "a3cba015-3737-4b04-85ef-b5b877d13ce2",
          price: 200000,
          //   student_id: "UqS5MbD2RtPxJ83LWCgapm8tXBj2"
          // }
        }
      ],
    })
  })
    .then(res => {
      if (res.ok) return res.json()
      return res.json().then(json => Promise.reject(json))
    })
    .then(({ url }) => {
      window.location = url
    })
    .catch(e => {
      console.error(e.error)
    })
})
