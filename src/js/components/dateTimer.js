let time = document.querySelector("#dateTime");
time.addEventListener("change", (event) => {
  let time = event.target.value;
  console.log(event.target.value);
  console.log(new Date(time).toString());
});

let button = document.querySelector("#setTime");

button.addEventListener("click", () => {
  console.log(time.value);
  time.value = "2017-08-14T10:30";
});
