;(() => {
	if ("serviceWorker" in navigator) {
		/* The "in" operator returns true if the specified property is in the specified 
        object or its prototype chain. this if statement is a form of feature detection */
		window.addEventListener("load", () => {
			/* we use load so that it registers as soon as the page loads. but you 
            could use another event if you wanted, like a click or something.. idk 
            why you would though */
			navigator.serviceWorker.register("service-worker.js").then(
				registration => {
					console.log("service worker successfully registered!!!")
					console.log("registration:", registration)
				},
				err => {
					console.log("error:", err)
				}
			)
		})
	} else {
		alert("service workers not supported in this browser")
	}
})()

// ;(() => {
// 	fetch("https://opentdb.com/api.php?amount=1")
// 		.then(response => {
// 			// return {
// 			// 	response_code: 0,
// 			// 	results: [
// 			// 		{
// 			// 			type: "multiple",
// 			// 			difficulty: "medium",
// 			// 			category: "Sports",
// 			// 			question: "Who won the 2011 Stanley Cup?",
// 			// 			correct_answer: "Boston Bruins",
// 			// 			incorrect_answers: [Array],
// 			// 		},
// 			// 	],
// 			// }.json()

// 			return response.json()

// 			// response.json will return a promise that should resolve to an object.

// 			/* once I call response.json(), the response body is removed from the
//             response object to conserve memory and overhead (cpu time, network bandwidth)
//             before being converted to an object.

//             That's why you get an error when trying to call res.json() twice. there's nothing to parse.
//             the only way to access it is returning it and using another .then() to
//             resolve the promise and save it or use it somewhere. */
// 		})
// 		.then(data => {
// 			console.log(data)
// 			console.log(data.results[0].question)
// 			console.log(data.results[0].correct_answer)
// 		})
// 		.catch(err => {
// 			console.log(err)
// 		})
// })()
